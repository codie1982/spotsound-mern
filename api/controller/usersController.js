const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//access private

const getMe = asyncHandler(async (req, res) => {
    const {_id,name,email} = await User.findById(req.user.id)
    try {
        res.status(200).json({
            id:_id,name,email
        });
    } catch (error) {
        console.error('Error reading data:', error);
    }
});

//access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please a data field")
    }


    //checkUsers 
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error("User Already register")
    }
    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create User
    const doc = new User();
    doc.name = name
    doc.email = email
    doc.password = hashedPassword
    const nUser = await doc.save(doc)
    if (nUser) {
        res.status(201).json({
            _id: nUser._id,
            name: nUser.name,
            email: nUser.email,
            token:generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("InValied User data")
    }
})
//access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400)
        throw new Error("there is no email or password")
    }
    try {
        const user = await User.findOne({ email });
        if (user || bcrypt.compare(password, user.password)) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token:generateToken(user._id)
            });
        }else{
            res.status(400)
            throw new Error("inValide credental")
        }
    } catch (error) {
        console.error('Error reading data:', error);
    }
});


//Generete Token
const generateToken =(id)=>{
return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:'30d'
})
}
module.exports = {
    getMe, loginUser, registerUser
}