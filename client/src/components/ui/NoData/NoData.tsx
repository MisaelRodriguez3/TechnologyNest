import { useNavigate } from 'react-router-dom';
import styles from './NoData.module.css';

function NoData() {
    const navigate = useNavigate();

    return (
      <div className={styles.container}>
        <div className={styles.noDataCard}>
          <h1 className={styles.title}>🚨 Datos no encontrados</h1>
          <p className={styles.message}>
            No hemos encontrado ningún contenido disponible en esta sección.
          </p>
          <button 
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={() => navigate('/')}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
};

export default NoData;