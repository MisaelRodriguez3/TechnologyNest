import { useEffect, useState, useRef } from "react";
import styles from "./ErrorNotification.module.css";

interface ErrorNotificationProps {
  message: string;
  duration?: number;
  onHide?: () => void;
}

export default function ErrorNotification({
  message,
  duration = 5000,
  onHide
}: Readonly<ErrorNotificationProps>) {
  const [isHiding, setIsHiding] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const animationTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Iniciar temporizador para la animación de salida
    const timer = setTimeout(() => {
      setIsHiding(true);
      animationTimer.current = setTimeout(() => {
        setIsVisible(false);
        onHide?.();
      }, 300); // Tiempo de la animación de salida
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer.current);
    };
  }, [duration, onHide]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.error} ${isHiding ? styles.notificationHide : styles.notificationShow}`}>
      {message}
    </div>
  );
}
