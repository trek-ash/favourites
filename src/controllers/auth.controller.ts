import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne } from '../utils/general';
import { matchedData } from 'express-validator';
import User, { IUserModel } from '../models/user';
import { generateJWT } from '../utils';
import { compare, hash } from 'bcrypt';
import { AuthInterface } from '../interfaces/authInterface';
import Movies from '../models/Movies';
import { Movie, TVShow } from '../interfaces';
import TVShows from '../models/TVShows';

//GENERATE TOKEN FOR LOGIN
const tokenBuilder = async (user: IUserModel) => {
    const accessToken = generateJWT(
        {
            id: user._id,
            tokenType: 'access',
        },
        {
            issuer: user.username,
            subject: user.username,
            audience: 'root',
        }
    );

    return {
        accessToken: accessToken,
    };
};

//USER LOGIN
const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<AuthInterface> => {
    try {
        let bodyData = matchedData(req, {
            includeOptionals: true,
            locations: ['body'],
        });

        const { username, password } = bodyData;

        let user = await User.findOne({ username });
        const isValidPass = await compare(password, user.password);
        if (!user || !isValidPass) {
            throw new HttpError({
                title: 'bad_login',
                detail: 'You have entered an invalid email address or password',
                code: 400,
            });
        }
        //CREATE TOKEN
        const token = await tokenBuilder(user);
        const response = {
            user,
            accessToken: token.accessToken,
        };
        return jsonOne<AuthInterface>(res, 200, response);
    } catch (error) {
        next(error);
    }
};

const addMovie = async (req, res, next) => {
    try {
        const { title, actors, description, director, releaseDate, genres } =
            req.body;

        //CRETA NEW USRE
        let movie = new Movies({
            title,
            actors,
            description,
            director,
            releaseDate,
            genres,
        });
        let savedMovie = await movie.save();
        return jsonOne<Movie>(res, 201, savedMovie);
    } catch (error) {
        next(error);
    }
};

const addTVShow = async (req, res, next) => {
    try {
        const { title, description, genres, episodes } = req.body;

        let tvShow = new TVShows({
            title,
            description,
            genres,
            episodes,
        });
        let savedTVShow = await tvShow.save();
        return jsonOne<TVShow>(res, 201, savedTVShow);
    } catch (error) {
        next(error);
    }
};


//RESET PASSWORD
const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        //IF USER NOT EXISTS
        if (!user) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'You have entered an invalid email address.',
                code: 400,
            });
        }
        //ADD NEW PASSWORD
        const hashPassword = await hash(password, 12);
        user.password = hashPassword;

        await user.save();
        return jsonOne<string>(res, 200, 'Password updated successfully');
    } catch (e) {
        next(e);
    }
};

export default {
    login,
    resetPassword,
    addMovie,
    addTVShow,
};
