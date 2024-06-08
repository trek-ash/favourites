import { Router } from 'express';
import { authorization, userName } from '../../validators/authValidator';
import validate from '../../middlewares/validationMiddleware';
import auth from '../../middlewares/authMiddleware';
import { password } from '../../validators/userValidator';
import { requiredTextField } from '../../validators/commonValidator';
import { userController } from '../../controllers';

//USER ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//USER SIGNUP
_router
    .route('/sign-up')
    .post(
        validate([
            userName(),
            password('password'),
        ]),
        userController.createUser
    );

//UPDATE USER DETAILS
_router.route('/update/:userId').patch(
    validate([
        authorization(),
        requiredTextField('firstName', 'FirstName', { min: 2, max: 255 }),
        requiredTextField('lastName', 'LastName', { min: 2, max: 255 }),
        requiredTextField('dateOfBirth', 'Date Of Birth', {
            min: 2,
            max: 255,
        }),
        requiredTextField('residence', 'Residence', { min: 2, max: 255 }),
        requiredTextField('avatar', 'Avatar', { min: 2, max: 255 }),
    ]),
    auth,
    userController.updateUser
);

//GET USER DETAILS BY ID
_router
    .route('/fetch/:userId')
    .get(
        validate([authorization()]),
        auth,
        userController.getUser
    );

//GET ALL USER LIST
_router
    .route('/fetch')
    .get(
        validate([authorization()]),
        auth,
        userController.getAllUser
    );

//EXPORT
export const router = _router;
