import { UUID } from "crypto";
import { useEffect, useState, useCallback } from "react"; // Añadir useCallback
import { useNavigate, useParams } from "react-router-dom";
import { getOneExampleRequest, deleteExampleRequest } from "../../../../services/examples.service";
import CodeBlock from "../../../../components/ui/CodeBlock/CodeBlock";
import { Example } from "../../../../types/examples.types";
import Button from "../../../../components/ui/Button/Button";
import SuccessNotification from "../../../../components/ui/SuccessNotification/SuccessNotification";
import ErrorNotification from "../../../../components/ui/ErrorNotification/ErrorNotification";
import UpdateExampleForm from "../UpdateExampleForm/UpdateExampleForm";
import LoadingScreen from "../../../../components/ui/LoadingScreen/LoadingScreen";
import formattedDate from "../../../../utils/formattedDate";
import styles from './DetailExample.module.css'
import { useSectionBack } from "../../../../hooks/useBackSections";

function DetailExample() {
    const {id} = useParams<{id: UUID}>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [example, setExample] = useState<Example>();
    const [success, setSuccess] = useState<string | null>();
    const [error, setError] = useState<string | null>();

    const goBack = useSectionBack();

    // Usar useCallback para memoizar la función
    const fetchExample = useCallback(async (id: UUID) => {
        try {
            setLoading(true)
            const result = await getOneExampleRequest(id)
            
            // Verificación más robusta
            if (!result.data || id !== result.data.id) {
                navigate('/404', { replace: true })
                return
            }
            
            setExample(result.data)
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
        fetchExample(id)
    }, [id, fetchExample, navigate]) // Añadir fetchExample como dependencia

    const deleteExample = async() => {
        try {
            if(!id) return
            setLoading(true)
            const result = await deleteExampleRequest(id)
            setSuccess(result.data);
            goBack();
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : 'Error al eliminar el reto')
        } finally {
            setLoading(false)
        }
    }

    
    return (
        <div className={styles.container}>
            {loading && <LoadingScreen/>}

            {success && <SuccessNotification message={success}/>}
            {error && <ErrorNotification message={error}/>}

            <div className={styles.header}>
                <div className={styles.actions}>
                    <UpdateExampleForm 
                        onSuccess={() => id && fetchExample(id)} 
                        prevData={example as Example} // Asegurar que se pasa prevData
                        id={id as UUID}
                    />
                    <Button
                        action="delete"
                        fn={deleteExample}
                        content="Eliminar"
                        content_loading="Eliminando..."
                        loading={loading}
                    />
                </div>
                
                <div className={styles.meta}>
                    <h1 className={styles.title}>{example?.title}</h1>
                    <div className={styles.details}>
                        <span className={styles.author}>@{example?.author.username}</span>
                        <span className={styles.topic}>{example?.topic.name}</span>
                        <span className={styles.date}>
                            Creado: {formattedDate(example?.created_at ?? '')}
                        </span>
                        {example?.updated_at && (
                            <span className={styles.date}>
                                Actualizado: {formattedDate(example.updated_at)}
                            </span>
                        )}
                    </div>
                </div>
            </div>


            <div className={styles.content}>
                <p className={styles.description}>{example?.description}</p>
                {example?.code && (
                    <div className={styles.codeSection}>
                        <h3 className={styles.codeTitle}>Código:</h3>
                        <CodeBlock 
                            code={example.code} 
                            language={example.topic.name}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default DetailExample