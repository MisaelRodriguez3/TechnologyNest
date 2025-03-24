import ForgotPasswordForm from '../../modules/forgotPassword/forgotPaswordForm';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {

  return (
    <div className={styles.container}>
      <ForgotPasswordForm/>
    </div>
  )
};

export default ForgotPasswordPage;