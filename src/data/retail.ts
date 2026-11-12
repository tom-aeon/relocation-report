// Everyday-retail check, 10 Oct 2026. Real stores only (sources per stop). Drive times are OSRM free-flow estimates from the base shown.
import type { Retail } from './places'

export const RETAIL: Record<string, Retail> = {
 "cantley": {
  "base": "Cantley area centre (the app’s map marker; the report has no listing address)",
  "checked": "10 Oct 2026",
  "method": "Stores from web search (store-locator / listing pages) and OpenStreetMap; addresses geocoded (US Census / Nominatim); OSRM free-flow drive times, no traffic.",
  "coffee": [
   {
    "name": "Tim Hortons (Cantley)",
    "address": "415 Montée de la Source, Cantley, QC J8V 3B5",
    "driveMin": 5,
    "driveText": "~5 min (3.1 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   },
   {
    "name": "Starbucks (SmartCentres Gatineau)",
    "address": "71 Boulevard de la Gappe, Gatineau, QC J8T 0C7",
    "driveMin": 19,
    "driveText": "~19 min (14.0 km)",
    "mark": "pass",
    "source": "https://maps.apple.com/place?place-id=I18FC0EDC3BECB622"
   },
   {
    "name": "Starbucks (Boul. Gréber)",
    "address": "325 Boulevard Gréber, Gatineau, QC J8T 8J3",
    "driveMin": 20,
    "driveText": "~20 min (14.8 km)",
    "mark": "pass",
    "source": "https://mapdoor.ca/qc/gatineau/starbucks/boul-gr%C3%A9ber"
   }
  ],
  "bigBox": [
   {
    "name": "Walmart Supercentre (de la Gappe)",
    "address": "51 Boulevard de la Gappe, Gatineau, QC J8T 0B5",
    "driveMin": 19,
    "driveText": "~19 min (13.9 km)",
    "mark": "pass",
    "source": "https://www.walmart.ca/fr/store/1086"
   },
   {
    "name": "Costco Gatineau",
    "address": "1100 Boulevard Maloney Ouest, Gatineau, QC J8T 6G3",
    "driveMin": 20,
    "driveText": "~20 min (15.0 km)",
    "mark": "pass",
    "source": "https://www.costco.ca/m/warehouse-locations/gatineau-qc-542.html"
   },
   {
    "name": "Canadian Tire (de la Carrière)",
    "address": "355 Boulevard de la Carrière, Gatineau, QC J8Y 6W4",
    "driveMin": 21,
    "driveText": "~21 min (15.8 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   },
   {
    "name": "Walmart Supercentre (Maloney)",
    "address": "640 Boulevard Maloney Ouest, Gatineau, QC J8T 8K7",
    "driveMin": 22,
    "driveText": "~22 min (17.1 km)",
    "mark": "pass",
    "source": "https://www.walmart.ca/en/store/3125-gatineau-qc"
   }
  ],
  "hardware": [
   {
    "name": "RONA+ Gatineau",
    "address": "777 Boulevard de la Cité, Gatineau, QC J8T 8J9",
    "driveMin": 20,
    "driveText": "~20 min (15.1 km)",
    "mark": "pass",
    "source": "https://www.rona.ca/fr/magasin/quebec/gatineau/rona-gatineau-41070"
   },
   {
    "name": "The Home Depot Gatineau",
    "address": "243 Montée Paiement, Gatineau, QC J8P 6M7",
    "driveMin": 22,
    "driveText": "~22 min (16.8 km)",
    "mark": "pass",
    "source": "https://stores.homedepot.ca/qc/gatineau/home-improvement-gatineau-qc-7140.html"
   }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Tim Hortons (Cantley) ~5 min; big box Walmart Supercentre (de la Gappe) ~19 min; hardware RONA+ Gatineau ~20 min. Nearest Starbucks ~19 min (Gatineau)."
 },
 "forsyth": {
  "base": "2785 Pilgrim Mill Rd, Cumming, GA (the report’s example listing)",
  "checked": "10 Oct 2026",
  "method": "Stores from web search (store-locator / listing pages) and OpenStreetMap; addresses geocoded (US Census / Nominatim); OSRM free-flow drive times, no traffic.",
  "coffee": [
   {
    "name": "Starbucks (Browns Bridge Rd)",
    "address": "3630 Browns Bridge Rd, Cumming, GA 30028",
    "driveMin": 9,
    "driveText": "~9 min (8.6 km)",
    "mark": "pass",
    "source": "https://www.restaurantji.com/ga/cumming/starbucks-8/"
   },
   {
    "name": "Starbucks (GA 400 @ Hwy 20)",
    "address": "906 Buford Hwy, Cumming, GA 30041",
    "driveMin": 9,
    "driveText": "~9 min (8.8 km)",
    "mark": "pass",
    "source": "https://www.starbucks.com/store-locator/store/12847/ga-400-hwy-20-906-buford-hwy-cumming-ga-300412718-us"
   }
  ],
  "bigBox": [
   {
    "name": "Costco Cumming",
    "address": "1211 Bald Ridge Marina Rd, Cumming, GA 30041",
    "driveMin": 7,
    "driveText": "~7 min (6.8 km)",
    "mark": "pass",
    "source": "https://www.costco.com/w/-/ga/cumming/1175"
   },
   {
    "name": "Walmart Supercenter Cumming",
    "address": "1500 Market Place Blvd, Cumming, GA 30041",
    "driveMin": 9,
    "driveText": "~9 min (10.1 km)",
    "mark": "pass",
    "source": "https://www.walmart.com"
   },
   {
    "name": "Target Cumming",
    "address": "1525 Market Place Blvd, Cumming, GA 30041",
    "driveMin": 9,
    "driveText": "~9 min (10.2 km)",
    "mark": "pass",
    "source": "https://www.target.com/sl/cumming/1394"
   }
  ],
  "hardware": [
   {
    "name": "The Home Depot Cumming",
    "address": "1000 Market Place Blvd, Cumming, GA 30041",
    "driveMin": 9,
    "driveText": "~9 min (9.6 km)",
    "mark": "pass",
    "source": "https://www.homedepot.com/l/Cumming/GA/Cumming/30041/134"
   },
   {
    "name": "Lowe's Cumming",
    "address": "935 Marketplace Blvd, Cumming, GA 30041",
    "driveMin": 9,
    "driveText": "~9 min (9.7 km)",
    "mark": "pass",
    "source": "https://www.lowes.com/store/GA-Cumming/0678"
   }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks (Browns Bridge Rd) ~9 min; big box Costco Cumming ~7 min; hardware The Home Depot Cumming ~9 min"
 },
 "happy-valley": {
  "base": "Happy Valley area centre (the app’s map marker; no specific listing in the report)",
  "checked": "10 Oct 2026",
  "method": "Stores from web search (store-locator / listing pages) and OpenStreetMap; addresses geocoded (US Census / Nominatim); OSRM free-flow drive times, no traffic.",
  "coffee": [
   {
    "name": "Starbucks (Happy Valley Crossroads)",
    "address": "17005 SE Sunnyside Rd, Happy Valley, OR 97015",
    "driveMin": 4,
    "driveText": "~4 min (1.8 km)",
    "mark": "pass",
    "source": "https://www.starbucks.com/store-locator/store/1016362"
   },
   {
    "name": "Starbucks (Sunnyside Rd)",
    "address": "14669 SE Sunnyside Rd, Happy Valley, OR 97015",
    "driveMin": 7,
    "driveText": "~7 min (3.8 km)",
    "mark": "pass",
    "source": "https://www.starbucks.com/store-locator/store/91099/"
   }
  ],
  "bigBox": [
   {
    "name": "Target Clackamas",
    "address": "9000 SE Sunnyside Rd, Clackamas, OR 97015",
    "driveMin": 14,
    "driveText": "~14 min (8.8 km)",
    "mark": "pass",
    "source": "https://www.target.com/sl/clackamas/346"
   },
   {
    "name": "Costco Clackamas",
    "address": "13130 SE 84th Ave, Clackamas, OR 97015",
    "driveMin": 14,
    "driveText": "~14 min (9.5 km)",
    "mark": "pass",
    "source": "https://www.costco.com/warehouse-locations/clackamas-clackamas-or-97.html"
   },
   {
    "name": "Walmart Happy Valley",
    "address": "10000 SE 82nd Ave, Happy Valley, OR 97086",
    "driveMin": 16,
    "driveText": "~16 min (10.7 km)",
    "mark": "pass",
    "source": "https://maps.apple.com/place?place-id=IC44EA067541D4CD9"
   }
  ],
  "hardware": [
   {
    "name": "Lowe's Clackamas County",
    "address": "13631 SE Johnson Rd, Milwaukie, OR 97222",
    "driveMin": 15,
    "driveText": "~15 min (13.2 km)",
    "mark": "pass",
    "source": "https://www.lowes.com/store/OR-Milwaukie/1824"
   },
   {
    "name": "The Home Depot Clackamas",
    "address": "9300 SE 82nd Ave, Happy Valley, OR 97086",
    "driveMin": 17,
    "driveText": "~17 min (11.5 km)",
    "mark": "pass",
    "source": "https://www.homedepot.com/l/Clackamas/OR/Happy-Valley/97086/4040"
   }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks (Happy Valley Crossroads) ~4 min; big box Target Clackamas ~14 min; hardware Lowe's Clackamas County ~15 min"
 },
 "elizabeth": {
  "base": "5360 Pine Ridge Dr, Elizabeth, CO (the report’s example listing)",
  "checked": "10 Oct 2026",
  "method": "Stores from web search (store-locator / listing pages) and OpenStreetMap; addresses geocoded (US Census / Nominatim); OSRM free-flow drive times, no traffic.",
  "coffee": [
   {
    "name": "Starbucks (inside Safeway)",
    "address": "220 S Elizabeth St, Elizabeth, CO 80107",
    "driveMin": 7,
    "driveText": "~7 min (5.9 km)",
    "mark": "pass",
    "source": "https://local.safeway.com/safeway/co/elizabeth/220-s-elizabeth-st.html"
   }
  ],
  "bigBox": [
   {
    "name": "Walmart Supercenter Elizabeth",
    "address": "2100 Legacy Cir, Elizabeth, CO 80107",
    "driveMin": 6,
    "driveText": "~6 min (6.1 km)",
    "mark": "pass",
    "source": "https://www.storeopeninghours.com/retailers/walmart/elizabeth-co"
   }
  ],
  "hardware": [
   {
    "name": "The Home Depot Castle Rock",
    "address": "333 W Allen St, Castle Rock, CO 80108",
    "driveMin": 30,
    "driveText": "~30 min (33.2 km)",
    "mark": "partial",
    "source": "https://www.homedepot.com/l/CO/Elizabeth/COj6opEr"
   },
   {
    "name": "The Home Depot Parker",
    "address": "11111 S Parker Rd, Parker, CO 80134",
    "driveMin": 30,
    "driveText": "~30 min (33.1 km)",
    "mark": "partial",
    "source": "https://www.homedepot.com/l/CO/Elizabeth/COj6opEr"
   },
   {
    "name": "Lowe's Parker",
    "address": "10000 S Twenty Mile Rd, Parker, CO 80134",
    "driveMin": 33,
    "driveText": "~33 min (35.5 km)",
    "mark": "partial",
    "source": "https://www.lowes.com/store/CO-Parker/1755"
   }
  ],
  "overall": "partial",
  "note": "Nearest: coffee Starbucks (inside Safeway) ~7 min; big box Walmart Supercenter Elizabeth ~6 min; hardware The Home Depot Castle Rock ~30 min"
 },
 "boise": {
  "base": "Boise foothills area (the app’s map marker; no listing address in the report)",
  "checked": "10 Oct 2026",
  "method": "Stores from web search (store-locator / listing pages) and OpenStreetMap; addresses geocoded (US Census / Nominatim); OSRM free-flow drive times, no traffic.",
  "coffee": [
   {
    "name": "Starbucks (North End)",
    "address": "1650 W State St, Boise, ID 83702",
    "driveMin": 12,
    "driveText": "~12 min (5.3 km)",
    "mark": "pass",
    "source": "https://starbucks.restaurantlocationmaps.com/en/location/37138-starbucks-1650-w-state-st"
   },
   {
    "name": "Starbucks (W State St)",
    "address": "5021 W State St, Boise, ID 83703",
    "driveMin": 17,
    "driveText": "~17 min (8.5 km)",
    "mark": "pass",
    "source": "https://www.mapquest.com/us/idaho/starbucks-23708647"
   }
  ],
  "bigBox": [
   {
    "name": "Target Boise",
    "address": "633 N Milwaukee St, Boise, ID 83704",
    "driveMin": 20,
    "driveText": "~20 min (12.9 km)",
    "mark": "pass",
    "source": "https://www.target.com/sl/boise/617"
   },
   {
    "name": "Costco Boise",
    "address": "2051 S Cole Rd, Boise, ID 83709",
    "driveMin": 22,
    "driveText": "~22 min (13.9 km)",
    "mark": "pass",
    "source": "https://www.costco.com/warehouse-locations/boise-id-761.html"
   },
   {
    "name": "Walmart Supercenter",
    "address": "8300 W Overland Rd, Boise, ID 83709",
    "driveMin": 22,
    "driveText": "~22 min (14.9 km)",
    "mark": "pass",
    "source": "https://maps.apple.com/place?place-id=I2464661165071403"
   }
  ],
  "hardware": [
   {
    "name": "The Home Depot Boise",
    "address": "1200 N Milwaukee St, Boise, ID 83704",
    "driveMin": 20,
    "driveText": "~20 min (12.9 km)",
    "mark": "pass",
    "source": "https://www.homedepot.com"
   },
   {
    "name": "Lowe's Boise",
    "address": "7990 W Overland Rd, Boise, ID 83709",
    "driveMin": 21,
    "driveText": "~21 min (14.7 km)",
    "mark": "pass",
    "source": "https://www.lowes.com"
   }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks (North End) ~12 min; big box Target Boise ~20 min; hardware The Home Depot Boise ~20 min"
 },
 "duvall": {
  "base": "Duvall area centre (the app’s map marker; no listing address in the report)",
  "checked": "10 Oct 2026",
  "method": "Stores from web search (store-locator / listing pages) and OpenStreetMap; addresses geocoded (US Census / Nominatim); OSRM free-flow drive times, no traffic.",
  "coffee": [
   {
    "name": "Starbucks (Duvall Commons)",
    "address": "26304 NE Big Rock Rd, Duvall, WA 98019",
    "driveMin": 3,
    "driveText": "~3 min (1.6 km)",
    "mark": "pass",
    "source": "https://www.starbucks.com/store-locator/store/10763-102131/duvall-commons-duvall-26304-ne-big-rock-rd-bldg-b-duvall-wa-980199011-us"
   }
  ],
  "bigBox": [
   {
    "name": "Walmart Supercenter Monroe",
    "address": "19191 N Kelsey St, Monroe, WA 98272",
    "driveMin": 19,
    "driveText": "~19 min (16.5 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   },
   {
    "name": "Target Redmond",
    "address": "17700 NE 76th St, Redmond, WA 98052",
    "driveMin": 20,
    "driveText": "~20 min (15.7 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   },
   {
    "name": "Costco Redmond",
    "address": "7725 188th Ave NE, Redmond, WA 98052",
    "driveMin": 20,
    "driveText": "~20 min (15.7 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   }
  ],
  "hardware": [
   {
    "name": "Lowe's Monroe",
    "address": "19393 Tjerne Pl SE, Monroe, WA 98272",
    "driveMin": 16,
    "driveText": "~16 min (15.6 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   },
   {
    "name": "The Home Depot Redmond",
    "address": "17777 NE 76th St, Redmond, WA 98052",
    "driveMin": 20,
    "driveText": "~20 min (15.7 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks (Duvall Commons) ~3 min; big box Walmart Supercenter Monroe ~19 min; hardware Lowe's Monroe ~16 min"
 },
 "maryville": {
  "base": "Maryville area (the app’s map marker, close to town; the 6-acre listing had no address in the report, so rural acreage would be farther)",
  "checked": "10 Oct 2026",
  "method": "Stores from web search (store-locator / listing pages) and OpenStreetMap; addresses geocoded (US Census / Nominatim); OSRM free-flow drive times, no traffic.",
  "coffee": [
   {
    "name": "Starbucks (Watkins & Lamar Alexander Pkwy)",
    "address": "1011 W Lamar Alexander Pkwy, Maryville, TN 37801",
    "driveMin": 4,
    "driveText": "~4 min (3.0 km)",
    "mark": "pass",
    "source": "https://www.restaurantji.com/tn/maryville/starbucks-/"
   }
  ],
  "bigBox": [
   {
    "name": "Target Maryville",
    "address": "800 Watkins Rd, Maryville, TN 37801",
    "driveMin": 4,
    "driveText": "~4 min (2.9 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   },
   {
    "name": "Walmart Supercenter Alcoa",
    "address": "1030 Hunters Crossing Dr, Alcoa, TN 37701",
    "driveMin": 5,
    "driveText": "~5 min (3.1 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   }
  ],
  "hardware": [
   {
    "name": "The Home Depot Maryville",
    "address": "943 Foothills Mall Dr, Maryville, TN 37801",
    "driveMin": 4,
    "driveText": "~4 min (3.5 km)",
    "mark": "pass",
    "source": "https://www.homedepot.com/l/Maryville/TN/Maryville/37801/724"
   },
   {
    "name": "Lowe's Alcoa",
    "address": "1098 Hunters Crossing Dr, Alcoa, TN 37701",
    "driveMin": 5,
    "driveText": "~5 min (3.4 km)",
    "mark": "pass",
    "source": "OpenStreetMap"
   }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks (Watkins & Lamar Alexander Pkwy) ~4 min; big box Target Maryville ~4 min; hardware The Home Depot Maryville ~4 min"
 }
,
 "victor-mendon": {
  "base": "Victor / Mendon map marker (near 629 W Bloomfield Rd, Mendon, NY)",
  "checked": "12 Nov 2026",
  "method": "Stores from OpenStreetMap / Nominatim (and the 12 Nov 2026 scout geocodes for Victor, Greensboro and Cranberry); OSRM free-flow drive times from the place map marker, no traffic.",
  "coffee": [
    {
      "name": "Starbucks (Pittsford village)",
      "address": "24 State Street, Village of Pittsford, New York, 14534",
      "driveMin": 11,
      "driveText": "~11 min (5.2 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/8785742428"
    },
    {
      "name": "Starbucks (High Point Drive, Victor)",
      "address": "200 High Point Drive, Victor, NY 14564",
      "driveMin": 14,
      "driveText": "~14 min (7.4 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/search?query=Starbucks%20200%20High%20Point%20Drive%20Victor%20NY"
    }
  ],
  "bigBox": [
    {
      "name": "Walmart Supercenter Victor",
      "address": "441 Commerce Drive, Town of Victor, New York, 14564",
      "driveMin": 15,
      "driveText": "~15 min (7.2 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/396899180"
    },
    {
      "name": "Target Victor",
      "address": "7500 Commons Boulevard, Victor, NY 14564",
      "driveMin": 15,
      "driveText": "~15 min (8.0 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/search?query=Target%207500%20Commons%20Boulevard%20Victor%20NY"
    }
  ],
  "hardware": [
    {
      "name": "The Home Depot (Commons Boulevard, Victor)",
      "address": "7600 Commons Boulevard, Victor, NY 14564",
      "driveMin": 18,
      "driveText": "~18 min (8.3 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/search?query=Home%20Depot%207600%20Commons%20Boulevard%20Victor%20NY"
    },
    {
      "name": "The Home Depot (Jefferson Road, Rochester)",
      "address": "770 Jefferson Road, City of Rochester, New York, 14623",
      "driveMin": 19,
      "driveText": "~19 min (9.6 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/126305926"
    }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks (Pittsford village) ~11 min; big box Target Victor ~15 min (Walmart Supercenter Victor also ~15 min); hardware The Home Depot Victor ~18 min."
},
 "stokesdale": {
  "base": "Stokesdale / Oak Ridge map marker (Oak Ridge, NC)",
  "checked": "12 Nov 2026",
  "method": "Stores from OpenStreetMap / Nominatim (and the 12 Nov 2026 scout geocodes for Victor, Greensboro and Cranberry); OSRM free-flow drive times from the place map marker, no traffic.",
  "coffee": [
    {
      "name": "Starbucks (South Main Street, Kernersville)",
      "address": "971 South Main Street, Kernersville, North Carolina, 27284",
      "driveMin": 15,
      "driveText": "~15 min (7.8 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/2842751608"
    },
    {
      "name": "Starbucks (Northline Avenue, Greensboro)",
      "address": "3102 Northline Avenue, Greensboro, North Carolina, 27408",
      "driveMin": 19,
      "driveText": "~19 min (13.0 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/12865307746"
    }
  ],
  "bigBox": [
    {
      "name": "Target (South Main Street, Kernersville)",
      "address": "1090 South Main Street, Kernersville, North Carolina, 27284",
      "driveMin": 17,
      "driveText": "~17 min (8.1 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/339553724"
    },
    {
      "name": "Walmart Supercenter (Kernersville)",
      "address": "1130 South Main Street, Kernersville, North Carolina, 27284",
      "driveMin": 17,
      "driveText": "~17 min (8.3 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/339553725"
    },
    {
      "name": "Target (Bridford Parkway, Greensboro)",
      "address": "1212 Bridford Parkway, Greensboro, NC 27407",
      "driveMin": 17,
      "driveText": "~17 min (12.6 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/search?query=Target%201212%20Bridford%20Parkway%20Greensboro%20NC"
    }
  ],
  "hardware": [
    {
      "name": "Lowe's (Battleground Avenue, Greensboro)",
      "address": "3001 Battleground Avenue, Greensboro, North Carolina, 27408",
      "driveMin": 18,
      "driveText": "~18 min (12.1 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/323175009"
    },
    {
      "name": "The Home Depot (Wendover, Greensboro)",
      "address": "4425 West Wendover Avenue, Greensboro, NC 27407",
      "driveMin": 18,
      "driveText": "~18 min (13.0 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/search?query=Home%20Depot%204425%20West%20Wendover%20Avenue%20Greensboro%20NC"
    }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks Kernersville ~15 min; big box Target Kernersville ~17 min; hardware Lowe's Greensboro ~18 min."
},
 "wexford-pine": {
  "base": "Wexford / Pine Township map marker (Wexford, PA)",
  "checked": "12 Nov 2026",
  "method": "Stores from OpenStreetMap / Nominatim (and the 12 Nov 2026 scout geocodes for Victor, Greensboro and Cranberry); OSRM free-flow drive times from the place map marker, no traffic.",
  "coffee": [
    {
      "name": "Starbucks (Perry Highway, Wexford)",
      "address": "11354 Perry Highway, Wexford, Pennsylvania, 15090",
      "driveMin": 2,
      "driveText": "~2 min (0.5 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/361157483"
    },
    {
      "name": "Starbucks (Perry Highway, McCandless)",
      "address": "10590 Perry Highway, McCandless, Pennsylvania, 15090",
      "driveMin": 4,
      "driveText": "~4 min (1.2 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/2385907031"
    }
  ],
  "bigBox": [
    {
      "name": "Target (Blazier Drive, McCandless / North Hills)",
      "address": "105 Blazier Drive, Pittsburgh, Pennsylvania, 15237",
      "driveMin": 9,
      "driveText": "~9 min (3.4 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/3785146320"
    },
    {
      "name": "Walmart (Cranberry Township)",
      "address": "20245 Perry Highway, Cranberry Township, Pennsylvania, 16066",
      "driveMin": 12,
      "driveText": "~12 min (5.3 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/2333126254"
    }
  ],
  "hardware": [
    {
      "name": "Lowe's (Mars Road, Cranberry Township)",
      "address": "1717 Mars Road, Cranberry Township, Pennsylvania, 16066",
      "driveMin": 13,
      "driveText": "~13 min (5.8 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/365789021"
    },
    {
      "name": "The Home Depot (Dutilh Road, Cranberry Township)",
      "address": "25 Dutilh Road, Cranberry Township, PA 16066",
      "driveMin": 13,
      "driveText": "~13 min (5.6 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/search?query=Home%20Depot%2025%20Dutilh%20Road%20Cranberry%20Township%20PA"
    }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks Wexford ~2 min; big box Target McCandless ~9 min; hardware Lowe's Cranberry ~13 min."
},
 "apex-holly-springs": {
  "base": "Apex / Holly Springs map marker (near SW Wake County)",
  "checked": "12 Nov 2026",
  "method": "Stores from OpenStreetMap / Nominatim (and the 12 Nov 2026 scout geocodes for Victor, Greensboro and Cranberry); OSRM free-flow drive times from the place map marker, no traffic.",
  "coffee": [
    {
      "name": "Starbucks (Grand Hill Place, Holly Springs)",
      "address": "185 Grand Hill Place, Holly Springs, North Carolina, 27540",
      "driveMin": 6,
      "driveText": "~6 min (3.4 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/10138327621"
    },
    {
      "name": "Starbucks (West Williams Street, Apex)",
      "address": "1268 West Williams Street, Apex, North Carolina, 27502",
      "driveMin": 10,
      "driveText": "~10 min (5.0 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/11148636784"
    }
  ],
  "bigBox": [
    {
      "name": "Walmart Supercenter (Apex Peakway)",
      "address": "3151 Apex Peakway, Apex, North Carolina, 27502",
      "driveMin": 6,
      "driveText": "~6 min (3.1 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/207924787"
    },
    {
      "name": "Target (Grand Hill Place, Holly Springs)",
      "address": "100 Grand Hill Place, Holly Springs, North Carolina, 27540",
      "driveMin": 7,
      "driveText": "~7 min (3.9 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/10138327624"
    }
  ],
  "hardware": [
    {
      "name": "Lowe's (Holly Springs)",
      "address": "2240 Wildwood Lowes Greenway, Holly Springs, North Carolina, 27540",
      "driveMin": 10,
      "driveText": "~10 min (6.1 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/1019578609"
    },
    {
      "name": "The Home Depot (Vision Drive, Apex)",
      "address": "1000 Vision Drive, Apex, North Carolina, 27523",
      "driveMin": 10,
      "driveText": "~10 min (6.7 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/32076712"
    }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks Holly Springs ~6 min; big box Walmart Supercenter Apex ~6 min; hardware Lowe's Holly Springs ~10 min."
},
 "guelph-eramosa": {
  "base": "Guelph/Eramosa map marker (near 5066 Wellington 32 Road)",
  "checked": "12 Nov 2026",
  "method": "Stores from OpenStreetMap / Nominatim (and the 12 Nov 2026 scout geocodes for Victor, Greensboro and Cranberry); OSRM free-flow drive times from the place map marker, no traffic.",
  "coffee": [
    {
      "name": "Starbucks (Gordon Street, Guelph)",
      "address": "Gordon Street, Guelph, Ontario, N1H 4H7",
      "driveMin": 9,
      "driveText": "~9 min (7.3 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/6757526631"
    },
    {
      "name": "Tim Hortons (Woodlawn Road West, Guelph)",
      "address": "134 Woodlawn Road West, Guelph, Ontario, N1H 1B2",
      "driveMin": 12,
      "driveText": "~12 min (10.7 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/475982817"
    }
  ],
  "bigBox": [
    {
      "name": "Costco Guelph",
      "address": "19 Elmira Road South, Guelph, Ontario, N1K 0B6",
      "driveMin": 7,
      "driveText": "~7 min (5.4 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/384476551"
    },
    {
      "name": "Walmart Supercentre (Stone Road West, Guelph)",
      "address": "175 Stone Road West, Guelph, Ontario, N1G 5L4",
      "driveMin": 11,
      "driveText": "~11 min (7.8 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/search?query=Walmart%20175%20Stone%20Road%20West%20Guelph"
    }
  ],
  "hardware": [
    {
      "name": "Canadian Tire (Stone Road West, Guelph)",
      "address": "127 Stone Road West, Guelph, Ontario, N1G 5G4",
      "driveMin": 11,
      "driveText": "~11 min (7.9 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/121429571"
    },
    {
      "name": "The Home Depot (Woodlawn Road West, Guelph)",
      "address": "63 Woodlawn Road West, Guelph, Ontario, N1H 1G8",
      "driveMin": 13,
      "driveText": "~13 min (11.2 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/239063767"
    }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks Guelph ~9 min; big box Costco Guelph ~7 min; hardware Canadian Tire Guelph ~11 min."
},
 "cochrane": {
  "base": "Cochrane, Alberta map marker (town centre)",
  "checked": "12 Nov 2026",
  "method": "Stores from OpenStreetMap / Nominatim (and the 12 Nov 2026 scout geocodes for Victor, Greensboro and Cranberry); OSRM free-flow drive times from the place map marker, no traffic.",
  "coffee": [
    {
      "name": "Starbucks (5th Avenue, Cochrane)",
      "address": "5th Avenue West, Town of Cochrane, Alberta, T4C 0A4",
      "driveMin": 2,
      "driveText": "~2 min (0.8 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/196786051"
    },
    {
      "name": "Tim Hortons (West Side Drive, Cochrane)",
      "address": "West Side Drive, Town of Cochrane, Alberta, T4C 1M1",
      "driveMin": 4,
      "driveText": "~4 min (2.1 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/234166760"
    }
  ],
  "bigBox": [
    {
      "name": "Walmart Supercentre (Cochrane)",
      "address": "Centre Avenue, Town of Cochrane, Alberta, T4V 2A7",
      "driveMin": 1,
      "driveText": "~1 min (0.1 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/3355295391"
    }
  ],
  "hardware": [
    {
      "name": "Canadian Tire (Bow Street, Cochrane)",
      "address": "Bow Street, Town of Cochrane, Alberta, T4C 2N1",
      "driveMin": 2,
      "driveText": "~2 min (0.5 km)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/489635595"
    }
  ],
  "overall": "pass",
  "note": "Nearest: coffee Starbucks Cochrane ~2 min; big box Walmart Supercentre Cochrane ~1 min; hardware Canadian Tire Cochrane ~2 min. These are in-town; west-foothills acreage would be a few minutes farther."
},
 "waxhaw-lake-norman": {
  "base": "Waxhaw, NC map marker (retail measured from Waxhaw; Lake Norman is farther north)",
  "checked": "12 Nov 2026",
  "method": "Stores from OpenStreetMap / Nominatim (and the 12 Nov 2026 scout geocodes for Victor, Greensboro and Cranberry); OSRM free-flow drive times from the place map marker, no traffic.",
  "coffee": [
    {
      "name": "Starbucks (Rea Road, Waxhaw)",
      "address": "9700 Rea Road, Waxhaw, North Carolina, 28173",
      "driveMin": 20,
      "driveText": "~20 min (10.2 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/525658734"
    },
    {
      "name": "Starbucks (Old Monroe Road, Indian Trail)",
      "address": "6701 Old Monroe Road, Indian Trail, North Carolina, 28079",
      "driveMin": 21,
      "driveText": "~21 min (11.7 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/999036295"
    }
  ],
  "bigBox": [
    {
      "name": "Walmart (Cuthbertson Road, Waxhaw)",
      "address": "2520 Cuthbertson Road, Waxhaw, North Carolina, 28173",
      "driveMin": 5,
      "driveText": "~5 min (2.5 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/12495560318"
    },
    {
      "name": "Target (Olde Towne Drive, Monroe)",
      "address": "2901 Olde Towne Drive, Monroe, North Carolina, 28110",
      "driveMin": 24,
      "driveText": "~24 min (14.9 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/node/12035679413"
    },
    {
      "name": "Walmart Supercenter (Roosevelt Boulevard, Monroe)",
      "address": "2406 West Roosevelt Boulevard, Monroe, North Carolina, 28110",
      "driveMin": 24,
      "driveText": "~24 min (14.0 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/794379782"
    }
  ],
  "hardware": [
    {
      "name": "Lowe's (Cuthbertson Road, Waxhaw)",
      "address": "2508 Cuthbertson Road, Waxhaw, North Carolina, 28173",
      "driveMin": 5,
      "driveText": "~5 min (2.6 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/859820843"
    },
    {
      "name": "Lowe's (Roosevelt Boulevard, Monroe)",
      "address": "2350 West Roosevelt Boulevard, Monroe, North Carolina, 28110",
      "driveMin": 22,
      "driveText": "~22 min (13.8 mi)",
      "mark": "pass",
      "source": "https://www.openstreetmap.org/way/794379781"
    }
  ],
  "overall": "pass",
  "note": "Nearest from the Waxhaw marker: coffee Starbucks Rea Road ~20 min; big box Walmart Cuthbertson Road ~5 min; hardware Lowe's Cuthbertson Road ~5 min. Lake Norman / Davidson is a separate, more northern pin — retail there was not re-measured and would use a different set of Charlotte-north stores."
}
}
