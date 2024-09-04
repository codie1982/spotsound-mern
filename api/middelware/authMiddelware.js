const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const SessionModel = require("../models/connectionModel");


const protect = asyncHandler(async (req,res,next)=>{
let token;
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            //Get user form to token
            req.user = await User.findById(decoded.id).select("-password")
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error("not authorized")
        }
    }
    if(!token){
        res.status(401)
        throw new Error("not authorized")
    }
})
// Oturum kontrolü middleware'i
async function isSessionActive(req, res, next) {
    if(req.session.user){
        return next();
    }else{
        res.redirect('/');  // Giriş sayfasına yönlendir
    }
}
// Oturum kontrolü middleware'i
async function isAuthenticated(req, res, next) {
    const nSessionModel = await SessionModel.findOne({ userId: req.user.id });
    if(nSessionModel){
        const nw = new Date(Date.now());
        const ex = new Date(nSessionModel.expiresAt)
        if(nw>=ex){
            res.redirect('/');  // Giriş sayfasına yönlendir
        }
        return next();
    }else{
        res.redirect('/');  // Giriş sayfasına yönlendir
    }
}
module.exports = { protect,isAuthenticated,isSessionActive }