import { ImageCarousel } from "../../modules/carrusel/carrusel";
import { CommentSection } from "../../modules/comment/comment";
import { PostCard } from "../../modules/tarjeta/tarjeta";

function Random2() {

    return (
    <>
    <ImageCarousel />

    <PostCard 
    title="Bienvenido al foro"
    content="Participa en nuestras discusiones comunitarias"
    />

    <CommentSection />
    </>
    )
}

export default Random2