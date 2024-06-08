import { Genre } from "../utils/enums";

export interface Movie {
    title: string;
    description: string;
    genres: Genre[];
    releaseDate: Date;
    director: string;
    actors: string[];
}
