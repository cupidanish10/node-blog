const userFields = require("../model/userModel");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
// jwt for login
const SECRET_KEY = "THIS IS KEY";
const jwt = require("jsonwebtoken");
const { compare } = require("bcrypt");
const SALT_ROUND = 10;

const signUp = async function (req, res) {
  /* req.body
    {
        name: "Anish Rokka",
        email: 'cupidanish@gmail.com'
    }

 */
  //   console.log("req.body", req.body);
  let { fullname, email, password, confirmPassword } = req.body;
  //  console.log(fullname, email);

  try {
    // hapi/joy string validation
    const schema = Joi.object({
      password: Joi.string().min(5).max(10000),
      fullname: Joi.any(),
      confirmPassword: Joi.any(),
      email: Joi.any(),
    });

    // error handler for hapi/joi
    const validationError = schema.validate(req.body, { abortEarly: false });
    if (validationError && validationError.error) {
      console.log("Error is", validationError.error.details);
      let message = validationError.error.details.map((dat) => {
        throw dat.message;
      });
    }

    // 1.check password and confirm password
    if (password != confirmPassword) {
      throw res.status(401).json({
        message: "Password must be same",
      });
    }

    // 2.make every email to lowercase
    email = email.toLowerCase();

    // 3.checks old user exists or not
    let oldUser = await userFields.find({ email });

    if (oldUser.length > 0) {
      throw {
        status: 422,
        message: "User Already Exists",
      };
    }

    //5. hashing
    let hash = bcrypt.hashSync(password, SALT_ROUND);

    console.log("hash", hash);
    //6. add values to model with id
    let newUser = userFields({
      fullname,
      email,
      password: hash,
      confirmPassword: hash,
    });

    console.log("newUseer is ", newUser);

    //7. save to db
    let result = await newUser.save();

    //8. send status
    res.status(200).json({
      status: "OK",
      newUser: result,
    });
  } catch (err) {
    // console.log(err);

    res.status(err.status || 500).json({
      msg: err.message || err,
    });
  }
};

const login = async function (req, res) {
  //1. get email password
  try {
    let { email, password } = req.body;
    console.log(req.body);
    email = email.toLowerCase();

    //2. check user exists or not to login
    let currentUser = await userFields.findOne({ email });
    if (currentUser == null) {
      throw res.status(401).json({
        message: "User does not exists.Please sign up first",
      });
    }

    //3. compare password
    let comparePassword = bcrypt.compareSync(password, currentUser.password);

    if (!comparePassword) {
      throw {
        message: "Invalid password",
        status: 401,
      };
    }

    //4. use jwt
    // id and name taneko from currentuser
    console.log("current user", currentUser);
    let { _id, name } = currentUser;
    let token = jwt.sign(
      {
        _id,
        email,
        name,
      },
      SECRET_KEY,
      { expiresIn: "48h" }
    );

    // 5. this token stores email, password and Id
    // console.log("token", token);

    res.status(200).json({
      token,
    });
  } catch (err) {
    // console.log(err);
    res.status(err.status || 500).json({
      msg: err.message || err,
    });
  }

  // res.send("login");
};

module.exports = {
  signUp,
  login,
};
