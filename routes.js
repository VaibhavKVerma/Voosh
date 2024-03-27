const express = require('express');
const validateUserMiddleware = require('./middleware/userMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const userController = require('./controllers/userController');
const passport = require('./utils/gAuth');

const apiRouter = express.Router();

apiRouter.post('/register', validateUserMiddleware, userController.register);
apiRouter.post('/login', userController.login);

apiRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
apiRouter.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    userController.thirdPartyRegistration
);


apiRouter.use(authMiddleware);

apiRouter.get('/profile', userController.getProfile);
apiRouter.get('/profiles', userController.getAllProfiles);
apiRouter.post('/details', userController.updateDetails);
apiRouter.post('/photourl', userController.updatePhotoUrl);
apiRouter.post('/profilevisibilty', userController.updateProfileVisibilty);

module.exports = apiRouter;