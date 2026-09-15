import { useParams } from 'react-router-dom'

import { ConsoleCommand } from '@/components/ConsoleCommand'
import { getMap, isMapSlug, MAP_LABELS } from '@/data/maps'
import { type Side, SIDE_LABELS, type Spawn } from '@/data/types'

function SpawnGroup({ team, spawns }: { team: Side; spawns: Spawn[] }) {
  if (spawns.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{SIDE_LABELS[team]}</h2>
      <div className="flex flex-col gap-2">
        {spawns
          .slice()
          .sort((a, b) => a.number - b.number)
          .map((spawn) => (
            <div key={spawn.id} className="flex items-center gap-3 rounded-lg border p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold tabular-nums">
                {spawn.number}
              </span>
              <div className="min-w-0 flex-1">
                {spawn.label && <div className="text-sm">{spawn.label}</div>}
                <ConsoleCommand text={spawn.setpos} className="mt-1 p-2 pr-12 text-xs" />
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}

export function MapSpawns() {
  const { map: slug } = useParams()
  const map = getMap(slug)
  const label = map?.label ?? (isMapSlug(slug) ? MAP_LABELS[slug] : slug)
  const spawns = map?.spawns ?? []

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight">Респавны {label}</h1>

      {spawns.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p>Координат спавнов по этой карте пока нет.</p>
          <p className="mt-1 text-sm">
            Как появятся — добавляются в <code className="font-mono">spawns</code> карты
            в <code className="font-mono">src/data/maps/</code>, страница подхватит сама.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Телепорт на спавн: скопируй команду и вставь в консоль.
          </p>
          <SpawnGroup team="t" spawns={spawns.filter((s) => s.team === 't')} />
          <SpawnGroup team="ct" spawns={spawns.filter((s) => s.team === 'ct')} />
        </>
      )}
    </div>
  )
}
