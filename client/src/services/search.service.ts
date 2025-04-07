import api from "./axios";
import {SearchResponse} from "../types/search.types";

const searchEntries = async (text: string, page?: number): Promise<SearchResponse> => await api.get(`/search`, {params: {q:text, page: page}})

export default searchEntries;