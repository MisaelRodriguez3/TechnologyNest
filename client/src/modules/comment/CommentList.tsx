import { UUID } from 'crypto';
import { Comment } from '../../types/comments.types';
import CommentItem from './CommentItem';
import styles from './comment.module.css';

interface CommentsListProps {
  comments: Comment[];
  currentUserId?: UUID;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: UUID) => void;
}

const CommentsList = ({ comments, currentUserId, onEdit, onDelete }: CommentsListProps) => {
  return (
    <div className={styles.commentsList}>
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentsList;