import { useEffect, useState } from "react";
import Card from "../../modules/card/Card";
import { ImageCarousel } from "../../modules/carrusel/carrusel";
import searchEntries from "../../services/search.service";
import styles from "./HomePage.module.css";

interface ForumEntry {
  id: string;
  title: string;
  author: string;
  topic: string;
  created_at: Date;
}

const ForumEntries = () => {
  const fetchRecentEntries = async () => {
    try {
      const result = await searchEntries('')
      console.log(result)
    } catch (err) {
      console.log(err)
    } 
  }

  useEffect(()=> {
    fetchRecentEntries()
  }, [])
  const [entries] = useState<ForumEntry[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      title: `Entrada ${i + 1}`,
      author: `Usuario${i + 1}`,
      topic: 'python',
      created_at: new Date(Date.now() - i * 86400000),
    }))
  );

  return (
    <div className={styles.container}>
      <ImageCarousel/>
      <h2 className={styles.title}>Entradas Recientes</h2>
      <ul className={styles.list}>
        {entries.map((entry) => (
          <Card
            key={entry.id}
            id={entry.id}
            title={entry.title}
            topic={entry.topic}
            created_at={entry.created_at}
            author={entry.author}
          />
        ))}
      </ul>
    </div>
  );
};

export default ForumEntries;
