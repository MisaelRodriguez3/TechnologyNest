import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTopic } from "../../context/TopicProvider";
import Card from "../../modules/Card/Card";
import { getContentByTopicRequest } from "../../services/topics.service";
import { Post } from "../../types/posts.types";
import { Example } from "../../types/examples.types";
import { Challenge } from "../../types/challenges.types";
import LoadingScreen from "../../components/ui/LoadingScreen/LoadingScreen";
import Pagination from "../../components/ui/Pagination/Pagination";
import styles from './TopicPage.module.css';
import NoData from "../../components/ui/NoData/NoData";

function TopicPage() {
    const { topics, loading: topicsLoading } = useTopic();
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();

    const [noData, setNoData] = useState<boolean>(false);
    const [contentLoading, setContentLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [posts, setPosts] = useState<Post[]>([]);
    const [examples, setExamples] = useState<Example[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    const fetchContentByTopic = async (page: number) => {
        try {
            setContentLoading(true);
            const currentTopic = topics?.find((obj) => obj.name === topic);
            
            if (!currentTopic) {
                navigate('/404', { replace: true });
                return;
            }

            const result = await getContentByTopicRequest(currentTopic.id, page);
            if(
                result.data.challenges.length === 0 && 
                result.data.posts.length === 0 && 
                result.data.examples.length === 0
            ) {
                console.log('no data')
                setNoData(true);
                return
            }
            setTotalPages(result.data.total_pages);
            setPosts(result.data.posts || []);
            setExamples(result.data.examples || []);
            setChallenges(result.data.challenges || []);
        } catch (error) {
            console.error(error);
        } finally {
            setContentLoading(false);
        }
    };

    useEffect(() => {
        if (topicsLoading || !topic) return;
        
        // Verificar si el tema existe
        const topicExists = topics?.some((t) => t.name === topic);
        if (!topicExists) {
            navigate('/404', { replace: true });
            return;
        }

        fetchContentByTopic(page);
    }, [page, topic, topics, topicsLoading]);

    const goToPage = (newPage: number) => {
        setPage(newPage);
    };
    
    if(noData) return <NoData/>

    return (
        <div className={styles.container}>
            {topicsLoading || contentLoading && <LoadingScreen />} 
            {posts.length > 0 && (
                <>
                    <h2 className={styles.title}>Posts</h2>
                    <ul className={styles.list}>
                        {posts.map((post) => (
                            <Card
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                topic={post.topic.name}
                                created_at={post.created_at}
                                author={post.author.username}
                                section="foro"
                            />
                        ))}
                    </ul>
                </>
            )}

            {challenges.length > 0 && (
                <>
                    <h2 className={styles.title}>Challenges</h2>
                    <ul className={styles.list}>
                        {challenges.map((challenge) => (
                            <Card
                                key={challenge.id}
                                id={challenge.id}
                                title={challenge.title}
                                topic={challenge.topic.name}
                                created_at={challenge.created_at}
                                author={challenge.author.username}
                                section="retos"
                            />
                        ))}
                    </ul>
                </>
            )}

            {examples.length > 0 && (
                <>
                    <h2 className={styles.title}>Examples</h2>
                    <ul className={styles.list}>
                        {examples.map((example) => (
                            <Card
                                key={example.id}
                                id={example.id}
                                title={example.title}
                                topic={example.topic.name}
                                created_at={example.created_at}
                                author={example.author.username}
                                section="ejemplos-de-codigo"
                            />
                        ))}
                    </ul>
                </>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                />
            )}
        </div>
    );
}

export default TopicPage;