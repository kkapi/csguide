import { createHashRouter } from 'react-router-dom'
import App from '@/App'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'

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
