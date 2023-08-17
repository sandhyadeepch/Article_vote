import {MongoClient} from "mongodb";
let db;
async function ConnectToDb(cb){
    const client=new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.gskmpio.mongodb.net/?retryWrites=true&w=majority`);
    await client.connect();
    db=client.db('react-article-db');
    cb();
}
export {db, ConnectToDb};