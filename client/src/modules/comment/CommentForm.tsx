import { useForm } from 'react-hook-form';
import styles from './comment.module.css';

interface CommentFormProps {
  form: ReturnType<typeof useForm>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  label: string;
  buttonText: string;
  onCancel?: () => void;
}

const CommentForm = ({ 
  form, 
  onSubmit, 
  isSubmitting,
  label,
  buttonText,
  onCancel 
}: CommentFormProps) => {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.commentForm}>
      <label className={styles.formLabel}>{label}</label>
      <textarea
        {...register('comment')}
        className={styles.textarea}
        placeholder="Escribe tu comentario..."
        disabled={isSubmitting}
      />
      {errors.comment && (
        <span className={styles.errorMessage}>{errors.comment}</span>
      )}
      
      <div className={styles.formActions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;