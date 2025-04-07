import styles from "./carrusel.module.css";

const images = [
  "https://camp.ucss.edu.pe/wp-content/uploads/2021/09/img-llave-de-la-programacion.jpg",
  "https://desarrollarinclusion.cilsa.org/wp-content/uploads/2017/06/binary-system-557601_960_720.jpg",
  "https://www.unir.net/wp-content/uploads/2024/02/La-importancia-de-la-programacion-segura-o-desarrollo-seguro-de-software.jpg"
];

export const ImageCarousel = () => {
  return (
    <div className={styles.carousel}>
      {images.map((img, index) => (
        <div key={index} className={styles.slide} style={{ backgroundImage: `url(${img})` }} />
      ))}
    </div>
  );
};