import { useLocation } from 'react-router-dom';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import { resendConfirmationRequest } from '../../services/auth.service';
import SuccessNotification from '../../components/ui/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../components/ui/ErrorNotification/ErrorNotification';
import { useState } from 'react';
import styles from './ConfirmationPage.module.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const email = location.state?.email || 'Correo no proporcionado';
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false) 
  const [notificationKey, setNotificationKey] = useState<number>(0); 

  const handleResendEmail = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const response = await resendConfirmationRequest(email)
      console.log(response)
      setSuccess(response.data)
      setNotificationKey(prev => prev + 1);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en el envío')
      setNotificationKey(prev => prev + 1);
    } finally {
      setLoading(false)
    }
  };  

  return (
    <>
      { error && <ErrorNotification message={error} key={`error-${notificationKey}`}/> }
      { success && <SuccessNotification message={success} key={`success-${notificationKey}`}/>}
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <FiMail className={styles.mailIcon} />
            <div className={styles.pulseEffect}></div>
          </div>
          <h1 className={styles.title}>¡Revisa tu correo!</h1>
          <p className={styles.instructions}>
            Hemos enviado un enlace de confirmación a {" "}
            <span className={styles.email}>{email}</span>. 
            Por favor verifica tu bandeja de entrada.
          </p>  
          <button 
            className={styles.resendButton}
            onClick={handleResendEmail}
            {...(loading ? {disabled: true}: {})}
          >
            <span>Reenviar correo</span>
            <FiArrowRight className={styles.arrowIcon} />
          </button> 
          <p className={styles.spamWarning}>
            ¿No encuentras el correo? Revisa tu carpeta de spam.
          </p>
        </div>
      </div>
      </>
  );
};

export default ConfirmationPage;