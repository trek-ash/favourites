import mongoose, { Document, Schema } from 'mongoose';
import { Movie } from '../interfaces';
import { Genre } from '../utils/enums';

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface MovieModel extends Movie, Document {}

//DEFINE USER SCHEMA
const MovieSchema: Schema = new Schema(
    {
        title: String,
        description: String,
        genres: [{ type: String, enum: Genre }],
        releaseDate: Date,
        director: String,
        actors: [String],
    },
    { timestamps: true }
);

//EXPORT
export default mongoose.model<Movie>('Movie', MovieSchema);
