import { useEffect, useState } from "react";
import { getExamplesRequest } from "../../../services/examples.service";
import { Example } from "../../../types/examples.types";
import LoadingScreen from "../../../components/ui/LoadingScreen/LoadingScreen";
import CreateExampleForm from "../../../modules/Sections/Examples/CreateExampleForm/CreateExampleForm";
import Card from "../../../modules/Card/Card";
import Pagination from "../../../components/ui/Pagination/Pagination";
import styles from './Examples.module.css'
import NoData from "../../../components/ui/NoData/NoData";

function ExamplesPage() {
    const [noData, setNoData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [examples, setExamples] = useState<Example[]>([]);

    const fetchExamples = async(page?: number) => {
        try {
            setLoading(true)
            const result = await getExamplesRequest(page)
            if(!result) {
                setNoData(true);
                return
            }
            setPage(result.data.page)
            setTotalPages(result.data.total_pages)
            setExamples(result.data.examples)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExamples(page);
    }, [page])

    const goToPage = (newPage: number) => {
        setPage(newPage)
    }

    if(noData) {
        return (
        <div className={styles.container}>
          <CreateExampleForm onSuccess={fetchExamples}/>
          <NoData/>
        </div>
        )
    } 

    return (
        <div className={styles.container}>
            {loading && <LoadingScreen/>}
            <CreateExampleForm onSuccess={fetchExamples}/>
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

export default ExamplesPage;