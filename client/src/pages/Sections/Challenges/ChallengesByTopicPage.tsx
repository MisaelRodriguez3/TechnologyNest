import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTopic } from "../../../context/TopicProvider";
import { getChallengesByTopicRequest } from "../../../services/challenges.service";
import { Challenge } from "../../../types/challenges.types";
import LoadingScreen from "../../../components/ui/LoadingScreen/LoadingScreen";
import CreateChallengeForm from "../../../modules/Sections/Challenge/CreateChallengeForm/CreateChallengeForm";
import Card from "../../../modules/Card/Card";
import Pagination from "../../../components/ui/Pagination/Pagination";
import styles from './Challenges.module.css'
import NoData from "../../../components/ui/NoData/NoData";

function ChallengesByTopicPage() {
    const {topic} = useParams<{topic: string}>();
    const {topics} = useTopic();
    const navigate = useNavigate();

    const [noData, setNoData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    const fetchChallenges = async(page?: number) => {
        try {
            setLoading(true)
            const currentTopic = topics?.find((t) => t.name === topic)
            if(!currentTopic) {
                navigate('/404')
                return
            }
            const result = await getChallengesByTopicRequest(currentTopic.id, page)
            if(!result) {
                setNoData(true);
                return
            }
            setPage(result.data.page)
            setTotalPages(result.data.total_pages)
            setChallenges(result.data.challenges)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchChallenges(page);
    }, [page])

    const goToPage = (newPage: number) => {
        setPage(newPage)
    }

    if(noData) {
        return (
        <div className={styles.container}>
          <CreateChallengeForm onSuccess={fetchChallenges}/>
          <NoData/>
        </div>
        )
      } 
    

    return (
        <div className={styles.container}>
            {loading && <LoadingScreen/>}
            <CreateChallengeForm onSuccess={fetchChallenges}/>
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
            {totalPages > 1 && (
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={goToPage}
                />
              )}
        </div>
    )
}

export default ChallengesByTopicPage;