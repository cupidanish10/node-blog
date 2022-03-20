const postFields = require("../model/postModel");
const Joi = require("@hapi/joi");

/*
    - postFields / Schema 
    - Created At Date
    - try catch method -> where to use 
    - multer
    
*/

// console.log("postFields", postFields);

// get all posts for frontend
const getPosts = async function (req, res) {
  // send data to pages
  try {
    let posts = await postFields.find();

    res.render("pages/blog/list", {
      posts,
    });
  } catch (err) {
    console.log(err);
  }
};

// get one post
const getPost = async function (req, res) {
  try {
    let singlePost = await postFields.findById(req.params.id);

    res.render("pages/blog/detail", {
      singlePost,
    });
  } catch (err) {
    console.log(err);
  }

  // res.send("Get one post");
};

// create post
const createPost = async function (req, res) {
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
    // console.log(err);
    res.status(422).json({
      err,
    });
  }
};

// update Post
const updatePost = function (req, res) {
  res.send("Update Post");
};

// delete Post
const deletePost = function (req, res) {
  res.send("Delete Post");
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
