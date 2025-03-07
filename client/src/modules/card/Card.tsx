import { useRef, useState } from "react";
import "./Card.css"

export default function ForumPost() {
  // Referencia al título
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Estado para manejar la lista de comentarios
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  // Estado para cambiar los estilos
  const [highlighted, setHighlighted] = useState(false);

  // Modificar el título
  const modifyTitle = () => {
    if (titleRef.current) {
      titleRef.current.textContent = "Título Modificado del Post";
    }
  };

  // Agregar un comentario
  const addComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment(""); // Limpiar input después de agregar
    }
  };

  // Eliminar un comentario por índice
  const removeComment = (index: number) => {
    setComments(comments.filter((_, i) => i !== index));
  };

  // Alternar estilo al hacer clic en la publicación
  const toggleHighlight = () => {
    setHighlighted(!highlighted);
  };

  return (
    <div className="forum-post">
      {/* Modificar contenido */}
      <h2 ref={titleRef}>Título Original del Post</h2>
      <button onClick={modifyTitle}>Modificar Título</button>

      {/* Cambiar estilos */}
      <div
        className={`post-content ${highlighted ? "highlighted" : ""}`}
        onClick={toggleHighlight}
      >
        <p>Este es el contenido de la publicación del foro. Haz clic para resaltar.</p>
      </div>

      {/* Agregar y eliminar elementos */}
      <div className="comments-section">
        <h3>Comentarios:</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              {comment} <button onClick={() => removeComment(index)}>❌</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Añadir un comentario..."
        />
        <button onClick={addComment}>Agregar Comentario</button>
      </div>
    </div>
  );
}
