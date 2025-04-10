import { UUID } from "crypto";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthProvider";
import { useSectionBack } from "../../../../hooks/useBackSections";
import { Post } from "../../../../types/posts.types";
import Comments from "../../../comment/comment";
import CodeBlock from "../../../../components/ui/CodeBlock/CodeBlock";
import { getOnePostRequest, deletePostRequest } from "../../../../services/posts.service";
import Button from "../../../../components/ui/Button/Button";
import SuccessNotification from "../../../../components/ui/SuccessNotification/SuccessNotification";
import ErrorNotification from "../../../../components/ui/ErrorNotification/ErrorNotification";
import UpdatePostForm from "../UpdatePostForm/UpdatePostForm copy";
import LoadingScreen from "../../../../components/ui/LoadingScreen/LoadingScreen";
import formattedDate from "../../../../utils/formattedDate";
import styles from './DetailPost.module.css';

function DetailPost() {
    const {user} = useAuth();
    const {id} = useParams<{id: UUID}>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [post, setPost] = useState<Post>();
    const [success, setSuccess] = useState<string | null>();
    const [error, setError] = useState<string | null>();

    const goBack = useSectionBack();

    const fetchPost = useCallback(async (id: UUID) => {
        try {
            setLoading(true);
            const result = await getOnePostRequest(id);
            
            if (!result.data || id !== result.data.id) {
                navigate('/404', { replace: true });
                return;
            }
            
            setPost(result.data);
        } catch (error) {
            console.error(error);
            navigate('/404', { replace: true });
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if(!id) {
            navigate('/404', { replace: true });
            return;
        }
        fetchPost(id);
    }, [id, fetchPost, navigate]);


    const deletePost = async() => {
        try {
            if(!id) return;
            setLoading(true);
            const result = await deletePostRequest(id);
            setSuccess(result.data);
            goBack();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Error al eliminar el post');
        } finally {
            setLoading(false);
        }
    }

    
    return (
        <div className={styles.container}>
            {loading && <LoadingScreen/>}

            {success && <SuccessNotification message={success}/>}
            {error && <ErrorNotification message={error}/>}
            
            <div className={styles.header}>
                {user ? user.id === post?.author.id && 

                    <div className={styles.actions}>
                        <UpdatePostForm 
                            onSuccess={() => id && fetchPost(id)} 
                            prevData={post}
                            id={id as UUID}
                        />
                        <Button
                            action="delete"
                            fn={deletePost}
                            content="Eliminar"
                            content_loading="Eliminando..."
                            loading={loading}
                        />
                    </div> : null
                }
                
                <div className={styles.meta}>
                    <h1 className={styles.title}>{post?.title}</h1>
                    <div className={styles.details}>
                        <span className={styles.author}>@{post?.author.username}</span>
                        <span className={styles.topic}>{post?.topic.name}</span>
                        <span className={styles.date}>
                            Creado: {formattedDate(post?.created_at ?? '')}
                        </span>
                        <span className={styles.date}>
                            Actualizado: {formattedDate(post?.updated_at ?? '')}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <p className={styles.description}>{post?.description}</p>
                
                {post?.code && (
                    <div className={styles.codeSection}>
                        <h3 className={styles.codeTitle}>Código:</h3>
                        <CodeBlock 
                            code={post.code} 
                            language={post.topic.name}
                        />
                    </div>
                )}
            </div>
            <div>
                <Comments postId={id as UUID}/>
            </div>
        </div>
    )
}

export default DetailPost;