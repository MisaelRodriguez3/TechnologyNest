import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmailRequest } from '../../services/auth.service';
import styles from './ConfirmationAccountPage.module.css';

const ConfirmationAccountPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  const verifyEmail = async () => {
    try {
      if (!token) {
        console.log("No token")
        return
      }
      const response = await verifyEmailRequest(token)

      if (response.status !== 200) {
        throw new Error('Token inválido o expirado');
      }

      setSuccess(true);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Token no proporcionado');
      setLoading(false);
      return;
    }
    verifyEmail();
  }, [token]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Verificando tu correo electrónico...</p>
          </div>
        )}

        {!loading && success && (
          <div className={styles.successContainer}>
            <div className={styles.checkmark}>✓</div>
            <h2>¡Cuenta verificada!</h2>
            <p>Tu correo electrónico ha sido confirmado exitosamente.</p>
            <Link to="/login" className={styles.loginLink}>
              Ir al inicio de sesión
            </Link>
          </div>
        )}

        {!loading && error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>!</div>
            <h2>Error de verificación</h2>
            <p>{error}</p>
            <p>Por favor contacta al soporte técnico o intenta registrarte nuevamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationAccountPage;