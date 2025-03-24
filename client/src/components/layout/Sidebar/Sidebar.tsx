import { Link, useParams, useLocation } from 'react-router-dom';
import { useTopic } from '../../../context/TopicProvider';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { topics } = useTopic();
  const location = useLocation();
  const { topic: currentTopic } = useParams<{
    topic?: string;
    section?: string;
  }>();

  const sectionList = [
    { path: '/foro', label: 'Foro' },
    { path: '/retos', label: 'Retos' },
    { path: '/ejemplos-de-codigo', label: 'Ejemplos de código' },
  ]

  return (
    <aside className={styles.sidebar}>
      {/* Sección de Temas */}
      <div className={styles.topicsContainer}>
        {topics?.map((topic) => {
          const isActive = location.pathname.startsWith(`/${topic.name}`);
          
          return (
            <div
              key={topic.name}
              className={`${styles.topic} ${isActive ? styles.active : ''}`}
            >
              <Link
                to={`/${topic.name}`}
                className={styles.topicLink}
              >
                <img
                  src={topic.image_url}
                  alt={topic.name}
                  className={styles.topicImage}
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Sección de Navegación */}
      <div className={styles.sectionsContainer}>
        <ul className={styles.sectionList}>
          {sectionList.map(({ path, label }) => {
            const fullPath = currentTopic ? `/${currentTopic}${path}` : path;
            const isActive = location.pathname === fullPath;

            return (
              <li key={path} className={styles.sectionItem}>
                <Link to={fullPath} className={isActive ? styles.activeSection : ''}>
                  {label}
                </Link>
              </li>
            );
          })}
          <li className={styles.sectionItem}>
                <Link to='stack-overflow' className={location.pathname === '/stack-overflow' ? styles.activeSection : ''}>
                  Stack Overflow
                </Link>
            </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
