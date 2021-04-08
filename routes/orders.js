const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const Cart = require('../models/cart')

//get orders
router.get('/', async (req,res) => {
    try{
     const orders = await Order.find().sort({"_id":-1})
     res.json(orders)
    }catch(e) {
       res.status(500).json({message: e.message})
    }
 })

 router.get('/:email',async(req,res) => {
   try{
    const orders = await Order.find({"email": new RegExp(req.params.email)}).sort({"_id":-1})
    res.json(orders)
   }catch(e) {
      res.status(500).json({message: e.message})
   }
})

 router.post('/:email', async (req, res) =>{
    //console.log(req.file)
    const order = new Order({
      name: req.body.name,
      totalcost: req.body.totalcost,
      subtotal: req.body.subtotal,
      hst: req.body.hst,
      products:req.body.products,
      address:req.body.address,
      postalcode:req.body.postalcode,
      email:req.body.email,
      date:req.body.date,
      phonenumber:req.body.phonenumber,
      status:req.body.status
   })

   try{
      const ord = await order.save()

      Cart.findOne({'email':req.params.email}, function(err, updatedCart){

        updatedCart.products = []
        updatedCart.totalcost = 0
        updatedCart.hst = 0
        updatedCart.subtotal = 0
        updatedCart.save(function(err, cart){
            if(err) throw("error in update ",err);
            res.status(200).json(updatedCart)
            console.log("cart emptied ",updatedCart)
        })
    })
      //res.status(201)
      console.log("order placed")
   }catch(e){
      res.status(400).json({message: e.message})
      console.log(e)
   }
})

//update
router.patch('/:id', async (req, res) =>{
   let order = await Order.findById(req.params.id)
   console.log("order",order)
   try{
      
      order.status = req.body.status
      order.save()
      res.json(order)
      
   }catch(e){
      res.status(400).json({message: e.message})
   }
})

//delete
router.get('/delete/:id/:email', async (req, res) =>{
   try{
      let order = await Order.findById(req.params.id)
      order.remove()
      const orders = await Order.find({"email": new RegExp(req.params.email)})
      res.json(orders)
   }catch(e){
      res.status(500).json({message: e.message})
   }
})


router.get('/search/:value', async (req, res) => {
    
   let orders
   console.log('get search for empty length',req.params.value.length)

   try{
       if(req.params.value.length<=1){
           orders= await Order.find()
           
       }else if(req.params.value.length>1){
          
           orders = await Order.find({$or:[{"name": new RegExp(req.params.value,'i')},{"email":new RegExp(req.params.value,'i')}]});
           console.log("orders ",orders)
       }
      if(orders.length===0){
         return res.status(404).json({message: "cannot find order"})
      }
     
      res.send(orders)
   }catch(e){
      res.status(500).json({message: e.message})
   }

   
   
})


module.exports = router