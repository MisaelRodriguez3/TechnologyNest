import { useParams } from "react-router-dom";
import PostsByTopicPage from "./Posts/PostsByTopicPage";
import ExamplesByTopicPage from "./Examples/ExamplesByTopicPage";
import ChallengesByTopicPage from "./Challenges/ChallengesByTopicPage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const SECTIONS = {
    'foro': PostsByTopicPage,
    'ejemplos-de-codigo': ExamplesByTopicPage,
    'retos': ChallengesByTopicPage
}

type Key = keyof typeof SECTIONS

const SectionPage = () => {
    const { section } = useParams<{section: string}>();
    
    const Section = section && section in SECTIONS 
        ? SECTIONS[section as Key] 
        : NotFoundPage

    return <Section/>
  };

export default SectionPage;