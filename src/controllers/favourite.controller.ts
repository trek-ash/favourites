import mongoose from 'mongoose';
import User, { IUserModel } from '../models/user';
import { jsonOne } from '../utils/general';
import { addToCache, getFromCache } from '../library/Cache';

const addToFavourite = async (req, res, next) => {
    try {
        const { userId, itemId, itemType } = req.body;
        const existingFavouriteForUser = await User.findOne({
            _id: new mongoose.Types.ObjectId(userId),
            'favorites.itemId': itemId,
            'favorites.type': itemType,
        });
        if (existingFavouriteForUser)
            return jsonOne(res, 409, {
                status: false,
                message: 'Already present',
            });

        await User.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            {
                $addToSet: {
                    favorites: {
                        itemId: new mongoose.Types.ObjectId(itemId),
                        type: itemType,
                    },
                },
            }
        );
        return jsonOne(res, 200, {
            status: true,
            message: 'Added successfully',
        });
    } catch (error) {
        next(error);
    }
};

const removeFromFavourite = async (req, res, next) => {
    try {
        const { userId, itemId } = req.body;

        // Not considered item type here since requirements says uniquely identified ids for both movie and tvshow

        await User.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            {
                $pull: {
                    favorites: { itemId: new mongoose.Types.ObjectId(itemId) },
                },
            }
        );

        return jsonOne(res, 200, {
            status: true,
            message: 'Removed successfully',
        });
    } catch (error) {
        next(error);
    }
};
const getFavourites = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;
        
        const skip = (page - 1) * limit;
        let result = [];
        if(page==0)
            result = await getFromCache(userId+"_fav");
            
        if(!result || !result.length)   {
            result = await User.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(userId) } },
                { $project: { favorites: 1 } },
                { $unwind: '$favorites' },
                { $sort: { 'favorites.addedAt': -1 } }, // Assuming each favorite has an addedAt field for sorting
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'movies',
                        localField: 'favorites.itemId',
                        foreignField: '_id',
                        as: 'movieDetails',
                        pipeline: [
                            {
                                $project: {
                                    title: 1,
                                    description: 1,
                                    releaseDate: 1,
                                    _id: 1,
                                },
                            }, // Limit fields
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'tvshows',
                        localField: 'favorites.itemId',
                        foreignField: '_id',
                        as: 'tvShowDetails',
                        pipeline: [
                            {
                                $project: {
                                    title: 1,
                                    description: 1,
                                    releaseDate: 1,
                                    _id: 1,
                                },
                            }, // Limit fields
                        ],
                    },
                },
                {
                    $addFields: {
                        'favorites.details': {
                            $cond: {
                                if: { $eq: ['$favorites.type', 'movie'] },
                                then: { $arrayElemAt: ['$movieDetails', 0] },
                                else: { $arrayElemAt: ['$tvShowDetails', 0] },
                            },
                        },
                    },
                },
                { $project: { movieDetails: 0, tvShowDetails: 0 } },
                {
                    $group: {
                        _id: '$_id',
                        favorites: { $push: '$favorites' },
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        pipeline: [
                            {
                                $match: {
                                    _id: new mongoose.Types.ObjectId(userId),
                                },
                            },
                            {
                                $project: {
                                    totalFavorites: { $size: '$favorites' },
                                },
                            },
                        ],
                        as: 'totalFavorites',
                    },
                },
                { $unwind: '$totalFavorites' },
                {
                    $project: {
                        favorites: 1,
                        totalFavorites: '$totalFavorites.totalFavorites',
                    },
                },
            ]);

            addToCache(userId+"_fav", result);

        }

        if (result.length === 0) {
            return jsonOne(res, 200, {
                items: [],
                currentPage: page,
                totalPages: 0,
            });
        }

        const { favorites, totalFavorites } = result[0];
        const totalPages = Math.ceil(totalFavorites / limit);

        const data = {
            items: favorites,
            currentPage: page,
            totalPages,
            totalCount: totalFavorites,
        };
        return jsonOne(res, 200, data);
    } catch (error) {
        console.log({ error });

        next(error);
    }
};

export default {
    addToFavourite,
    removeFromFavourite,
    getFavourites
}