// ModalForm.tsx
import React from 'react';
import styles from './ModalForm.module.css';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalForm = ({ isOpen, onClose, children }: ModalFormProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackdrop}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
          <div className={styles.modalForm}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;