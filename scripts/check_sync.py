"""Fails (exit 1) if the home page and the Places page disagree.
Usage: python3 scripts/check_sync.py [base_url]   (default: serves ./dist on a free port)"""
import sys, subprocess, socket, time, asyncio, os, json, re

HERE = os.path.dirname(os.path.abspath(__file__))

CURRENT_IDS = ['forsyth','happy-valley','duvall','cantley','maryville','elizabeth','boise','on-carp-huntley','on-dunrobin','on-north-gower','on-flamborough','on-oro-medonte','toronto','victor-mendon','stokesdale','wexford-pine','apex-holly-springs','guelph-eramosa','cochrane','waxhaw-lake-norman']
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


# Places still in play (not dropped, including Other) that must have a sourced crime entry.
CRIME_IDS = ['forsyth','happy-valley','duvall','cantley','maryville','elizabeth','boise','on-carp-huntley','on-dunrobin','on-north-gower','on-flamborough','on-oro-medonte','toronto','victor-mendon','stokesdale','wexford-pine','apex-holly-springs','guelph-eramosa','cochrane','waxhaw-lake-norman']
# Do not introduce racial or ethnic population data anywhere in this project.
CRIME_BANNED = re.compile(
    r'\b(racial|ethnicity|ethnic group|race breakdown|by race|black population|white population|hispanic population|asian population|demographic breakdown by race|visible[- ]minority|visible minority|immigrant[- ]origin|immigrant status|ethnocultural|ancestry)\b',
    re.I,
)

def check_crime():
    f = []
    ts_path = os.path.join(HERE, '..', 'src', 'data', 'crime.ts')
    ts = open(ts_path, encoding='utf-8').read()
    if CRIME_BANNED.search(ts):
        f.append('src/data/crime.ts contains racial or ethnic population language — that is not allowed')
    src_root = os.path.join(HERE, '..', 'src')
    for dirpath, _, files in os.walk(src_root):
        for name in files:
            if not name.endswith(('.ts', '.tsx', '.css', '.json')):
                continue
            path = os.path.join(dirpath, name)
            text = open(path, encoding='utf-8').read()
            if CRIME_BANNED.search(text):
                rel = os.path.relpath(path, os.path.join(HERE, '..'))
                f.append(f'{rel} contains racial or ethnic population language — that is not allowed')
    if 'coral-springs' not in ts or 'Coral Springs Police Department' not in ts:
        f.append('crime data is missing the Coral Springs Police Department baseline')
    for pid in CRIME_IDS:
        pat = r"(placeId:\s*['\"]" + re.escape(pid) + r"['\"]|['\"]" + re.escape(pid) + r"['\"]\s*:)"
        if not re.search(pat, ts):
            f.append(f'crime data is missing a place entry for {pid}')
    # Every figure is built by fbi(), scRate() or scCsi(), which must set source, year and agency.
    for helper in ('fbi', 'scRate', 'scCsi'):
        m = re.search(r'const ' + helper + r' = \((.*?)\)\s*:\s*Crime(?:Figure|Index)\s*=>\s*\({(.*?)\}\)', ts, re.S)
        if not m:
            f.append(f'crime data helper {helper}() was not found; figures must be built with source, year and agency')
            continue
        params, body = m.group(1), m.group(2)
        for field in ('year', 'agency', 'sourceUrl'):
            if field not in params and field not in body:
                f.append(f'crime data helper {helper}() does not set {field} on every figure')
    urls = re.findall(r"'(https?://[^']+)'", ts)
    official = [u for u in urls if any(h in u for h in ('cde.ucr.cjis.gov', 'statcan.gc.ca', 'fbi.gov'))]
    if len(official) < 5:
        f.append(f'crime data has only {len(official)} official source URLs; expected FBI CDE and Statistics Canada table URLs')
    for u in official:
        if not u.startswith('https://'):
            f.append(f'crime figure source is not https: {u!r}')
    if 'cde.ucr.cjis.gov' not in ts:
        f.append('crime data does not cite the FBI Crime Data Explorer')
    if 'statcan.gc.ca' not in ts or '35100180' not in ts:
        f.append('crime data does not cite Statistics Canada police-service tables')
    for m in re.finditer(r'ratePer100k:\s*([0-9.]+)', ts):
        if float(m.group(1)) == 0:
            window = ts[max(0, m.start()-400):m.end()+400]
            if 'reportedZero: true' not in window and 'reportedZero:true' not in window:
                f.append('a crime rate of 0 was found without reportedZero: true — missing data must be null, not 0')
    return f


