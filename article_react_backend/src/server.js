import fs from "fs"; //to read files
import express from "express";
import admin from "firebase-admin";
import {db,ConnectToDb} from "./db.js";
import 'dotenv/config';

// To make __dirname work import the following
import { fileURLToPath } from "url";
import path from "path";

//Also add the following lines to make __dirname work
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//Read credentials from the json file
const credentials=JSON.parse(
fs.readFileSync('./credentials.json'));

/** Use the credentials to intialize firebase admin pkg
 * on our server and connect it to our firebase project. */


admin.initializeApp({
    credential:admin.credential.cert(credentials),
});
//what credentials to use to connect to our project 

/** use authtoken thats coming from every request from front-end
 * in order to load info (email, password, etc) about that user from firebase
*Use express middleware to automatically load user's info
*whenever we recieve a request.
*/
const app = express();
app.use(express.json());

/** To Have node server server the build files as static files,
 * tell our express server to use build folder as static folder
 */

app.use(express.static(path.join(__dirname,"../build")));

/**But since we added type 'module' in our package.json, this __dirname wont
 *  work by default*/

/** Handle any requests that doesnt go to one of our api routes  */
app.get(/^(?!\/api).+/,(req,res)=>{
    res.sendFile(path.join(__dirname,'../build/index.html'));
})
app.use(async (req,res,next)=>{
    const {authtoken}=req.headers;
    
    if(authtoken){
        try{
            req.user=await admin.auth().verifyIdToken(authtoken);
            
        }
        catch(e){
            return res.sendStatus(400);
        }
        
    }
    req.user=req.user||{};
    next();
   

})
/** Get comments and upvotes from mongo for particular article */

app.get("/api/article/:name", async (req, res) => {
  
    const { name } = req.params;
    
    const { uid } = req.user;
    const article = await db.collection('articles').findOne({ name });
    
    if (article) {
        const upvoteIds=article.upvoteIds || [];
        article.canUpvote=uid && !upvoteIds.includes(uid);
        res.json(article);
    }
    else {
        res.sendStatus(404);
    }
    

});
app.use((req,res,next)=>{
    if(req.user){
        next();
    }else{
        res.sendStatus(401);
    }
})
app.put("/api/article/:name/upvote", async (req, res) => {
    const { name } = req.params;
    const {uid}=req.user;
   
    const article = await db.collection('articles').findOne({ name });
    
    if (article) {
        const upvoteIds=article.upvoteIds || [];
        const canUpvote=uid && !upvoteIds.includes(uid);
        if(canUpvote){
            await db.collection("articles").updateOne({ name }, {
                $inc: { upvotes: 1 },
                $push:{upvoteIds:uid},
            })
        }
        const updatedArticle = await db.collection("articles").findOne({ name });
        res.json(updatedArticle);
        
    }
    else {
        res.send("That article doesn/'t exists.");
    }
   
});

app.post("/api/article/:name/comments", async (req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const {email}=req.user;
    const { uid } = req.user;


    await db.collection("articles").updateOne({ name }, {
        $push: { comments: {postedBy:email, text }},

    });
    const article = await db.collection("articles").findOne({ name });
    if (article) {
        const upvoteIds=article.upvoteIds || [];
        article.canUpvote=uid && !upvoteIds.includes(uid);

        res.json(article);
    } else {
        res.send("That article doesn/'t exists.");
    }
    
});
const PORT=process.env.PORT || 8000;
ConnectToDb(() => {
    console.log("Successfully connected to database");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}...`);
    })
})