import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.errorCode}>404</div>
          <h2 className={styles.title}>Página no encontrada</h2>
          <p className={styles.message}>
            La página que estás buscando no existe o ha sido movida.
          </p>
          <button
            onClick={() => navigate('/')}
            className={`${styles.btn} ${styles.primary}`}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;