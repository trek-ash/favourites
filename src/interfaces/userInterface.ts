import { Genre, ITEM_TYPE } from "../utils/enums";

export interface IUser {
    username: string;
    password: string;
    preferences: {
        favoriteGenres: Genre[];
        dislikedGenres: Genre[];
    };
    watchHistory: Array<{
        contentId: string;
        watchedOn: Date;
        rating?: number;
    }>;
    favourites: Array<{
        contentId: string;
        addedOn: Date;
        type: ITEM_TYPE
    }>
}
