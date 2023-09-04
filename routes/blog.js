const Router = require("express");
const router = Router();
const multer = require('multer');
const path =require('path');
const Blog = require('../schema/blog');
const Comment = require('../schema/comment');

router.get('/add-new' , (req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    })
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/upload`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName);
    }
  })
  const upload = multer({ storage: storage });
router.post('/',upload.single('coverImage'),async(req,res)=>{
    const {title,body} = req.body;
  await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageURL:`upload/${req.file.filename}`,
    })
    return res.redirect('/');
});

router.get('/:id',async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const allComments = await Comment.find({blogId:req.params.id}).populate("createdBy");
  console.log(allComments);
  res.render('blog',{
    user:req.user,
    blog,
    allComments,
  })
});

// for comment

router.post('/comment/:blogId',async(req,res)=>{
  try {
    const comment = await Comment.create({
      content:req.body.content,
      blogId:req.params.blogId,
      createdBy:req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    return res.redirect(`/blog/${req.params.blogId}`);
  }
});

module.exports=router;