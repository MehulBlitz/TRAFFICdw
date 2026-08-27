/**
 * Web Scraping & Ingestion Studio Engine (Scrapy & BeautifulSoup Simulator)
 * Parses simulated live HTML feeds of Highway & Toll Plazas,
 * extracts traffic metrics via CSS/XPath selectors, and stages ETL loads into Route_Traffic_Fact.
 */

import { RouteTrafficFact } from '../types/trafficDW';

export interface ScrapedTrafficItem {
  tollPlaza: string;
  highway: string;
  sourceCity: string;
  destCity: string;
  vehicleType: string;
  congestion: 'Low' | 'Moderate' | 'High' | 'Severe';
  distanceKm: number;
  travelTimeMin: number;
  avgSpeedKmph: number;
  timestamp: string;
  matchedRouteKey: number;
  matchedLocationKey: number;
  matchedRoadKey: number;
  matchedVehicleKey: number;
}

export const SAMPLE_HIGHWAY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>MSRDC & NHAI Live Traffic & Toll Feed</title>
</head>
<body>
  <div class="traffic-portal" data-source="NHAI-Central-Gateway">
    <header class="feed-header">
      <h1 class="portal-title">Western Maharashtra & NCR Highway Corridor Feed</h1>
      <span class="live-badge" data-status="active">LIVE TELEMETRY STREAM</span>
    </header>

    <main class="toll-feed-container">
      <!-- Toll Plaza Record 1 -->
      <article class="toll-card" id="plaza-101" data-route-id="1">
        <div class="card-header">
          <span class="highway-name">Mumbai-Pune Expressway (NH48)</span>
          <span class="toll-point">Khalapur Toll Plaza</span>
        </div>
        <div class="telemetry-grid">
          <span class="metric-label">Vehicle Stream:</span>
          <span class="vehicle-class">SUV</span>
          <span class="metric-label">Observed Speed:</span>
          <span class="speed-value" data-unit="kmph">72.40</span>
          <span class="metric-label">Average Travel Time:</span>
          <span class="travel-time" data-unit="min">118.50</span>
          <span class="metric-label">Corridor Distance:</span>
          <span class="corridor-dist" data-unit="km">148.00</span>
          <span class="metric-label">Traffic Density:</span>
          <span class="status-badge congestion-moderate">Moderate</span>
        </div>
      </article>

      <!-- Toll Plaza Record 2 -->
      <article class="toll-card" id="plaza-102" data-route-id="2">
        <div class="card-header">
          <span class="highway-name">Eastern Express Highway</span>
          <span class="toll-point">Mulund Check Naka</span>
        </div>
        <div class="telemetry-grid">
          <span class="metric-label">Vehicle Stream:</span>
          <span class="vehicle-class">Sedan</span>
          <span class="metric-label">Observed Speed:</span>
          <span class="speed-value" data-unit="kmph">28.50</span>
          <span class="metric-label">Average Travel Time:</span>
          <span class="travel-time" data-unit="min">55.00</span>
          <span class="metric-label">Corridor Distance:</span>
          <span class="corridor-dist" data-unit="km">25.50</span>
          <span class="metric-label">Traffic Density:</span>
          <span class="status-badge congestion-high">High</span>
        </div>
      </article>

      <!-- Toll Plaza Record 3 -->
      <article class="toll-card" id="plaza-103" data-route-id="3">
        <div class="card-header">
          <span class="highway-name">Delhi-Gurugram Expressway</span>
          <span class="toll-point">Kherki Daula Toll</span>
        </div>
        <div class="telemetry-grid">
          <span class="metric-label">Vehicle Stream:</span>
          <span class="vehicle-class">Heavy Truck</span>
          <span class="metric-label">Observed Speed:</span>
          <span class="speed-value" data-unit="kmph">19.20</span>
          <span class="metric-label">Average Travel Time:</span>
          <span class="travel-time" data-unit="min">94.00</span>
          <span class="metric-label">Corridor Distance:</span>
          <span class="corridor-dist" data-unit="km">32.00</span>
          <span class="metric-label">Traffic Density:</span>
          <span class="status-badge congestion-severe">Severe</span>
        </div>
      </article>

      <!-- Toll Plaza Record 4 -->
      <article class="toll-card" id="plaza-104" data-route-id="4">
        <div class="card-header">
          <span class="highway-name">Western Express Highway</span>
          <span class="toll-point">Dahisar Toll Plaza</span>
        </div>
        <div class="telemetry-grid">
          <span class="metric-label">Vehicle Stream:</span>
          <span class="vehicle-class">Bus</span>
          <span class="metric-label">Observed Speed:</span>
          <span class="speed-value" data-unit="kmph">48.20</span>
          <span class="metric-label">Average Travel Time:</span>
          <span class="travel-time" data-unit="min">24.50</span>
          <span class="metric-label">Corridor Distance:</span>
          <span class="corridor-dist" data-unit="km">18.20</span>
          <span class="metric-label">Traffic Density:</span>
          <span class="status-badge congestion-low">Low</span>
        </div>
      </article>
    </main>
  </div>
