import { useEffect, useState } from "react";
import styles from "./navbar.module.css";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      document.body.classList.toggle("scrolled-body", scrolled)
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.title}>
        <h1>Technology Nest</h1>
      </div>
    </nav>
  );
};