import Image from 'next/image';
import Link from 'next/link';

import { loadDashboardData } from '@/lib/gameData';

export default async function MapPage() {
  const { map, areaMap } = await loadDashboardData();
  const worldWidth = map.image?.width_px ?? 1024;
  const worldHeight = map.image?.height_px ?? 768;
  const areaWidth = areaMap?.image?.width_px ?? 640;
  const areaHeight = areaMap?.image?.height_px ?? 480;

  return (
    <main>
      <section className="panel" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div className="badge">Белинташ — Map Viewer</div>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', marginBottom: 8 }}>Пълна карта</h1>
          <p className="subtitle">
            Данните се зареждат директно от <code>maps/world/index.json</code> и <code>maps/areas/&lt;id&gt;.json</code>.
            Обнови изображенията и JSON-ите и просто рефрешни страницата.
          </p>
        </div>
        <Link href="/" className="map-link">
          ← Назад към конзолата
        </Link>
      </section>

      <section className="panel">
        <h2>World map</h2>
        {map.imageDataUrl ? (
          <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid var(--panel-border)', marginBottom: 16 }}>
            <Image
              src={map.imageDataUrl}
              alt="Belintash world map"
              width={worldWidth}
              height={worldHeight}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              priority
            />
          </div>
        ) : map.ascii_preview ? (
          <pre style={{ fontFamily: 'monospace', fontSize: 14 }}>{map.ascii_preview.join('\n')}</pre>
        ) : (
          <p className="subtitle">Добави `maps/world/world.png`, за да визуализираме пълната карта.</p>
        )}
        {map.regions && map.regions.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="subtitle">Regions</div>
            <ul>
              {map.regions.map((region) => (
                <li key={region.id}>{region.label ?? region.id}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Активна локация (Mini map)</h2>
        {areaMap?.imageDataUrl ? (
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
            <Image
              src={areaMap.imageDataUrl}
              alt={`Mini map for ${areaMap.area_id ?? 'area'}`}
              width={areaWidth}
              height={areaHeight}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </div>
        ) : areaMap?.ascii_preview ? (
          <pre style={{ fontFamily: 'monospace', fontSize: 14 }}>{areaMap.ascii_preview.join('\n')}</pre>
        ) : (
          <p className="subtitle">
            Не е намерено изображение за текущата локация. Постави `maps/areas/{areaMap?.area_id ?? 'default-area'}.png`.
          </p>
        )}
        {areaMap?.hotspots && areaMap.hotspots.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="subtitle">Hotspots</div>
            <ul>
              {areaMap.hotspots.map((hotspot) => (
                <li key={hotspot.id}>
                  <strong>{hotspot.label ?? hotspot.id}</strong>
                  {hotspot.linked_quest_ids && hotspot.linked_quest_ids.length > 0 && (
                    <span className="subtitle"> · Quests: {hotspot.linked_quest_ids.join(', ')}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
