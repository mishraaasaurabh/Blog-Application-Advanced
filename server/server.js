import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import cors from 'cors'
import jwt from 'jsonwebtoken'
import aws from "aws-sdk"
import { nanoid } from 'nanoid';

// schema below
import User from './Schema/User.js';
import Blog from './Schema/Blog.js'

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const server = express();
let PORT = 3000;
server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})
.then("successfully connected with mongodb");


// setting up s3 bucket

const s3 = new aws.S3({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const generateUploadURL = async () =>{

    const date = new Date();
     const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject',{
        Bucket: 'medium-clone-bloggging-website',
        Key: imageName,
        Expires:1000,
        ContentType: "image/jpeg"
     })

}

const verifyJwt = (req,res,next ) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]; 

    if(token == null){
        return res.status(401).json({error: "No access token"})
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err,user) =>{
        if(err){
            return res.status(403).json({error: "Access token is invalid"})
        }
        req.user = user.id
        next();
    })

}

const formatDatatoSend = (user) =>{
    const access_token = jwt.sign({id: user._id},process.env.SECRET_ACCESS_KEY)

    return{
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }

}

// upload image url route
server.get('/get-upload-url',(req,res)=>{
    generateUploadURL().then(url=> res.status(200).json({  uploadURL: url}))
    .catch(err => {
        console.log(err.message)
        return res.status(500).json({error: err.message })
    })
})
server.get('/',(req,res)=>{
   res.send("API Working")
})

server.post('/latest-blogs', (req,res)=>{

    let {page} = req.body;

    let maxlimit = 5;

    Blog.find({draft: false})
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt": -1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page-1)*maxlimit)
    .limit(maxlimit)
    .then(blogs => {
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error: err.message})
    })
})

server.get("/trending-blogs",(req,res)=>{
    Blog.find({draft:false})
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"activity.total_reads": -1, "activity.total_likes":-1, "publishedAt": -1})
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then(blogs=>{
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error: err.message})
    })
})

server.post('/search-blogs',(req,res)=>{
    let {tag} = req.body;

    let findQuery = {tags: tag, draft:false}

    let maxlimit = 5;

    Blog.find(findQuery)
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt": -1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .limit(maxlimit)
    .then(blogs => {
        return res.status(200).json({blogs})
    })
    .catch(err=>{
        return res.status(500).json({error: err.message})
    })

})


server.post('/create-blog',verifyJwt, (req,res)=>{
            
    let authorId = req.user;
    let { title,des,banner,tags, content,draft } = req.body;

    if(!title.length){
        return res.status(403).json({error: "You must provide title "})
    }
    if(!draft){
        if(!des.length || des.length> 200){
            return res.status(403).json({error: "You must provide blog description under 200 characters"})
        }
        if(!banner.length){
            return res.status(403).json({
                error: "You must provide blog banner to publish it"
            })
        }
        if(!content.blocks.length){
            return res.status(403).json({
                error: "There must be some blog content"
            })
        }
        
        if(!tags.length || tags.length> 10){
            return res.status(403).json({
                error: "Provide tags in order to publish blog, Maximum 10"
            })
    
        }
    }
    

    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g,"-")+nanoid();

    let blog = new Blog({
        title,
        des, banner, content, tags, author: authorId, 
        blog_id, draft: Boolean(draft)
    })

    blog.save().then( blog => {
        let incrementVal = draft ? 0 :1;

        User.findOneAndUpdate({_id: authorId}, { $inc: {"account_info.total_posts": incrementVal}, $push: {"blogs": blog._id}})
        .then(user => {
            return res.status(200).json({id: blog.blog_id})
        })
        .catch(err=>{
            return res.status(500).json({error: "Failed to update total post number"})
        })
    })
    .catch(err=>{
        return res.status(500).json({error: err.message})
    })


})


server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;

    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be at least 3 characters long" });
    }

    if (!email.length) {
        return res.status(403).json({ "error": "Enter Email" });
    }

    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is invalid" });
    }

    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be 6 to 20 characters long with 1 uppercase and 1 lowercase letter" });
    }

    bcrypt.hash(password, 10, (err, hashed_password) => {
        if (err) {
            return res.status(500).json({ "error": "Error hashing password" });
        }

        let username = email.split("@")[0];

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        });

        user.save()
            .then((u) => {
                return res.status(200).json(formatDatatoSend(u));
            })
            .catch((err) => {
                if(err.code==11000){
                    return res.status(500).json({"error": "Email already exists"})
                }
                return res.status(500).json({ "error": err.message });
            });
    });
}); // ✅ Correctly closing `server.post(...)`

server.post("/signin",(req,res)=>{
    let {email, password} = req.body;
    User.findOne({"personal_info.email": email})
    .then((user)=>{
        if(!user){
            return res.status(403).json({"error": "email not found"})
        }

        bcrypt.compare(password,user.personal_info.password,(err,result)=>{
            
            if(err){
                res.status(403).json({"error": "Error occured while please try again"})
            }
            if(!result){
                res.status(403).json({"error": "Incorrect password"})
            }
            else{
                res.status(200).json(formatDatatoSend(user))
            }
        })
    })
})

server.listen(PORT, () => {
    console.log('Listening on port -> ' + PORT);
});
