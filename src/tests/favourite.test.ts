import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index'; // Adjust the path to your Express app
import User from '../models/user'
import mongoose from 'mongoose';

chai.use(chaiHttp);
const { expect } = chai;

describe('Favourites API', () => {
    let userId: string;

    beforeEach(async () => {
        const user = new User({ username: 'testuser', favorites: [] });
        await user.save();
        userId = user._id.toString();
    });

    it('should add a favourite item', async () => {
        const res = await chai.request(app)
            .post('/users/favourites')
            .send({ userId, itemId: '123', itemType: 'movie' });

        expect(res).to.have.status(200);
        expect(res.body.status).to.be.true;
        expect(res.body.message).to.equal('Added successfully');

        const user = await User.findById(userId);
        expect(user?.favourites).to.have.lengthOf(1);
        expect(user?.favourites[0].contentId).to.equal('123');
    });

    it('should not add a duplicate favourite item', async () => {
        await chai.request(app)
            .post('/users/favourites')
            .send({ userId, itemId: '123', itemType: 'movie' });

        const res = await chai.request(app)
            .post('/users/favourites')
            .send({ userId, itemId: '123', itemType: 'movie' });

        expect(res).to.have.status(409);
        expect(res.body.status).to.be.false;
        expect(res.body.message).to.equal('Already present');

        const user = await User.findById(userId);
        expect(user?.favourites).to.have.lengthOf(1);
    });

    it('should handle errors gracefully', async () => {
        const invalidUserId = new mongoose.Types.ObjectId();

        const res = await chai.request(app)
            .post('/users/favourites')
            .send({ userId: invalidUserId, itemId: '123', itemType: 'movie' });

        expect(res).to.have.status(500);
    });
});
