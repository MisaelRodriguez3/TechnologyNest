import ResetPasswordForm from "../../modules/resetPassword/ResetPasswordForm";
import styles from "./ResetPassowrdPage.module.css"

export default function ResetPasswordPage() {

    return (
        <div className={styles.container}>
            <ResetPasswordForm/>
        </div>
    )
}