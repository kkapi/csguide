import { createHashRouter } from 'react-router-dom'

import App from '@/App'
import { About } from '@/pages/About'
import { Home } from '@/pages/Home'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
    ],
  },
])
