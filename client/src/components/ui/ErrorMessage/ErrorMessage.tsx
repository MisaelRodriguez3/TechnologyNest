import styles from "./errorMessage.module.css"
/**
 * Componente de mensajes de error
 * @param {string} message Mensaje de error
 * @returns {JSX.Element} Etiqueta sapna con el mensaje de error
 */
function ErrorMessage({ message }: Readonly<{ message?: string }>) {
    return (
    <span className={styles.error_message}>{message}</span>
  )
};

export default ErrorMessage

//Creado por Misael Rodríguez