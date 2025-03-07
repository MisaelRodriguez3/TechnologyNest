import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { TextAreaProps } from "../../../types/form.types";

import "./textarea.css"

function TextArea<T extends Record<string, any>>({
    id, 
    label, 
    error,
    maxLength,
    register,
    watch
    }: TextAreaProps<T>) {
    
    const value = watch ? watch(id) : ""

    return (
        <div className="form-group">
            <label htmlFor={String(id)}>{label}</label>
            <textarea 
                id={String(id)}
                placeholder={`Escribe tu ${label}...`}
                className={`form-control ${error ? 'error' : ''}`}
                maxLength={maxLength}
                {...register(id as any)}
            />
            {(watch && maxLength) &&             
            <div className="character-counter">
                {value?.length || 0}/{maxLength}
            </div>
            }
            <div className={`error-container ${error ? "active" : ""}`}>
                {error && <ErrorMessage message={error.message} />}
            </div>
        </div>
    )
}

export default TextArea