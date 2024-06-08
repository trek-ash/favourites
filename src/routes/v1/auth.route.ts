import { Router } from 'express';
import validate from '../../middlewares/validationMiddleware';
import { authController } from '../../controllers';
import { loginPassword, userName } from '../../validators/authValidator';
import { password } from '../../validators/userValidator';
import { requiredTextField } from '../../validators/commonValidator';

//AUTH ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//USER LOGIN
_router
    .route('/login')
    .post(validate([userName(), loginPassword()]), authController.login);


//USER LOGIN
_router
    .route('/movie')
    .post(authController.addMovie);

//USER LOGIN
_router
    .route('/tvShow')
    .post(authController.addTVShow);



_router
    .route('/reset-password')
    .post(
        validate([
            password('password'),
            password('confirmPassword'),
        ]),
        authController.resetPassword
    );

//EXPORT
export const router = _router;
