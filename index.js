require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const Blog = require('./schema/blog');

const checkforAuthentication = require('./middlewares/authentication');

const app = express();
const PORT = 5000;
app.set("view engine",'ejs');
app.set('views',path.resolve('./views'));
app.use(express.static('public'));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));

app.use(checkforAuthentication("token"));

mongoose.connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected with database");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });

app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
      user:req.user,
      blogs:allBlogs,
    });
})

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
