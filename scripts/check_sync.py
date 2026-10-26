"""Fails (exit 1) if the home page and the Places page disagree.
Usage: python3 scripts/check_sync.py [base_url]   (default: serves ./dist on a free port)"""
import sys, subprocess, socket, time, asyncio, os, json, re

HERE = os.path.dirname(os.path.abspath(__file__))

CURRENT_IDS = ['forsyth','happy-valley','duvall','cantley','maryville','elizabeth','boise','on-carp-huntley','on-dunrobin','on-north-gower','on-flamborough','on-oro-medonte','toronto']
AM_KEYS = ['ski','rink','park','stadium','university','hospital','golf']
def check_amenities(ids):
    f = []
    am = json.load(open(os.path.join(HERE, 'amenities.json')))
    for pid in ids:
        a = am.get(pid)
        if not a: f.append(f'place {pid} has no amenities entry'); continue
        if not a.get('asOf'): f.append(f'place {pid} amenities lack an as-of date')
        for k in AM_KEYS:
            c = a.get(k)
            if c is None: f.append(f'place {pid} amenities missing category {k}'); continue
            if not c['items'] and not c.get('note'): f.append(f'place {pid} {k}: no items and no explanation')
            for i in c['items']:
                if not re.match(r'https?://', i.get('source') or ''): f.append(f"place {pid} {k} item {i.get('name')!r} has no source")
    return f

def check_listings():
    f = []
    data = json.load(open(os.path.join(HERE, 'homes.json')))
    ts = open(os.path.join(HERE, '..', 'src', 'data', 'homes.ts'), encoding='utf-8').read()
    for h in data['homes']:
        u = h.get('url') or ''
        if not re.fullmatch(r'https?://[^\s/$.?#][^\s]*\.[^\s]+', u): f.append(f"listing {h['id']} has no valid http(s) URL: {u!r}")
        if u and u not in ts: f.append(f"listing {h['id']} URL missing from src/data/homes.ts (re-run generator)")
        tot = lambda x: sum(int(p or 0) for p in str(x or 0).split('+'))
        if tot(h.get('beds')) < 4: f.append(f"listing {h['id']} has under 4 beds: {h.get('beds')}")
        if tot(h.get('baths')) < 3: f.append(f"listing {h['id']} has under 3 baths: {h.get('baths')}")
        if not h.get('photos'): f.append(f"listing {h['id']} has no photo")
        for ph in h.get('photos', []):
            if not os.path.isfile(os.path.join(HERE, '..', 'public', ph)): f.append(f"listing {h['id']} photo file missing: {ph}")
    return f, len(data['homes'])

from playwright.async_api import async_playwright

CURRENT = ['best', 'live', 'stretch', 'parked']

async def run(base):
    errs, fails = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto(base + '#/', wait_until='networkidle')
        home_counts = {}
        for el in await pg.locator('[data-testid^="home-count-"]').all():
            home_counts[(await el.get_attribute('data-testid')).removeprefix('home-count-')] = int(await el.get_attribute('data-count'))
        cards = [(await c.get_attribute('data-id'), await c.get_attribute('data-status')) for c in await pg.locator('[data-testid="home-current-card"]').all()]
        headline = await pg.get_by_test_id('home-headline').inner_text()
        await pg.goto(base + '#/places', wait_until='networkidle')
        places_counts = {}
        for el in await pg.locator('[data-testid^="places-count-"]').all():
            places_counts[(await el.get_attribute('data-testid')).removeprefix('places-count-')] = int(await el.get_attribute('data-count'))
        total = int(await pg.get_by_test_id('places-total').get_attribute('data-count'))
        if home_counts != places_counts: fails.append(f'status counts differ: home={home_counts} places={places_counts}')
        if total != sum(places_counts.values()): fails.append(f'places default list ({total}) is not every place ({sum(places_counts.values())}): a default filter is hiding places')
        cur_n = sum(home_counts.get(s, 0) for s in CURRENT)
        if len(cards) != cur_n: fails.append(f'home shows {len(cards)} current cards but counts say {cur_n}')
        await pg.goto(base + '#/places?s=' + ','.join(CURRENT), wait_until='networkidle')
        pl = [(await c.get_attribute('data-id'), await c.get_attribute('data-status')) for c in await pg.locator('[data-testid="places-card"]').all()]
        if sorted(pl) != sorted(cards): fails.append(f'current places differ: home={cards} places={pl}')
        if [s for _, s in cards] != sorted([s for _, s in cards], key=CURRENT.index): fails.append('home cards are not in status order')
        if f'{len(cards)} current options' not in headline: fails.append(f'headline does not match cards: {headline!r}')
        for _, st in cards:
            if st not in CURRENT: fails.append(f'non-current status on home: {st}')
        lf, n = check_listings(); fails += lf
        nd = []
        await pg.goto(base + '#/places', wait_until='networkidle')
        nd = [await c.get_attribute('data-id') for c in await pg.locator('[data-testid="places-card"]').all() if await c.get_attribute('data-status') != 'dropped']
        fails += check_amenities(sorted(set(nd) | set(CURRENT_IDS)))
        for pid in nd[:2]:
            await pg.goto(base + '#/places/' + pid, wait_until='networkidle')
            if await pg.get_by_test_id('amenities-section').count() != 1: fails.append(f'place page {pid} has no amenities section')
        await pg.goto(base + '#/homes', wait_until='networkidle')
        hc = pg.get_by_test_id('home-card')
        if await hc.count() != n: fails.append(f'homes page shows {await hc.count()} cards, data has {n}')
        for c in await hc.all():
            u = await c.get_attribute('data-url')
            v = c.get_by_test_id('view-listing')
            if await v.count() != 1 or await v.get_attribute('href') != u or await v.get_attribute('target') != '_blank' or 'noopener' not in (await v.get_attribute('rel') or ''):
                fails.append(f'card {u} lacks a proper View listing button')
            if not re.match(r'https?://', u or ''): fails.append(f'card has invalid listing URL {u!r}')
        imgs = await pg.evaluate("Promise.all([...document.querySelectorAll('[data-testid=home-card] img')].map(i=>(i.loading='eager', i.decode().then(()=>i.naturalWidth).catch(()=>0))))")
        if any(w == 0 for w in imgs): fails.append(f'{sum(w == 0 for w in imgs)} home photos failed to load')
        print('listings     :', n)
        await b.close()
    fails += [f'console error: {e}' for e in errs]
    print('home counts  :', home_counts); print('places counts:', places_counts); print('home cards   :', [i for i, _ in cards])
    if fails:
        print('SYNC CHECK FAILED'); [print(' -', f) for f in fails]; return 1
    print('SYNC CHECK OK'); return 0

if __name__ == '__main__':
    if len(sys.argv) > 1: sys.exit(asyncio.run(run(sys.argv[1])))
    s = socket.socket(); s.bind(('', 0)); port = s.getsockname()[1]; s.close()
    dist = os.path.join(os.path.dirname(__file__), '..', 'dist')
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '-d', dist], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    try: sys.exit(asyncio.run(run(f'http://localhost:{port}/')))
    finally: srv.terminate()
