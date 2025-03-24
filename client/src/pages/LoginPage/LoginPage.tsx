import { Navigate } from "react-router-dom";
import LoginForm from "../../modules/login/LoginForm"
import { useAuth } from "../../context/AuthProvider";
import ErrorNotification from "../../components/ui/ErrorNotification/ErrorNotification";
import styles from "./LoginPage.module.css"

function LoginPage() {
    const {error, user} = useAuth()
    if (user) return <Navigate to={"/"}/>
    return (
        <>
            {error && <ErrorNotification message={error} duration={5000}/>}
            <div className={styles.container}>
                <LoginForm
                    recaptchaSiteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                />
            </div>
        </>
    )
}

export default LoginPage;