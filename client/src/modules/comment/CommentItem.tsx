import { UUID } from 'crypto';
import { Comment } from '../../types/comments.types';
import formattedDate from '../../utils/formattedDate';
import styles from './comment.module.css';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: UUID;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: UUID) => void;
}

const CommentItem = ({ comment, currentUserId, onEdit, onDelete }: CommentItemProps) => {
  const isAuthor = currentUserId === comment.author.id;

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <span className={styles.commentAuthor}>@{comment.author.username}</span>
        <span className={styles.commentDate}>{formattedDate(comment.updated_at)}</span>
      </div>
      <p className={styles.commentContent}>{comment.comment}</p>
      
      {isAuthor && (
        <div className={styles.commentActions}>
          <button 
            className={styles.editButton}
            onClick={() => onEdit(comment)}
          >
            Editar
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(comment.id)}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;