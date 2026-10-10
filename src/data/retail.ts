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
}
