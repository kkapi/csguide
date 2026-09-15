import { Navigate, useLocation, useParams } from 'react-router-dom'

/** Раздел назывался «Раскид» и жил на /smokes — не ломаем разосланные ссылки. */
export function LegacyNadesRedirect() {
  const { map } = useParams()
  const { search } = useLocation()
  return <Navigate to={`/maps/${map}/nades${search}`} replace />
}
