import { createHashRouter } from 'react-router-dom'

import App from '@/App'
import { About } from '@/pages/About'
import { Home } from '@/pages/Home'
import { Placeholder } from '@/pages/Placeholder'

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

      // Карты — Dust2
      { path: 'maps/dust2/default', element: <Placeholder /> },
      { path: 'maps/dust2/smokes', element: <Placeholder /> },
      { path: 'maps/dust2/rounds', element: <Placeholder /> },
      { path: 'maps/dust2/positions', element: <Placeholder /> },
      { path: 'maps/dust2/tips', element: <Placeholder /> },

      // Карты — Mirage
      { path: 'maps/mirage/default', element: <Placeholder /> },
      { path: 'maps/mirage/smokes', element: <Placeholder /> },
      { path: 'maps/mirage/rounds', element: <Placeholder /> },
      { path: 'maps/mirage/positions', element: <Placeholder /> },
      { path: 'maps/mirage/tips', element: <Placeholder /> },

      // Карты — Inferno
      { path: 'maps/inferno/default', element: <Placeholder /> },
      { path: 'maps/inferno/smokes', element: <Placeholder /> },
      { path: 'maps/inferno/rounds', element: <Placeholder /> },
      { path: 'maps/inferno/positions', element: <Placeholder /> },
      { path: 'maps/inferno/tips', element: <Placeholder /> },

      // Карты — Nuke
      { path: 'maps/nuke/default', element: <Placeholder /> },
      { path: 'maps/nuke/smokes', element: <Placeholder /> },
      { path: 'maps/nuke/rounds', element: <Placeholder /> },
      { path: 'maps/nuke/positions', element: <Placeholder /> },
      { path: 'maps/nuke/tips', element: <Placeholder /> },

      // Тренировка
      { path: 'training/setup', element: <Placeholder /> },
      { path: 'training/aim', element: <Placeholder /> },
      { path: 'training/workshop', element: <Placeholder /> },
    ],
  },
])
