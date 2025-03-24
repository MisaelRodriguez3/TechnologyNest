import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;