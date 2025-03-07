import { useState } from "react";
import LoginForm from "../../modules/login/LoginForm"
import styles from "./LoginPage.module.css"

function LoginPage() {
    const [loading, setLoading] = useState(false)

    return (
        <div className={styles.container}>
            <LoginForm
                recaptchaSiteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                loading={loading}
                setLoading={setLoading}
            />
        </div>
    )
}

export default LoginPage;