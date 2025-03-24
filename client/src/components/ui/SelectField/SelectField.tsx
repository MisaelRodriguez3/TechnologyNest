import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { SelectProps } from "../../../types/form.types";
import styles from "./SelectField.module.css"; // Crea un archivo CSS module para el select

function SelectField<T extends Record<string, unknown>>({
  label,
  id,
  register,
  error,
  options
}: Readonly<SelectProps<T>>) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        {...register(id)}
        className={`${styles.formControl} ${error ? styles.error : ''}`}
        defaultValue=""
      >
        <option value="" disabled>Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div className={`${styles.errorContainer} ${error ? styles.active : ""}`}>
        {error && <ErrorMessage message={error.message} />}
      </div>
    </div>
  );
}

export default SelectField;