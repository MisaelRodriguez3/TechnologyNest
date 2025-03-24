import styles from './Pagination.module.css'; // Importamos los estilos

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: Readonly<PaginationProps>) {
  if (totalPages <= 0) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const generatePageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    if (currentPage > 4) pages.push('...');
    
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 3) pages.push('...');
    
    pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`${styles.button} ${currentPage === 1 ? styles.disabled : ''}`}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      {generatePageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`${styles.button} ${currentPage === page ? styles.active : ''}`}
            aria-label={`Ir a página ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`${styles.button} ${currentPage === totalPages ? styles.disabled : ''}`}
        aria-label="Página siguiente"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
