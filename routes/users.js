const express = require('express')
const router = express.Router()
const User = require('../models/user');


router.post('/register', async (req, res) =>{

    try{
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        await user.save()
        res.status(201).json({message: "user added"})
    }catch(e){
       res.status(400).json({message: e.message})
    }
})

 module.exports = router