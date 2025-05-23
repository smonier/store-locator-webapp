
import React, { useState, useEffect } from 'react';
import { useStores } from '../contexts/useStores';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const [query, setQuery] = useState('');
  const { searchStores } = useStores();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchStores(query);
  };
  
  // Debounce search for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      searchStores(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, searchStores]);
  
  return (
    <form onSubmit={handleSearch} className={`${styles.searchForm} ${className || ''}`}>
      <div className={styles.inputContainer}>
        <Search className={styles.searchIcon} />

        <input
          type="text"
          placeholder={t('searchbar.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
        />
        <button 
          type="submit" 
          className={styles.searchButton}
        >
          {t('searchbar.button')}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
