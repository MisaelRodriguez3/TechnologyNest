import { useEffect, useState, useRef } from "react";
import styles from "./SuccessNotification.module.css";

interface SuccessNotificationProps {
  message: string;
  duration?: number;
  onHide?: () => void;
}

export default function SuccessNotification({
  message,
  duration = 5000,
  onHide
}: Readonly<SuccessNotificationProps>) {
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
    <div className={`${styles.success} ${isHiding ? styles.successHide : styles.successShow}`}>
      {message}
    </div>
  );
}
