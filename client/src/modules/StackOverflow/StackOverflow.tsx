import { useEffect, useState } from "react";
import styles from "./StackOverflow.module.css";

interface Question {
  question_id: number;
  title: string;
  link: string;
  score: number;
  answer_count: number;
  view_count: number;
  tags: string[];
  creation_date: number;
  last_activity_date: number;
  owner: {
    display_name: string;
  };
}

export default function StackOverflow() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetch("https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&site=stackoverflow")
      .then((response) => response.json())
      .then((data) => setQuestions(data.items))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className={styles.feedContainer}>
      <h1 className={styles.feedTitle}>Últimas Preguntas en Stack Overflow</h1>
      <div className={styles.feedLayout}>
        <ul className={styles.questionsList}>
          {questions.map((q) => (
            <li
              key={q.question_id}
              className={`${styles.questionItem} ${
                selectedQuestion?.question_id === q.question_id ? styles.selected : ""
              }`}
              onClick={() => setSelectedQuestion(q)}
            >
              <div className={styles.questionHeader}>
                <span className={styles.questionVotes}>{q.score} votos</span>
                <span className={styles.questionAnswers}>{q.answer_count} respuestas</span>
                <span className={styles.questionViews}>{q.view_count} vistas</span>
              </div>
              <span className={styles.questionTitle}>{q.title}</span>
              <div className={styles.questionTags}>
                {q.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.questionDetail}>
          {selectedQuestion ? (
            <div className={styles.detailContent}>
              <h2 className={styles.detailTitle}>{selectedQuestion.title}</h2>
              <div className={styles.metadata}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Autor:</span>
                  <span className={styles.metaValue}>{selectedQuestion.owner.display_name}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Creación:</span>
                  <span className={styles.metaValue}>
                    {formatDate(selectedQuestion.creation_date)}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Última actividad:</span>
                  <span className={styles.metaValue}>
                    {formatDate(selectedQuestion.last_activity_date)}
                  </span>
                </div>
              </div>
              <div className={styles.stats}>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{selectedQuestion.score}</span>
                  <span className={styles.statLabel}>Votos</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{selectedQuestion.answer_count}</span>
                  <span className={styles.statLabel}>Respuestas</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{selectedQuestion.view_count}</span>
                  <span className={styles.statLabel}>Vistas</span>
                </div>
              </div>
              <div className={styles.tagsContainer}>
                {selectedQuestion.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={selectedQuestion.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.detailLink}
              >
                Ver en Stack Overflow
              </a>
            </div>
          ) : (
            <p className={styles.detailPlaceholder}>Selecciona una pregunta para ver los detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}