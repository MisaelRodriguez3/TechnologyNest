import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook que retorna una función para retroceder una sección en la URL.
 * @example
 * Ejemplo: /python/foro/1 -> /python/foro
 */
export function useSectionBack() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBackOneSection = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    if (pathSegments.length > 1) {
      const newPath = '/' + pathSegments.slice(0, -1).join('/');
      navigate(newPath);
    } else {
      navigate('/');
    }
  };

  return goBackOneSection;
}