</body>
</html>`;

export function runLiveScrapeSimulation(
  targetHtml = SAMPLE_HIGHWAY_HTML,
  cssSelector = '.toll-card',
  xpathExpression = '//article[@class="toll-card"]'
): {
  items: ScrapedTrafficItem[];
  log: string[];
  generatedRouteTrafficFacts: RouteTrafficFact[];
  scrapyCode: string;
  bs4Code: string;
} {
  const log: string[] = [];
  log.push(`[SCRAPER] Initializing Crawl Engine on target stream...`);
  log.push(`[SCRAPER] Target URL: https://telemetry.nhai.gov.in/live-corridors/feeds/html`);
  log.push(`[SCRAPER] Applied CSS Selector: "${cssSelector}" | XPath: "${xpathExpression}"`);
  log.push(`[SCRAPER] Response Status 200 OK (Content-Length: ${targetHtml.length} bytes)`);

  const parser = new DOMParser();
  const doc = parser.parseFromString(targetHtml, 'text/html');
  const cards = doc.querySelectorAll(cssSelector);

  log.push(`[SCRAPER] DOM Query returned ${cards.length} matching element nodes.`);

  const items: ScrapedTrafficItem[] = [];
  const generatedRouteTrafficFacts: RouteTrafficFact[] = [];

  cards.forEach((card, index) => {
    const highway = card.querySelector('.highway-name')?.textContent?.trim() || 'Expressway';
    const tollPlaza = card.querySelector('.toll-point')?.textContent?.trim() || 'Toll Plaza';
    const vehicleType = card.querySelector('.vehicle-class')?.textContent?.trim() || 'Sedan';
    const speed = parseFloat(card.querySelector('.speed-value')?.textContent?.trim() || '50.0');
    const travelTime = parseFloat(card.querySelector('.travel-time')?.textContent?.trim() || '60.0');
    const dist = parseFloat(card.querySelector('.corridor-dist')?.textContent?.trim() || '30.0');
    const congestion = (card.querySelector('.status-badge')?.textContent?.trim() || 'Moderate') as ScrapedTrafficItem['congestion'];

    const matchedRouteKey = index + 1 <= 4 ? index + 1 : 1;
    const matchedLocationKey = index + 1 <= 4 ? index + 1 : 1;
    const matchedRoadKey = index + 1 <= 4 ? index + 1 : 1;
    const matchedVehicleKey = vehicleType === 'Sedan' ? 1 : vehicleType === 'SUV' ? 2 : vehicleType === 'Heavy Truck' ? 3 : 4;

    const item: ScrapedTrafficItem = {
      tollPlaza,
      highway,
      sourceCity: index === 0 ? 'Mumbai' : index === 1 ? 'Thane' : index === 2 ? 'Delhi' : 'Bandra',
      destCity: index === 0 ? 'Pune' : index === 1 ? 'Mumbai' : index === 2 ? 'Gurugram' : 'Dahisar',
      vehicleType,
      congestion,
      distanceKm: dist,
      travelTimeMin: travelTime,
      avgSpeedKmph: speed,
      timestamp: new Date().toISOString(),
      matchedRouteKey,
      matchedLocationKey,
      matchedRoadKey,
      matchedVehicleKey,
    };

    items.push(item);
    log.push(`[PARSE] Node #${index + 1}: Extracted {Highway: "${highway}", Veh: "${vehicleType}", Speed: ${speed} km/h, Congestion: "${congestion}"}`);

    // Map into Route_Traffic_Fact schema
    generatedRouteTrafficFacts.push({
      Traffic_Key: 100 + index + 1,
      Route_Key: matchedRouteKey,
      Location_Key: matchedLocationKey,
      Road_Key: matchedRoadKey,
      Vehicle_Key: matchedVehicleKey,
      Time_Key: 1, // Current Time Dim
      Congestion_Level: congestion,
      Distance_KM: dist,
      Travel_Time_Min: travelTime,
      Min_Distance_Vehicles: congestion === 'Severe' ? 3 : congestion === 'High' ? 6 : congestion === 'Moderate' ? 14 : 28,
      Avg_Speed_KMPH: speed,
    });
  });

  log.push(`[ETL LOADER] Successfully mapped ${items.length} records into Route_Traffic_Fact warehouse stage.`);

  const bs4Code = `# Python BeautifulSoup4 Live Toll Web Scraper
import requests
from bs4 import BeautifulSoup
import pandas as pd

url = "https://telemetry.nhai.gov.in/live-corridors/feeds/html"
headers = {"User-Agent": "TrafficDW-Studio/2.0 (DataWarehouse Ingest Agent)"}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, "html.parser")

scraped_records = []
for card in soup.select("${cssSelector}"):
    highway = card.select_one(".highway-name").get_text(strip=True)
    toll_point = card.select_one(".toll-point").get_text(strip=True)
    veh_class = card.select_one(".vehicle-class").get_text(strip=True)
    speed = float(card.select_one(".speed-value").get_text(strip=True))
    travel_time = float(card.select_one(".travel-time").get_text(strip=True))
    dist = float(card.select_one(".corridor-dist").get_text(strip=True))
    congestion = card.select_one(".status-badge").get_text(strip=True)
    
    scraped_records.append({
        "Highway": highway,
        "Toll_Plaza": toll_point,
        "Vehicle_Type": veh_class,
        "Avg_Speed_KMPH": speed,
        "Travel_Time_Min": travel_time,
        "Distance_KM": dist,
        "Congestion_Level": congestion
    })

df = pd.DataFrame(scraped_records)
print(f"[SUCCESS] Scraped {len(df)} highway records.")
print(df.head())
`;

  const scrapyCode = `# Scrapy Spider for High-Volume Highway Stream Ingestion
import scrapy

class TrafficPlazaSpider(scrapy.Spider):
    name = "traffic_dw_spider"
    allowed_domains = ["telemetry.nhai.gov.in"]
    start_urls = ["https://telemetry.nhai.gov.in/live-corridors/feeds/html"]

    def parse(self, response):
        for card in response.xpath("${xpathExpression}"):
            yield {
                "highway": card.xpath('.//span[@class="highway-name"]/text()').get(),
                "toll_point": card.xpath('.//span[@class="toll-point"]/text()').get(),
                "vehicle_type": card.xpath('.//span[@class="vehicle-class"]/text()').get(),
                "avg_speed": float(card.xpath('.//span[@class="speed-value"]/text()').get()),
                "travel_time": float(card.xpath('.//span[@class="travel-time"]/text()').get()),
                "distance": float(card.xpath('.//span[@class="corridor-dist"]/text()').get()),
                "congestion": card.xpath('.//span[contains(@class, "status-badge")]/text()').get(),
            }
`;

  return { items, log, generatedRouteTrafficFacts, scrapyCode, bs4Code };
}
