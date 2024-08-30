const asyncHandler = require("express-async-handler")

const User = require("../models/userModel")

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error reading data:', error);
    }
});


const setUser = asyncHandler(async(req,res)=>{
    if(!req.body.data){
        res.status(400)
        throw new Error("Please a data field")
    }
    const doc = new User();
    doc.name = req.body.data
    const nUser = await doc.save(doc)
    res.status(200).json(nUser)
})
const updateUser = asyncHandler (async(req,res)=>{
    res.status(200).json({
        message:`Update User ${req.params.id}`
    })
})

const deleteUser = asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:`Delete User ${req.params.id}`
    })
})
module.exports = {
    getUsers,setUser,updateUser,deleteUser
}