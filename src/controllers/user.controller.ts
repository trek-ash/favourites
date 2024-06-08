import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne, jsonAll } from '../utils/general';
import User, { IUserModel } from '../models/user';
import { hash } from 'bcrypt';
import { IUser } from '../interfaces';

//CREATE USER 
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        //FIND EXIST USES
        const userExist = await User.exists({ username });
        if (userExist) {
            throw new HttpError({
                title: 'username',
                detail: 'User name is already used',
                code: 422,
            });
        }

        //ENCRYPTION PASSWORD
        const hashPassword = await hash(password, 12);
        //CRETA NEW USRE
        let user = new User({
            username,
            password: hashPassword,
        });
        let savedUser = await user.save();
        return jsonOne<IUserModel>(res, 201, savedUser);
    } catch (error) {
        next(error);
    }
};


//GET USER DETAILS BY ID
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;

        let data = await User.findById(userId).populate('role');

        return jsonOne<IUser>(res, 200, data);
    } catch (error) {
        next(error);
    }
};

//GET ALL USER LIST
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };

        const count = await User.countDocuments({});
        //GETING DATA FROM TABLE
        let users = await User.find()
            .populate('role')
            .limit(pageOptions.limit * 1)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .sort({ createdAt: -1 });
        //CREATE PAGINATION
        const meta = {
            total: count,
            limit: pageOptions.limit,
            totalPages: Math.ceil(count / pageOptions.limit),
            currentPage: pageOptions.page,
        };
        return jsonAll<any>(res, 200, users, meta);
    } catch (error) {
        next(error);
    }
};

//UPDATE USER DETAILS WITH ID
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        /** Check if user is trying to update another user data */
        if (userId !== req.params.userId) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let user = await User.findById(userId);
        //If User not found
        if (!user) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'User Not Found.',
                code: 400,
            });
        }
        let isProfileCompleted = true;

        let savedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                dateOfBirth: body.dateOfBirth,
                residence: body.residence,
                avatar: body.avatar,
                isProfileCompleted,
            },
            { new: true }
        );
        return jsonOne<IUserModel>(res, 200, savedUser);
    } catch (error) {
        next(error);
    }
};

//EXPORT
export default {
    createUser,
    getUser,
    getAllUser,
    updateUser,
};
