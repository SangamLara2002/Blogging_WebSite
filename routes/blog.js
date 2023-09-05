const Router = require("express");
const router = Router();
const path = require('path');
const Blog = require('../schema/blog');
const Comment = require('../schema/comment');
const fileUpload = require('express-fileupload');

router.use(fileUpload());

router.get('/add-new', (req, res) => {
  return res.render('addBlog', {
    user: req.user,
  });
});

router.post('/', async (req, res) => {
  const { title, body } = req.body;

  if (!req.files || !req.files.coverImage) {
    return res.status(400).send('No files were uploaded.');
  }

  const coverImage = req.files.coverImage;
  const fileName = `${Date.now()}-${coverImage.name}`;

  try {
    const uploadPath = path.resolve(`./public/upload/${fileName}`);
    await coverImage.mv(uploadPath);

    const newBlog = new Blog({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL: `/upload/${fileName}`,
    });

    await newBlog.save();
    return res.redirect('/');
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const allComments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  console.log(allComments);
  res.render('blog', {
    user: req.user,
    blog,
    allComments,
  });
});

// for comment

router.post('/comment/:blogId', async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    return res.redirect(`/blog/${req.params.blogId}`);
  }
});

module.exports = router;
