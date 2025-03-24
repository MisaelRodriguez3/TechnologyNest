import api from "./axios";
import SearchResponse from "../types/search.types";

const searchEntries = async (text: string): Promise<SearchResponse> => await api.post(`/search?q=${text}`)

export default searchEntries;