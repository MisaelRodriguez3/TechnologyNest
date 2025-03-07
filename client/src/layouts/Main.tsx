import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar/Navbar";
import styles from "./layout.module.css";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.layoutMain}>
        <main className={styles.content}>
          <Outlet/>
        </main>
      </div>
    </div>
  );
};