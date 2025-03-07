import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { FormFieldProps } from "../../../types/form.types";
import styles from "./input.module.css"

function FormField<T extends Record<string, unknown>>({
  label,
  id,
  type,
  register,
  error
}: Readonly<FormFieldProps<T>>) {
  return (
  <div className={styles.form_group}>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      {...register(id)}
      className={`${styles.form_control} ${error ? styles.error : ''}`}
    />
        
    <div className={`${styles.error_container} ${error ? styles.active : ""}`}>
      {error && <ErrorMessage message={error.message} />}
    </div>
        
  </div>
  )
}

export default FormField;