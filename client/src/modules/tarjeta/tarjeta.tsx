import { useState } from "react";
import styles from "./tarjeta.module.css";

type PostCardProps = {
  title: string;
  content: string;
};

export const PostCard = ({ title, content }: PostCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`${styles.card} ${isHovered ? styles.hovered : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};
