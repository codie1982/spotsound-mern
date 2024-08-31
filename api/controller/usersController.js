const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require("google-auth-library");
const getUserDataFromGoogle = require("./googleController")
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
        throw new Error('Please add all fields')
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
const registerWithGoogle = asyncHandler(async (req, res) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Referrer-Policy","no-referrer-when-downgrade");

    const redirectUrl = "http://127.0.0.1:5001/api/users/oauth"
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID,process.env.CLIENT_SECRET,redirectUrl)
    const authorieUrl = oAuth2Client.generateAuthUrl({
        access_type:"offline",
        scope:"https://www.googleapis.com/auth/userinfo.profile email openid ",
        prompt:"consent"
    })
    res.status(200).json({
        url:authorieUrl
    })
})

const googleOAuth = asyncHandler(async (req, res) => {
    const code = req.query.code
    try {
        const redirectUrl = "http://127.0.0.1:5001/api/users/oauth"
        const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID,process.env.CLIENT_SECRET,redirectUrl)
        const ut = await oAuth2Client.getToken(code)
        await oAuth2Client.setCredentials(ut.tokens)
        const user = oAuth2Client.credentials
        const userData = await getUserDataFromGoogle(user.access_token)
        /**
         * {
            sub: '105113479171269382757',
            name: 'Engin EROL',
            given_name: 'Engin',
            family_name: 'EROL',
            picture: 'https://lh3.googleusercontent.com/a/ACg8ocK5AcLNndhbXFi8sdw_mo3b3EgkfRZgOOfS77dffHPVj56OswzN=s96-c',
            email: 'granitjeofizik@gmail.com',
            email_verified: true
            }
         */

        const{sub,name,given_name,family_name,picture,email,email_verified} = userData;
        //checkUsers    
        const userExist = await User.findOne({ email })
        if(!userExist){
            const doc = new User();
            doc.name = name
            doc.firstname = given_name;
            doc.lastname = family_name;
            doc.email = email
            doc.email_verify = email_verified
            doc.profileImage.type = "external" 
            doc.profileImage.path = picture 
            doc.appType="web"
            doc.authProvider="google"
            doc.authProviderID=sub
            const nUser = await doc.save(doc)
            if (nUser) {
                res.status(201)
                res.redirect('http://localhost:3000/profile');
            } else {
                res.status(400)
                throw new Error("InValied User data")
            }
        }else{
            res.redirect("http://localhost:3000/profile");
        }
    } catch (error) {
        console.log("error",error)
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
    getMe, loginUser, registerUser,registerWithGoogle,googleOAuth
}