def check_population():
    f = []
    ts_path = os.path.join(HERE, '..', 'src', 'data', 'population.ts')
    if not os.path.exists(ts_path):
        return ['src/data/population.ts is missing']
    ts = open(ts_path, encoding='utf-8').read()
    if 'Coral Springs city, Florida' not in ts:
        f.append('population data is missing the Coral Springs city baseline')
    for pid in CRIME_IDS:
        pat = r"(placeId:\s*['\"]" + re.escape(pid) + r"['\"]|['\"]" + re.escape(pid) + r"['\"]\s*:)"
        if not re.search(pat, ts):
            f.append(f'population data is missing a place entry for {pid}')
    # Helpers that attach source, year and geography to every figure.
    for helper in ('acsNum', 'acsIncome', 'acsEdu', 'acsCommute', 'pepPop', 'pepGrowth', 'acsGrowth',
                   'scEst', 'scEstGrowth', 'scCensusPop', 'scCensusGrowth', 'scAge', 'scIncome', 'scEdu', 'scCommute'):
        if 'function ' + helper + '(' not in ts and 'function ' + helper + ' (' not in ts:
            f.append(f'population data helper {helper}() was not found; figures must be built with source, year and geography')
            continue
        # A loose window after the function name should mention the required fields.
        m = re.search(r'function ' + helper + r'\b[\s\S]{0,2500}?\n\}', ts)
        body = m.group(0) if m else ''
        for field in ('sourceUrl', 'geography'):
            if field not in body:
                f.append(f'population data helper {helper}() does not set {field} on every figure')
        if 'year' not in body and 'fromYear' not in body:
            f.append(f'population data helper {helper}() does not set year (or fromYear/toYear) on every figure')
    urls = re.findall(r"'(https?://[^']+)'", ts)
    official = [u for u in urls if any(h in u for h in (
        'census.gov', 'data.census.gov', 'www2.census.gov', 'statcan.gc.ca',
    ))]
    if len(official) < 8:
        f.append(f'population data has only {len(official)} official source URLs; expected Census Bureau and Statistics Canada URLs')
    for u in official:
        if not u.startswith('https://'):
            f.append(f'population figure source is not https: {u!r}')
    if 'ACSDT5Y2024' not in ts and 'acs/summary_file/2024' not in ts:
        f.append('population data does not cite ACS 2024 5-year estimates')
    if '17100155' not in ts:
        f.append('population data does not cite Statistics Canada CSD population estimates (table 17-10-0155-01)')
    # Required characteristics exist as fields
    for field in ('medianAge', 'medianIncome', 'bachelorPct', 'meanCommute', 'population', 'growth'):
        if field not in ts:
            f.append(f'population data is missing the {field} field')
    # allPopulationFigures is the inventory used to confirm every figure is sourced
    if 'export function allPopulationFigures' not in ts:
        f.append('population data does not export allPopulationFigures() for validation')
    return f


from playwright.async_api import async_playwright

CURRENT = ['best', 'live', 'stretch', 'parked']

