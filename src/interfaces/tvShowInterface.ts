import { Genre } from "../utils/enums";

export interface TVShow {
 title: string;
 description: string;
 genres: Genre[];
 episodes: Array<{
 episodeNumber: number;
 seasonNumber: number;
 releaseDate: Date;
 director: string;
 actors: string[];
 }>;
}