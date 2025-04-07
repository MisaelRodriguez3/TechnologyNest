import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthProvider';
import styles from './Navbar.module.css';

interface NavbarProps {
  logged: boolean;
}

const Navbar = ({ logged }: NavbarProps) => {
  const navigate = useNavigate()
  const {logout} = useAuth();
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
 
  const search = (text: string) => {
    if (!text.trim()) return;
    setSearchActive(true);
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchText);
  };

  return (
    <header className={styles.navbar}>
      <h1 className={styles.sitename}>
        <Link to="/">Technology Nest</Link>
      </h1>
      
      <div className={`${styles.searchContainer} ${searchActive ? styles.active : ''}`}>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Buscar..." 
            className={styles.searchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <FaSearch 
            className={styles.searchIcon} 
            onClick={() => search(searchText)}
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
