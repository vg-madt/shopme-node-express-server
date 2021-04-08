const express = require('express')
const router = express.Router()
const Cart = require('../models/cart')

//get cart
router.get('/:email', getCart, async (req,res) => {
   try{
       let newCart;
    if(res.cart==null){
        console.log("cart is null")
        newCart = new Cart({email:req.params.email,hst:0,subtotal:0,totalcost:0});
        await newCart.save()
        res.json(newCart)
    }
    else{
        res.json(res.cart)
    }
   }catch(e) {
      res.status(500).json({message: e.message})
   }
})

router.post('/:email', async (req,res) => {
    try{
       
        console.log("body ",req.body)
        Cart.findOne({'email':req.params.email}, function(err, updatedCart){

           updatedCart.products = req.body.products
           updatedCart.totalcost = req.body.totalcost
           updatedCart.hst = req.body.hst
           updatedCart.subtotal = req.body.subtotal
           updatedCart.save(function(err, cart){
               if(err) throw("error in update ",err);
               res.status(200).json(cart)
           })
       })
       

    }catch(e){
        console.log(e)
    }
})

async function getCart(req, res, next){
    let cart
    try{
        cart = await Cart.findOne({"email": new RegExp(req.params.email)})
        //console.log("cart object ",cart)
       
    }catch(e){
       res.status(500).json({message: e.message})
    }
    
    res.cart = cart
    //console.log("found res cart",res.cart)
    next()
 }

module.exports = router