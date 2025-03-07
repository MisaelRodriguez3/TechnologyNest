import { useEffect, useState } from "react";
import "./styles.css"; 

interface Question {
  question_id: number;
  title: string;
  link: string;
  owner: {
    display_name: string;
  };
}

export default function StackOverflowFeed() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetch("https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&site=stackoverflow")
      .then((response) => response.json())
      .then((data) => setQuestions(data.items))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="feed-container">
      <h1 className="feed-title">Últimas Preguntas en Stack Overflow</h1>
      <div className="feed-layout">
        <ul className="questions-list">
          {questions.map((q) => (
            <li
              key={q.question_id}
              className={`question-item ${selectedQuestion?.question_id === q.question_id ? "selected" : ""}`}
              onClick={() => setSelectedQuestion(q)}
            >
              <span className="question-title">{q.title}</span>
            </li>
          ))}
        </ul>

        <div className="question-detail">
          {selectedQuestion ? (
            <div className="detail-content">
              <h2 className="detail-title">{selectedQuestion.title}</h2>
              <p className="detail-author">Autor: {selectedQuestion.owner.display_name}</p>
              <a
                href={selectedQuestion.link}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-link"
              >
                Ver en Stack Overflow
              </a>
            </div>
          ) : (
            <p className="detail-placeholder">Selecciona una pregunta para ver los detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}