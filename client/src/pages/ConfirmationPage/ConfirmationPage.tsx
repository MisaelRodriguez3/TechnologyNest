import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import styles from './ConfirmationPage.module.css';

const ConfirmationPage = () => {
    const location = useLocation();
    const email = location.state?.email || 'Correo no proporcionado';

    useEffect(() => {
      document.body.style.background = `linear-gradient(135deg, ${getComputedStyle(document.documentElement).getPropertyValue('--deep-space')}, ${getComputedStyle(document.documentElement).getPropertyValue('--cyber-blue')})`;
      return () => { document.body.style.background = ''; };
    }, []); 
    const handleResendEmail = () => {
      console.log('Reenviando correo de confirmación...');
    };  

    return (
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
          >
            <span>Reenviar correo</span>
            <FiArrowRight className={styles.arrowIcon} />
          </button> 
          <p className={styles.spamWarning}>
            ¿No encuentras el correo? Revisa tu carpeta de spam.
          </p>
        </div>
      </div>
    );
};

export default ConfirmationPage;