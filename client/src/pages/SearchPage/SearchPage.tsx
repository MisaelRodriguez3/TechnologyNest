import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../../modules/Card/Card";
import searchResult from "../../services/search.service";
import { Search } from "../../types/search.types";
import Pagination from "../../components/ui/Pagination/Pagination";
import NoData from "../../components/ui/NoData/NoData";
import styles from "./SearchPage.module.css";
import LoadingScreen from "../../components/ui/LoadingScreen/LoadingScreen";


const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false)
  const [noData, setNoData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [result, setResult] = useState<Search>();

  const navigate = useNavigate();
  const q = searchParams.get('q') ?? '';

  const fetchResults = async (page: number = 1) => {
    try {
      setLoading(true)
      if(!q){
        navigate('/')
        return
      }
      const response = await searchResult(q, page)
      if(
        response.data.challenges.length === 0 && 
        response.data.posts.length === 0 && 
        response.data.examples.length === 0
      ) {
        setNoData(true)
        return
      }
      setResult(response.data)
      setPage(response.data.page)
      setTotalPages(response.data.total_pages)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> {
    fetchResults(page)
  }, [page])


  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  if(noData) return <NoData/>

  return (
    <div className={styles.container}>
      {loading && <LoadingScreen/>}
      <ul className={styles.list}>
        {result?.posts.length !== 0 ? 
        <>
          <h2 className={styles.title}>Posts:</h2>
          {result?.posts.map((entry) => (
            <Card
              key={entry.id}
              id={entry.id}
              title={entry.title}
              topic={entry.topic.name}
              created_at={entry.created_at}
              author={entry.author.username}
              section="foro"
            />
          ))}
        </> : null}
        {result?.examples.length !== 0 ?
        <>
          <h2 className={styles.title}>Examples:</h2>
          {result?.examples.map((entry) => (
            <Card
              key={entry.id}
              id={entry.id}
              title={entry.title}
              topic={entry.topic.name}
              created_at={entry.created_at}
              author={entry.author.username}
              section="ejemplos-de-codigo"
            />
          ))}
        </> : null}
        {result?.challenges.length !== 0 ?
        <>
          <h2 className={styles.title}>Challenges:</h2>
          {result?.challenges.map((entry) => (
            <Card
              key={entry.id}
              id={entry.id}
              title={entry.title}
              topic={entry.topic.name}
              created_at={entry.created_at}
              author={entry.author.username}
              section="retos"
            />
          ))}
        </>  : null}
      </ul>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={page}
          totalPages={totalPages} 
          onPageChange={goToPage}
        />
      )}
      
    </div>
  );
};

export default SearchPage;
