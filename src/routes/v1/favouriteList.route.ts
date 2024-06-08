import { Router } from 'express';
import { favouriteController } from '../../controllers';
const _router: Router = Router({
    mergeParams: true,
});

_router.route('/').post(favouriteController.addToFavourite);

_router.route('/').patch(favouriteController.removeFromFavourite);

_router.route('/').get(favouriteController.getFavourites);

export const router = _router;
