const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const upload = require("../middlewares/uploader");
const postFields = require("../model/postModel");

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controller/postController");

const { signUp, login } = require("../controller/userController");

// get all posts
router.get("/", getPosts);

// get one post
router.get("/:id", getPost);

console.log("up", upload);
// create post
router.post("/", upload.single("thumbnail"), async function (req, res) {
  try {
    let data = req.body;
    let { title, body } = data;

    console.log("req.body", req.body);
    console.log("req.file", req.file);
    // return;
    // hapi/joy string validation
    const schema = Joi.object({
      title: Joi.string().min(4).max(30).required(),
      body: Joi.string().min(5).max(10000),
      desc: Joi.string().min(5).max(10000),
    });

    // error handler for hapi/joi
    const validationError = schema.validate(data, { abortEarly: false });
    if (validationError && validationError.error) {
      console.log("Error is", validationError.error.details);
      let message = validationError.error.details.map((dat) => {
        throw dat.message;
      });
    }

    //   console.log("title is", data);

    // postField is not a function , we are envoking() because we require above
    // console.log("postdata", postFields);

    // for every time we create new post, postField ma data pathauney
    let newPost = postFields({
      body: body,
      // key must be same as postModel Schema : req.body.desc (desc is defined in postman as key)
      title: title,
      short_desc: req.body.desc,
    });
    // console.log("newpost", newPost);

    // save to db , model.save => sets new id for every new post
    let result = await newPost.save();
    // console.log("result is", result);

    // send data to frontend if status is 200
    res.redirect("/api");
  } catch (err) {
    console.log(err);
    res.status(422).json({
      err,
    });
  }
});

// update Post
router.patch("/:id", updatePost);

// delete Post
router.delete("/:id", deletePost);

//authentication
router.post("/user/login", login);
router.post("/user/signup", signUp);

module.exports = router;
