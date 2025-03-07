import { useState } from "react";
import styles from "./comment.module.css";

export const CommentSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className={styles.toggleButton}
      >
        {isVisible ? "Ocultar comentarios" : "Mostrar comentarios"}
      </button>
      <div className={`${styles.comments} ${isVisible ? styles.visible : ""}`}>
        {Array(10).fill("Comentario random").map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};