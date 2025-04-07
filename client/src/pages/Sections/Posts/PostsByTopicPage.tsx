import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTopic } from "../../../context/TopicProvider";
import { getPostsByTopicRequest } from "../../../services/posts.service";
import { Post } from "../../../types/posts.types";
import LoadingScreen from "../../../components/ui/LoadingScreen/LoadingScreen";
import CreatePostForm from "../../../modules/Sections/Posts/CreatePostForm/CreatePostForm";
import Card from "../../../modules/Card/Card";
import Pagination from "../../../components/ui/Pagination/Pagination";
import styles from './Posts.module.css'
import NoData from "../../../components/ui/NoData/NoData";

function PostsByTopicPage() {
    const {topic} = useParams<{topic: string}>();
    const {topics} = useTopic();
    const navigate = useNavigate();

    const [noData, setNoData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async(page?: number) => {
        try {
            setLoading(true)
            const currentTopic = topics?.find((t) => t.name === topic)
            if(!currentTopic) {
                navigate('/404')
                return
            }
            const result = await getPostsByTopicRequest(currentTopic.id, page)
            if(!result) {
                setNoData(true);
                return
            }
            setPage(result.data.page)
            setTotalPages(result.data.total_pages)
            setPosts(result.data.posts)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts(page);
    }, [page])

    const goToPage = (newPage: number) => {
        setPage(newPage)
    }

    if(noData) {
        return (
        <div className={styles.container}>
          <CreatePostForm onSuccess={fetchPosts}/>
          <NoData/>
        </div>
        )
    } 

    return (
        <div className={styles.container}>
            {loading && <LoadingScreen/>}
            <CreatePostForm onSuccess={fetchPosts}/>
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

export default PostsByTopicPage;