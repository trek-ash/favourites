import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../interfaces';
import { Genre, ITEM_TYPE } from '../utils/enums';

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface IUserModel extends IUser, Document {}

//DEFINE USER SCHEMA
const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            default: '',
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        preferences: {
            favoriteGenres: [{ type: String, enum: Genre }],
            dislikedGenres: [{ type: String, enum: Genre }],
        },
        watchHistory: [
            {
                contentId: { type: Schema.Types.ObjectId },
                watchedOn: Date,
                rating: Number,
            },
        ],
        favorites: [
            {
                type: {
                    type: String,
                    enum: ITEM_TYPE,
                    required: true,
                },
                itemId: { type: Schema.Types.ObjectId, required: true },
                title: String, // Optional for quicker display purposes
            },
        ],
    },
    { timestamps: true }
);

UserSchema.index({ 'favorites.itemId': 1 });


//EXPORT
export default mongoose.model<IUserModel>('User', UserSchema);
