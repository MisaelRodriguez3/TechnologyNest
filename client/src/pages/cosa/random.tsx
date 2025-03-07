import React, { useState, useEffect } from "react";
import "./styles.css";

// Ejercicio 1: Evento de Scroll
const ScrollSection: React.FC = () => {
  const [bgColor, setBgColor] = useState("white");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setBgColor(scrollY > 50 ? "lightblue" : "white");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="scroll-section" style={{ backgroundColor: bgColor }}>Scroll para cambiar color</div>;
};

// Ejercicio 2: Mostrar/Ocultar Elementos
const ToggleText: React.FC = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <button onClick={() => setVisible(!visible)}>Mostrar/Ocultar</button>
      <p className={`fade-text ${visible ? "visible" : "hidden"}`}>Este es un texto ocultable.</p>
    </div>
  );
};

// Ejercicio 3: Eventos del Mouse
const HoverArea: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="hover-area"
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{ backgroundColor: hovered ? "lightcoral" : "lightgray" }}
    >
      Pasa el mouse sobre mí
    </div>
  );
};

// Ejercicio 4: Carrusel de Imágenes
const ImageCarousel: React.FC = () => {
  const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <img src={images[index]} alt="carrusel" className="carousel-img" />
    </div>
  );
};

const Random: React.FC = () => {
  return (
    <div>
      <ScrollSection />
      <ToggleText />
      <HoverArea />
      <ImageCarousel />
    </div>
  );
};

export default Random;
