import { body, header } from 'express-validator';
import { extractToken } from '../utils';

// AUTHORIZATION HEADER VALIDATOR FUNCTION
const authorization = () => {
    return header('authorization')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .withMessage('Missing authentication header')
        .bail()
        .customSanitizer((token, { location }) => {
            if (location === 'headers') {
                return extractToken(token);
            }
        })
        .isJWT()
        .withMessage(
            'Invalid Authorization header, must be Bearer authorization'
        );
};

//EMAIL VALIDATOR FUNCTION
const userName = () => {
    return body('username')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .withMessage('Username is required')
        .bail()
        .isLength({
            min: 3,
            max: 100,
        })
        .withMessage('Username must be between 3 and 100 characters')
        .bail()
        .withMessage('Username is not valid')
        .customSanitizer((username) => {
            return username.toLowerCase();
        });
};

//LOGIN PASSWORD VALIDATOR FUNCTION
const loginPassword = () => {
    return body('password')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .isString()
        .isLength({
            max: 255,
        })
        .withMessage('Password is not valid');
};

/** Token */
// const token = (field) => {
//     return body(field)
//         .trim()
//         .escape()
//         .exists()
//         .notEmpty()
//         .withMessage('Token is required')
//         .bail()
//         .isJWT()
//         .withMessage('Invalid token');
// };

//EXPORT
export {
    authorization,
    userName,
    loginPassword,
    // token
};
