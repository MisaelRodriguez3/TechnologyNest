import { Navigate } from "react-router-dom";
import RegisterForm from "../../modules/register/RegisterForm"
import { useAuth } from "../../context/AuthProvider";
import ErrorNotification from "../../components/ui/ErrorNotification/ErrorNotification";
import styles from "./RegisterPage.module.css"

function RegisterPage() {
  const {error, user} = useAuth();

  if (user) return <Navigate to={"/"}/>
  
  return (
    <>
      {error && <ErrorNotification message={error} duration={5000}/>}
    
      <div className={styles.container}>
        <RegisterForm
          recaptchaSiteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        />
      </div>
    </>
  );
}

export default RegisterPage;