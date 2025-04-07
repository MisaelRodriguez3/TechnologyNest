import { useEffect, useState } from "react";
import Card from "../../modules/Card/Card";
import { ImageCarousel } from "../../modules/Carrusel/carrusel";
import searchEntries from "../../services/search.service";
import { Example } from "../../types/examples.types";
import { Post } from "../../types/posts.types";
import { Challenge } from "../../types/challenges.types";
import Pagination from "../../components/ui/Pagination/Pagination";
import LoadingScreen from "../../components/ui/LoadingScreen/LoadingScreen";
import NoData from "../../components/ui/NoData/NoData";
import styles from "./HomePage.module.css";

type Entry = (Post | Example | Challenge) & { section: string };

const HomePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [entries, setEntries] = useState<Entry[]>([]);

  const fetchRecentEntries = async (page?: number) => {
    try {
        setLoading(true);
        setNoData(false); // Resetear noData antes de la petición
        
        const result = await searchEntries("", page);
        if (!result?.data) {
            setNoData(true);
            return;
        }

        // Mapa de tipos para asignar la sección correspondiente
        const sectionMap = {
            posts: "foro",
            examples: "ejemplos-de-codigo",
            challenges: "retos",
        };

        const allEntries: Entry[] = Object.entries(result.data)
            .flatMap(([key, items]) => {
                if (!Array.isArray(items)) return []; // Evitar el error de .map si no es un array

                return items.map((entry) => ({
                    ...entry,
                    section: sectionMap[key as keyof typeof sectionMap], // Asigna la sección automáticamente
                }));
            })
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            );

        setEntries(allEntries);
        setPage(result.data.page ?? 1); // Evita posibles valores undefined
        setTotalPages(result.data.total_pages ?? 1);
    } catch (err) {
        console.error("Error al obtener entradas:", err);
        setNoData(true);
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    fetchRecentEntries(page);
  }, [page]);

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  if (noData) return <NoData />;

  return (
    <div className={styles.container}>
      {loading && <LoadingScreen />}
      <ImageCarousel />
      <h2 className={styles.title}>Entradas Recientes</h2>
      <ul className={styles.list}>
        {entries.map((entry) => (
          <Card
            key={entry.id}
            id={entry.id}
            title={entry.title}
            topic={entry.topic.name}
            created_at={entry.created_at}
            author={entry.author.username}
            section={entry.section} 
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
  );
};

export default HomePage;