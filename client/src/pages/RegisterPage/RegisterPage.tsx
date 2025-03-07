import { useState } from "react";
import RegisterForm from "../../modules/register/RegisterForm"
import styles from "./RegisterPage.module.css"

function RegisterPage() {

    const [loading, setLoading] = useState(false);
    
  
    return (
      <div className={styles.container}>
        <RegisterForm
          recaptchaSiteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    );
}

export default RegisterPage;