async def run(base):
    errs, fails = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='chrome'); pg = await b.new_page()
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        # Don't wait on third-party Google Maps embeds; we still assert the iframe/link is present.
        async def _abort_maps(route):
            await route.abort()
        await pg.route('**/*maps.google.com/**', _abort_maps)
        await pg.route('**/*google.com/maps/**', _abort_maps)
        await pg.route('**/*maps.gstatic.com/**', _abort_maps)
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
        fails += check_crime()
        fails += check_population()
        nd = []
        await pg.goto(base + '#/places', wait_until='networkidle')
        nd = [await c.get_attribute('data-id') for c in await pg.locator('[data-testid="places-card"]').all() if await c.get_attribute('data-status') != 'dropped']
        fails += check_amenities(sorted(set(nd) | set(CURRENT_IDS)))
        # Prefer a place we know has crime + homes (forsyth) if it's in the list
        sample = (['forsyth'] if 'forsyth' in nd else []) + [i for i in nd if i != 'forsyth']
        for pid in sample[:2]:
            await pg.goto(base + '#/places/' + pid, wait_until='networkidle')
            if await pg.get_by_test_id('amenities-section').count() != 1: fails.append(f'place page {pid} has no amenities section')
            if await pg.get_by_test_id('crime-section').count() != 1: fails.append(f'place page {pid} has no crime section')
            gl = pg.get_by_test_id('google-maps-link')
            if await gl.count() < 1: fails.append(f'place page {pid} has no Open in Google Maps link')
            else:
                href = await gl.first.get_attribute('href') or ''
                if '/maps/search/' not in href or 'query=' not in href: fails.append(f'place page {pid} Google Maps link looks wrong: {href!r}')
                if await gl.first.get_attribute('target') != '_blank' or 'noopener' not in (await gl.first.get_attribute('rel') or ''):
                    fails.append(f'place page {pid} Google Maps link must be target=_blank rel=noopener noreferrer')
            if await pg.get_by_test_id('place-map-embed').count() != 1: fails.append(f'place page {pid} has no embedded place map')
            if await pg.get_by_test_id('crime-chart').count() != 1: fails.append(f'place page {pid} has no crime comparison chart')
            if await pg.get_by_test_id('population-section').count() != 1: fails.append(f'place page {pid} has no population section')
            if await pg.get_by_test_id('population-chart').count() != 1: fails.append(f'place page {pid} has no population comparison chart')
            pop_txt = await pg.get_by_test_id('population-section').inner_text()
            if 'Coral Springs' not in pop_txt:
                fails.append(f'place page {pid} population section does not mention Coral Springs')
            for tid in ('pop-total', 'pop-growth', 'pop-age', 'pop-income', 'pop-education', 'pop-commute'):
                if await pg.get_by_test_id(tid).count() < 1:
                    fails.append(f'place page {pid} is missing {tid}')
            if await pg.locator('[data-testid="homes-section"] [data-testid="home-map-embed"], [data-testid="homes-section"] [data-testid="home-map-embed-fallback"]').count() == 0:
                # only required when the place has qualifying homes
                if await pg.get_by_test_id('home-card').count() > 0:
                    fails.append(f'place page {pid} home cards have no embedded maps')
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
        await pg.goto(base + '#/map', wait_until='networkidle')
        if await pg.get_by_test_id('crime-layer-toggle').count() != 1:
            fails.append('map page has no crime layer toggle')
        else:
            await pg.get_by_test_id('crime-layer-toggle').click()
            # The toggle writes a URL param; wait for the layer (and baseline label) to render.
            try:
                await pg.get_by_text('Coral Springs', exact=False).first.wait_for(timeout=8000)
            except Exception:
                pass
            body = await pg.inner_text('body')
            if 'Coral Springs' not in body: fails.append('crime map layer does not mention Coral Springs')
        await pg.goto(base + '#/graphs', wait_until='networkidle')
        if await pg.get_by_test_id('crime-graph').count() != 1:
            fails.append('graphs page has no crime comparison chart')
        if await pg.get_by_test_id('population-graph').count() != 1:
            fails.append('graphs page has no population comparison chart')
        await b.close()
    # Third-party map iframes (Google) often write console errors we cannot control; ignore those.
    def _ours(e):
        s = (e or '').lower()
        return not any(k in s for k in ('maps.google', 'google.com/maps', 'maps.gstatic', 'googleapis.com', 'gg-maps', 'cookie', 'third-party'))
    fails += [f'console error: {e}' for e in errs if _ours(e)]
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
