require('dotenv').config({ path: './src/config/config.env' });
const app = require("./src/app");
const {connectToMongoDB} = require("./src/connectMongo")

const PORT = process.env.PORT || 5000;
const MONGODB_URL=process.env.MONGODB_URL;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


connectToMongoDB(MONGODB_URL).then(() => {
  console.log("MongoDB connected!");
});