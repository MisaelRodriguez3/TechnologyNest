//import { Link } from "react-router-dom";
import styles from "./Card.module.css"

interface CardProps {
  id: string;
  title: string;
  topic: string;
  author: string;
  difficulty?: string;
  created_at: Date;
}

function Card({
  id,
  title,
  topic,
  author,
  difficulty,
  created_at,
}: Readonly<CardProps>) {
  return (
    <div className={styles.card} id={id}>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.author}>Autor: @{author}</p>
      <p className={styles.topic}>Tecnología: {topic}</p>
      {difficulty && <p className={styles.difficulty}>Dificultad: {difficulty}</p>}
      <p className={styles.date}>Fecha: {created_at.toLocaleString()}</p>
    </div>
  )
}

export default Card;