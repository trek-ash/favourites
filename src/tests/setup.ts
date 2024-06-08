import mongoose from 'mongoose';
// import User from '../src/models/user';  // Adjust the path to your User model


before(async () => {
    // mongoServer = await MongoMemoryServer.create();
    // const uri = mongoServer.getUri();
    // await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
    // await mongoServer.stop();
});
