import { Link, useNavigate } from "react-router-dom";
import formattedDate from "../../utils/formattedDate";
import styles from "./Card.module.css"

interface CardProps {
  id: string;
  title: string;
  topic: string;
  author: string;
  difficulty?: string;
  created_at: string;
  section: string;
}

function Card({
  id,
  title,
  topic,
  author,
  difficulty,
  created_at,
  section
}: Readonly<CardProps>) {
  const navigate = useNavigate();
  const date = formattedDate(created_at);

  // Generación segura de la ruta
  const getNavigationPath = () => {
    const basePath = `/${encodeURIComponent(topic)}/${encodeURIComponent(section)}`;
    return `${basePath}/${encodeURIComponent(id)}`;
  };

  // Manejo de errores en la construcción de la ruta
  const handleNavigation = (e: React.MouseEvent) => {
    if (!topic || !section || !id) {
      e.preventDefault();
      navigate('/404');
      return;
    }
    
    try {
      const path = getNavigationPath();
      if (!path.match(/^\/[^/]+\/[^/]+\/[^/]+$/)) {
        throw new Error('Invalid route structure');
      }
    } catch (error) {
      e.preventDefault();
      console.error('Navigation error:', error);
      navigate('/500');
    }
  };

  return (
    <Link 
      to={getNavigationPath()}
      onClick={handleNavigation}
      state={{ from: location.pathname }} // Preservar historial
    >    
      <div className={styles.card} id={id}>
        <p className={styles.date}>Fecha: {date}</p>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.author}>Autor: @{author}</p>
        <p className={styles.topic}>Tecnología: {topic}</p>
        {difficulty && <p className={styles.difficulty}>Dificultad: {difficulty}</p>}
      </div>
    </Link>
  )
}

export default Card;