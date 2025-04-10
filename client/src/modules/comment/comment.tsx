import { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { useAuth } from '../../context/AuthProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  createCommentSchema,
  updateCommentSchema,
  CreateCommentFormData,
  UpdateCommentFormData
} from '../../schemas/comment.schema';
import { 
  getCommentsByPostRequest,
  createCommentRequest,
  updateCommentRequest,
  deleteCommentRequest
} from '../../services/comment.service';
import { Comment } from '../../types/comments.types';
import CommentForm from './CommentForm';
import CommentsList from './CommentList';
import SuccessNotification from '../../components/ui/SuccessNotification/SuccessNotification';
import ErrorNotification from '../../components/ui/ErrorNotification/ErrorNotification';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import styles from './comment.module.css';

interface CommentsProps {
  postId: UUID;
}

const Comments = ({ postId }: CommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [noData, setNoData] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  const createForm = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { post_id: postId }
  });

  const updateForm = useForm<UpdateCommentFormData>({
    resolver: zodResolver(updateCommentSchema)
  });

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPostRequest(postId);
      if(!data.data) {
        setNoData(true)
        return
      }
      setComments(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCreate = async (formData: CreateCommentFormData) => {
    try {
      setLoading(true);
      const { data } = await createCommentRequest(formData);
      await fetchComments();
      setSuccess(data);
      createForm.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear comentario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData: UpdateCommentFormData) => {
    if (!editingComment) return;
    
    try {
      setLoading(true);
      const { data } = await updateCommentRequest(formData, editingComment.id);
      await fetchComments();
      setSuccess(data);
      setEditingComment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar comentario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: UUID) => {
    try {
      setLoading(true);
      const { data } = await deleteCommentRequest(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar comentario');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment);
    updateForm.setValue('comment', comment.comment);
  };

  if (loading) return <LoadingScreen />;

  if(noData) {
    return (
      <div className={styles.commentFormContainer}>
        <CommentForm
              form={createForm}
              onSubmit={handleCreate}
              isSubmitting={createForm.formState.isSubmitting}
              label="Nuevo comentario"
              buttonText="Publicar"
            />
      </div>
    )
  }
  return (
    <div className={styles.commentsSection}>
      <h2 className={styles.commentsTitle}>Comentarios ({comments.length})</h2>
      
      {success && <SuccessNotification message={success} />}
      {error && <ErrorNotification message={error} />}

      {user && (
        <div className={styles.commentFormContainer}>
          {!editingComment ? (
            <CommentForm
              form={createForm}
              onSubmit={handleCreate}
              isSubmitting={createForm.formState.isSubmitting}
              label="Nuevo comentario"
              buttonText="Publicar"
            />
          ) : (
            <CommentForm
              form={updateForm}
              onSubmit={handleUpdate}
              isSubmitting={updateForm.formState.isSubmitting}
              label="Editar comentario"
              buttonText="Actualizar"
              onCancel={() => setEditingComment(null)}
            />
          )}
        </div>
      )}

      <CommentsList
        comments={comments}
        currentUserId={user?.id}
        onEdit={startEditing}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Comments;