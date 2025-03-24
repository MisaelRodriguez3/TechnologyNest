import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { TextAreaProps } from "../../../types/form.types";
import styles from"./Textarea.module.css"

function TextArea<T extends Record<string, unknown>>({
    id, 
    label, 
    error,
    maxLength,
    register,
    watch
    }: Readonly<TextAreaProps<T>>) {
    
    const value = watch ? watch(id) : ""

    return (
        <div className={styles.formGroup}>
            <label htmlFor={id}>{label}</label>
            <textarea 
                id={id}
                placeholder={`Escribe tu ${label}...`}
                className={`${styles.formControl} ${error ? styles.error : ''}`}
                maxLength={maxLength}
                {...register(id)}
            />
            {(watch && maxLength) &&             
            <div className="character-counter">
                {String(value).length || 0}/{maxLength}
            </div>
            }
            <div className={`${styles.errorContainer} ${error ? styles.active : ""}`}>
                {error && <ErrorMessage message={error.message} />}
            </div>
        </div>
    )
}

export default TextArea