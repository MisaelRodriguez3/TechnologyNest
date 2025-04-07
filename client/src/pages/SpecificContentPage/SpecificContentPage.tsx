import { useParams } from "react-router-dom";
import DetailChallenge from "../../modules/Sections/Challenge/DetailChallenge/DetailChallenge";
import DetailExample from "../../modules/Sections/Examples/DetailExample/DetailExample";
import DetailPost from "../../modules/Sections/Posts/DetailPost/DetailPost";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const SECTIONS = {
    'foro': DetailPost,
    'ejemplos-de-codigo': DetailExample,
    'retos': DetailChallenge
}

type Key = keyof typeof SECTIONS

function SpecificContentPage() {
    const { section } = useParams<{section: string}>();

    const Content = section && section in SECTIONS
        ? SECTIONS[section as Key]
        : NotFoundPage

    return <Content/>
}

export default SpecificContentPage;