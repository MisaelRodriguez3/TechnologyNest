import {createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback} from 'react'
import { getTopicsRequest } from '../services/topics.service'
import { Topic } from '../types/topic.types'

interface TopicContextType {
    topics: Topic[] | null;
    fetchTopics: () => Promise<void>;
    success: string | null;
    error: string | null;
    loading: boolean;
}

const TopicsContext = createContext<TopicContextType | undefined>(undefined)

export function TopicsProvider({children}: Readonly<{children: ReactNode}>) {
    const [topics, setTopics] = useState<Topic[] | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchTopics = useCallback(async() => {
        try {
            clearNotifications()
            const {data} = await getTopicsRequest()
            setTopics(data)
            setSuccess('Temas obtnidos correctamente')
            
        } catch (err) {
            setError(err  instanceof Error ? err.message : 'Error al obtner los temas')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTopics()
    }, [fetchTopics])

    function clearNotifications(){
        setError(null)
        setSuccess(null)
    }

    const value = useMemo(() => ({
        topics,
        fetchTopics,
        success,
        error,
        loading
    }), [topics, success, error, loading, fetchTopics])

    return (
        <TopicsContext.Provider value={value}>
            {children}
        </TopicsContext.Provider>
    )
}

export function useTopic() {
    const context = useContext(TopicsContext)
    if(!context) throw new Error('useTopic debe usarse dentro de un TopicsProvider')
    return context;
} 