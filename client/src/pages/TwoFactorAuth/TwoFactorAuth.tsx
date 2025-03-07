import { useState, useEffect } from 'react';
import { generateTotpQRResuqest, verifyTOTP } from '../../services/auth.service';
import styles from './TwoFactorAuth.module.css';
import { useNavigate } from 'react-router-dom';

const TwoFactorAuth = () => {
    const navigate = useNavigate()
    
  const [qrCode, setQrCode] = useState<string>('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await generateTotpQRResuqest(String(localStorage.getItem("username")))
        console.log(response)
        
        if (response.status !== 200) throw new Error('Error generating QR code');
        
        setQrCode(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrCode();
  }, []);

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setMessage({ type: 'error', text: 'El código debe tener 6 dígitos' });
      return;
    }

    try {
      const response = await verifyTOTP({username: String(localStorage.getItem("username")), totp_code: otpCode})
      
      if (response.status !== 200) throw new Error(String(response) || 'Verification failed');

      setMessage({ type: 'success', text: '¡Verificación exitosa! 2FA activado' });
      setIsVerified(true);
      navigate("/")
      localStorage.setItem("token", response.data.access_token)
      localStorage.removeItem("username")
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error de verificación' });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Autenticación en Dos Pasos</h2>
      
      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Generando código QR...</p>
        </div>
      ) : (
        <>
          {qrCode && !isVerified && (
            <div className={styles.qrSection}>
              <p className={styles.instructions}>
                1. Escanea este código QR con tu aplicación de autenticación
              </p>
              <img 
                src={`data:image/png;base64,${qrCode}`} 
                alt="QR Code 2FA" 
                className={styles.qrImage}
              />
              
              <p className={styles.instructions}>
                2. Ingresa el código de 6 dígitos
              </p>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                className={styles.otpInput}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
              />
              
              <button
                onClick={handleVerify}
                className={styles.verifyButton}
                disabled={otpCode.length !== 6}
              >
                Verificar Código
              </button>
            </div>
          )}
        </>
      )}

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {isVerified && (
        <div className={styles.successContainer}>
          <div className={styles.checkmark}>✓</div>
          <p className={styles.successText}>
            Autenticación en dos pasos activada correctamente
          </p>
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;