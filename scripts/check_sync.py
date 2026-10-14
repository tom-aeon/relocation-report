"""Fails (exit 1) if the home page and the Places page disagree.
Usage: python3 scripts/check_sync.py [base_url]   (default: serves ./dist on a free port)"""
import sys, subprocess, socket, time, asyncio, os
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
