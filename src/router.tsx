import { createHashRouter } from 'react-router-dom'

import App from '@/App'
import { About } from '@/pages/About'
import { Home } from '@/pages/Home'
import { LegacyNadesRedirect } from '@/pages/LegacyNadesRedirect'
import { MapNades } from '@/pages/MapNades'
import { MapSpawns } from '@/pages/MapSpawns'
import { Placeholder } from '@/pages/Placeholder'
import { TrainingConfigs } from '@/pages/TrainingConfig'
import { TrainingNades } from '@/pages/TrainingNades'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },

      // Базовые механики
      { path: 'mechanics/movement', element: <Placeholder /> },
      { path: 'mechanics/aim', element: <Placeholder /> },
      { path: 'mechanics/weapons', element: <Placeholder /> },
      { path: 'mechanics/economy', element: <Placeholder /> },

      // Карты — одна страница на все, конкретная берётся из :map
      { path: 'maps/:map/nades', element: <MapNades /> },
      { path: 'maps/:map/spawns', element: <MapSpawns /> },
      { path: 'maps/:map/default', element: <Placeholder /> },
      { path: 'maps/:map/positions', element: <Placeholder /> },
      { path: 'maps/:map/rounds', element: <Placeholder /> },
      { path: 'maps/:map/tips', element: <Placeholder /> },
      { path: 'maps/:map/smokes', element: <LegacyNadesRedirect /> },

      // Тренировка
      { path: 'training/nades', element: <TrainingNades /> },
      { path: 'training/setup', element: <TrainingConfigs /> },
      { path: 'training/aim', element: <Placeholder /> },
      { path: 'training/workshop', element: <Placeholder /> },
    ],
  },
])
