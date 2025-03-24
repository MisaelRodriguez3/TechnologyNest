import { useState } from 'react';
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthProvider';
import styles from './Navbar.module.css';

interface NavbarProps {
  logged: boolean;
}

const Navbar = ({ logged }: NavbarProps) => {
  const [searchActive, setSearchActive] = useState(false);
  const {logout} = useAuth();

  return (
    <header className={styles.navbar}>
      <h1 className={styles.sitename}>
        <Link to="/">Technology Nest</Link>
      </h1>
      
      <div className={`${styles.searchContainer} ${searchActive ? styles.active : ''}`}>
        <form className={styles.searchForm}>
          <input 
            type="text" 
            placeholder="Buscar..." 
            className={styles.searchInput}
          />
          <FaSearch 
            className={styles.searchIcon} 
            onClick={() => setSearchActive(!searchActive)}
          />
        </form>
      </div>

      <nav className={styles.menuContainer}>
        {logged ? (
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <Link to="/profile" className={styles.iconLink}>
                <FaUser className={styles.menuIcon} />
              </Link>
            </li>
            <li className={styles.menuItem}>
              <FaSignOutAlt className={styles.menuIcon} onClick={logout}/>
            </li>
          </ul>
        ) : (
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <Link to="/login" className={styles.loginLink}>Log in</Link>
            </li>
            <li className={styles.menuItem}>
              <Link to="/register" className={styles.registerLink}>Sign up</Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
