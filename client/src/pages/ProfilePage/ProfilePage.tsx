import { useEffect, useState } from "react";
import { UserUpdate } from "../../types/user.types";
import { updateUserProfile } from "../../services/user.service";
import { useAuth } from "../../context/AuthProvider";
import LoadingScreen from "../../components/ui/LoadingScreen/LoadingScreen";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const {user, setUser} = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserUpdate>({});
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    document.title = 'Profile'
    setFormData(user ?? {})
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    console.log({name, value, checked, type})
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(formData)
      console.log(response)
      if (response.status !== 200) throw new Error('Error al actualizar los datos');
      
      setUser(response.data);
      setEditMode(false);
      setSuccess('Datos actualizados correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? String(err) : 'Error de actualización');
    }
  };


  if (!user) return <LoadingScreen/>;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Perfil de Usuario</h1>
        {!editMode && (
          <button 
            className={styles.editButton}
            onClick={() => setEditMode(true)}
          >
            Editar Perfil
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.profileSection}>
          <div className={styles.avatarContainer}>
            <img 
              src={formData.image_url ?? user.image_url} 
              alt="Avatar" 
              className={styles.avatar}
            />
            {editMode && (
              <div className={styles.avatarOverlay}>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.avatarInput}
                />
                <span>Cambiar foto</span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Nombre</label>
            {editMode ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name ?? ''}
                onChange={handleInputChange}
              />
            ) : (
              <div className={styles.value}>{user.first_name}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Apellido</label>
            {editMode ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name ?? ''}
                onChange={handleInputChange}
              />
            ) : (
              <div className={styles.value}>{user.last_name}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Nombre de usuario</label>
            {editMode ? (
              <input
                type="text"
                name="username"
                value={formData.username ?? ''}
                onChange={handleInputChange}
                pattern="[a-zA-Z0-9]+"
                title="Solo letras y números"
              />
            ) : (
              <div className={styles.value}>@{user.username}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Correo electrónico</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={formData.email ?? ''}
                onChange={handleInputChange}
              />
            ) : (
              <div className={styles.value}>{user.email}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Autenticación en dos pasos</label>
            {editMode ? (
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  name="mfa_active"
                  checked={formData.mfa_active}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
            ) : (
              <div className={styles.value}>
                {user.mfa_active ? 'Activada' : 'Desactivada'}
              </div>
            )}
          </div>
        </div>

        {editMode && (
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              Guardar cambios
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setEditMode(false);
                setFormData(user);
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </form>

      <div className={styles.metadata}>
        <div>Miembro desde: {new Date(user.created_at).toLocaleDateString()}</div>
        <div>Última actualización: {new Date(user.updated_at).toLocaleDateString()}</div>
      </div>
    </div>
  );
  };
  
  export default ProfilePage;