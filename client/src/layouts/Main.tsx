import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/layout/Navbar/Navbar";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Footer from "../components/layout/Footer/Footer";
import LoadingScreen from "../components/ui/LoadingScreen/LoadingScreen";
import styles from "./layout.module.css";

export const Layout = () => {
  const {user, loading} = useAuth();
  const logged = !!user
  const location = useLocation()
  const withOutSidebar = ["/profile"]

  if (loading) return <LoadingScreen/>
  
  return (
    <>
      <Navbar logged={logged}/>
      <div className={styles.container}>        
        {!withOutSidebar.includes(location.pathname) && <Sidebar/>}
        <main className={`${styles.content} ${
          withOutSidebar.includes(location.pathname) ? styles.contentFull : ''
        }`}>
          <Outlet/>
        </main>
      </div>
      <Footer/>
    </>
  );
};