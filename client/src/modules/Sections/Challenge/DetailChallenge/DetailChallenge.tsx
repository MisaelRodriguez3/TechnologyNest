import { UUID } from "crypto";
import { useEffect, useState, useCallback } from "react"; // Añadir useCallback
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthProvider";
import { Challenge } from "../../../../types/challenges.types";
import { getOneChallengeRequest, deleteChallengeRequest } from "../../../../services/challenges.service";
import Button from "../../../../components/ui/Button/Button";
import SuccessNotification from "../../../../components/ui/SuccessNotification/SuccessNotification";
import ErrorNotification from "../../../../components/ui/ErrorNotification/ErrorNotification";
import UpdateChallengeForm from "../UpdateChallengeForm/UpdateChallengeForm";
import LoadingScreen from "../../../../components/ui/LoadingScreen/LoadingScreen";
import formattedDate from "../../../../utils/formattedDate";
import styles from './DetailChallenge.module.css'
import { useSectionBack } from "../../../../hooks/useBackSections";

function DetailChallenge() {
    const {user} = useAuth();
    const {id} = useParams<{id: UUID}>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
    const [challenge, setChallenge] = useState<Challenge>();
    const [success, setSuccess] = useState<string | null>();
    const [error, setError] = useState<string | null>();

    const goBack = useSectionBack();

    // Usar useCallback para memoizar la función
    const fetchChallenge = useCallback(async (id: UUID) => {
        try {
            setLoading(true)
            const result = await getOneChallengeRequest(id)
            
            // Verificación más robusta
            if (!result.data || id !== result.data.id) {
                navigate('/404', { replace: true })
                return
            }
            
            setChallenge(result.data)
        } catch (error) {
            console.error(error)
            navigate('/404', { replace: true })
        } finally {
            setLoading(false)
        }
    }, [navigate]) // Añadir dependencias

    useEffect(() => {
        if(!id) {
            navigate('/404', { replace: true })
            return
        }
        fetchChallenge(id)
    }, [id, fetchChallenge, navigate]) // Añadir fetchChallenge como dependencia

    const deleteChallenge = async() => {
        try {
            if(!id) return
            setLoadingOptions(true)
            const result = await deleteChallengeRequest(id)
            setSuccess(result.data);
            goBack();
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : 'Error al eliminar el reto')
        } finally {
            setLoadingOptions(false)
        }
    }


    return (
        <div className={styles.container}>
            {loading && <LoadingScreen/>}
            {success && <SuccessNotification message={success}/>}
            {error && <ErrorNotification message={error}/>}
            
            
            <div className={styles.header}>
                {user?.id === challenge?.author.id && 
                    <div className={styles.actions}>
                        <UpdateChallengeForm 
                            onSuccess={() => id && fetchChallenge(id)} 
                            prevData={challenge as Challenge} // Asegurar que se pasa prevData
                            id={id as UUID}
                        />

                        <Button
                            action="delete"
                            fn={deleteChallenge}
                            content="Eliminar"
                            content_loading="Eliminando..."
                            loading={loadingOptions}
                        />
                    </div>
                }
                
                <div className={styles.meta}>
                    <h1 className={styles.title}>{challenge?.title}</h1>
                    <div className={styles.details}>
                        <span className={styles.author}>@{challenge?.author.username}</span>
                        <span className={styles.topic}>{challenge?.topic.name}</span>
                        <span className={`${styles.difficulty} ${styles[challenge?.difficulty ?? '']}`}>{challenge?.difficulty}</span>
                        <div className={styles.dates}>
                            <span className={styles.date}>Creado: {formattedDate(challenge?.created_at ?? '')}</span>
                            <span className={styles.date}>Actualizado: {formattedDate(challenge?.updated_at ?? '')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <p className={styles.description}>{challenge?.description}</p>
            </div>
        </div>
    )
}

export default DetailChallenge