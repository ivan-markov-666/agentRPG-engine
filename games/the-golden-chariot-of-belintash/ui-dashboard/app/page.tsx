import Image from 'next/image';
import Link from 'next/link';

import { loadDashboardData } from '@/lib/gameData';

function getCapabilityPercent(value: number, min?: number, max?: number, range?: [number, number]) {
  const floor = range ? range[0] : min ?? 0;
  const ceiling = range ? range[1] : max ?? 100;
  if (ceiling === floor) return 0;
  return Math.min(100, Math.max(0, ((value - floor) / (ceiling - floor)) * 100));
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

const suggestedNames: Record<'male' | 'female' | 'neutral', string[]> = {
  male: ['Симеон', 'Калоян', 'Добромир', 'Иванко', 'Асен'],
  female: ['Десислава', 'Калина', 'Теодора', 'Елена', 'Ефросина'],
  neutral: ['Зорница', 'Мирослава', 'Радостина', 'Вяра', 'Лада'],
};

export default async function Page() {
  const data = await loadDashboardData();
  const { session, runtime, capabilities, scene, map, areaMap, exploration, telemetry } = data;

  const stats = runtime.stats ?? {};
  const reputation = (stats.reputation as Record<string, number>) ?? {};
  const currency = (stats.currency as Record<string, number>) ?? {};

  const capabilityEntries = Object.entries(capabilities).filter(([, cap]) => cap.enabled);

  const mapImageWidth = map.image?.width_px ?? 1024;
  const mapImageHeight = map.image?.height_px ?? 768;
  const areaMapWidth = areaMap?.image?.width_px ?? 640;
  const areaMapHeight = areaMap?.image?.height_px ?? 480;

  return (
    <main>
      <section className="panel" style={{ padding: '32px', display: 'grid', gap: '16px' }}>
        <div className="badge">Белинташ — GM Console</div>
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', margin: 0 }}>{scene.title}</h1>
        <p className="subtitle">{scene.location}</p>
        <p style={{ lineHeight: 1.6 }}>{scene.description}</p>
        {scene.npcs_present && scene.npcs_present.length > 0 && (
          <p className="subtitle">NPCs: {scene.npcs_present.join(', ')}</p>
        )}
      </section>

      <section className="grid two">
        <article className="panel">
          <h2>Профил на играча</h2>
          <div className="table">
            <div>
              <div className="subtitle">Име</div>
              <strong>{session.player_name}</strong>
            </div>
            <div>
              <div className="subtitle">Пол</div>
              <strong>
                {session.player_gender}
                {session.player_gender === 'custom' && session.player_gender_custom
                  ? ` → ${session.player_gender_custom}`
                  : ''}
              </strong>
            </div>
            <div>
              <div className="subtitle">Език за сесията</div>
              <strong>{session.preferred_language}</strong>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="subtitle" style={{ marginBottom: 6 }}>
              Примерни имена за следващ run
            </div>
            <div className="grid two">
              {Object.entries(suggestedNames).map(([group, names]) => (
                <div key={group}>
                  <div className="badge">{group}</div>
                  <p>{names.join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>Състояние на света</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <div>
              <div className="subtitle">Дата</div>
              <strong>{runtime.world_state?.date ?? '—'}</strong>
            </div>
            <div>
              <div className="subtitle">Час / част от деня</div>
              <strong>{runtime.world_state?.time_of_day ?? '—'}</strong>
            </div>
            <div>
              <div className="subtitle">Време</div>
              <strong>{runtime.world_state?.weather?.type ?? '—'}</strong>
            </div>
            <div>
              <div className="subtitle">Локация</div>
              <strong>{runtime.world_state?.location?.name ?? '—'}</strong>
            </div>
          </div>
          {runtime.content_sets && (
            <div style={{ marginTop: 20 }}>
              <div className="subtitle">Content sets</div>
              <ul>
                {Object.entries(runtime.content_sets).map(([setId, info]) => (
                  <li key={setId}>
                    <strong>{setId}</strong> → {info.enabled ? 'enabled' : 'disabled'}{' '}
                    {info.notes ? `· ${info.notes}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </section>

      <section className="panel">
        <h2>Capabilities & Stats</h2>
        <div className="grid two">
          {capabilityEntries.map(([key, cap]) => {
            const rawValue = stats[key];
            const hasValue = isNumber(rawValue);
            const percent = hasValue ? getCapabilityPercent(rawValue, cap.min, cap.max, cap.range) : 0;
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{key}</strong>
                  <span>{hasValue ? rawValue : '—'}</span>
                </div>
                <div className="stat-bar">
                  <div className="stat-bar-fill" style={{ width: `${percent}%`, opacity: hasValue ? 1 : 0.2 }} />
                </div>
                <p className="subtitle">
                  {cap.desc ?? 'Няма описание.'}
                  {!hasValue && ' · Попълни стойност в player-data/runtime/state.json → stats.'}
                </p>
              </div>
            );
          })}
        </div>
        {Object.keys(reputation).length > 0 && (
          <>
            <h3 style={{ marginTop: 32 }}>Репутация</h3>
            <div className="grid two">
              {Object.entries(reputation).map(([faction, value]) => (
                <div key={faction} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{faction}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </>
        )}
        {Object.keys(currency).length > 0 && (
          <>
            <h3 style={{ marginTop: 24 }}>Валута</h3>
            <div className="grid two">
              {Object.entries(currency).map(([type, amount]) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{type}</span>
                  <strong>{amount}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="grid two">
        <article className="panel">
          <h2>Telemetry & Validator</h2>
          <p>Последна проверка: reports/run-20260109-full.json</p>
          <div className="grid two">
            <div>
              <div className="subtitle">Errors</div>
              <strong style={{ color: telemetry.errors === 0 ? '#7dd87d' : '#ff7878' }}>{telemetry.errors}</strong>
            </div>
            <div>
              <div className="subtitle">Warnings</div>
              <strong style={{ color: telemetry.warnings === 0 ? '#7dd87d' : '#ffb347' }}>{telemetry.warnings}</strong>
            </div>
            <div>
              <div className="subtitle">CAP errors</div>
              <strong>{telemetry.cap_errors ?? 0}</strong>
            </div>
            <div>
              <div className="subtitle">Top codes</div>
              <strong>{telemetry.top_codes && telemetry.top_codes.length ? telemetry.top_codes.join(', ') : '—'}</strong>
            </div>
          </div>
          <p className="subtitle" style={{ marginTop: 16 }}>
            Validator CLI: <code>npm run validate -- --path games/the-golden-chariot-of-belintash --summary</code>
          </p>
        </article>

        <article className="panel">
          <h2>Exploration timeline</h2>
          {exploration.length === 0 ? (
            <p className="subtitle">Няма записани събития. Добави entries в player-data/runtime/exploration-log.json.</p>
          ) : (
            <div className="timeline">
              {exploration.map((entry) => (
                <div key={entry.id} className="timeline-entry">
                  <strong>{entry.title}</strong>
                  <p className="subtitle">{entry.description}</p>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {entry.area_id ? `Area: ${entry.area_id}` : ''} {entry.quest_id ? `· Quest: ${entry.quest_id}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="grid two">
        <article className="panel">
          <h2>Mini map</h2>
          {areaMap?.imageDataUrl ? (
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--panel-border)', marginBottom: 12 }}>
              <Image
                src={areaMap.imageDataUrl}
                alt={`Mini map for ${areaMap.area_id ?? 'area'}`}
                width={areaMapWidth}
                height={areaMapHeight}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          ) : areaMap?.ascii_preview ? (
            <pre style={{ fontFamily: 'monospace', fontSize: 14 }}>{areaMap.ascii_preview.join('\n')}</pre>
          ) : (
            <p className="subtitle">
              Не е намерено изображение за текущата локация ({runtime.world_state?.location?.area_id || '—'}). Постави
              maps/areas/&lt;area&gt;.png.
            </p>
          )}
          {areaMap?.hotspots && areaMap.hotspots.length > 0 && (
            <div>
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
          <Link href="/map" className="map-link">
            Виж пълната карта →
          </Link>
        </article>

        <article className="panel">
          <h2>World map</h2>
          {map.imageDataUrl ? (
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
              <Image
                src={map.imageDataUrl}
                alt="World map"
                width={mapImageWidth}
                height={mapImageHeight}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                priority
              />
            </div>
          ) : map.ascii_preview ? (
            <pre style={{ fontFamily: 'monospace', fontSize: 14 }}>{map.ascii_preview.join('\n')}</pre>
          ) : (
            <p className="subtitle">Добави карта в maps/world/world.png, за да я визуализираме тук.</p>
          )}
          {map.regions && map.regions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="subtitle">Regions</div>
              <ul>
                {map.regions.map((region) => (
                  <li key={region.id}>{region.label ?? region.id}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
