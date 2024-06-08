import mongoose, { Document, Schema } from 'mongoose';
import { TVShow } from '../interfaces';
import { Genre } from '../utils/enums';

export interface TVShowModel extends TVShow, Document {}


const TVShowSchema = new Schema({
    title: String,
    description: String,
    genres: [{ type: String, enum: Genre }],
    episodes: [
        {
            episodeNumber: Number,
            seasonNumber: Number,
            releaseDate: Date,
            director: String,
            actors: [String],
        },
    ],
});
export default mongoose.model<TVShowModel>('TVShow', TVShowSchema);
