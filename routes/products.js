const express = require('express')
const router = express.Router()
const Product = require('../models/product')
var fs = require('fs')
const multer = require('multer')


const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp'){
        cb(null,true);
    }else{
        cb(null, false);
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null,'./product-image/')
    },
    filename: function(req,file,callback){
        callback(null,file.originalname)
    }

})

const upload = multer({
    storage:storage,
fileFilter:fileFilter

})

//get products
router.get('/', async (req,res) => {
   try{
    const products = await Product.find()
    res.json(products)
   }catch(e) {
      res.status(500).json({message: e.message})
   }
})

//get product by category id
router.get('/category/:id', async (req, res) => {
    console.log("hitting search for category ",req.params.name)
    let products
    try{
       products = await Product.find({"cid": new RegExp(req.params.id,'i')});
       if(products == null){
          return res.status(404).json({message: "cannot find product"})
       }
       console.log("category products -> ",products)
       res.products = products
    }catch(e){
       res.status(500).json({message: e.message})
    }
 
    
    res.send(res.products)
 })


//get product by name
router.get('/search/:name', async (req, res) => {
    
    let products
    console.log('get search for empty length',req.params.name.length)

    try{
        if(req.params.name.length<=1){
            products= await Product.find()
            console.log('get search for empty length',req.params.name.length)
        }else if(req.params.name.length>1){
            console.log("hitting search for name ",req.params.name)
            products = await Product.find({"name": new RegExp(req.params.name,'i')});
        }
       if(products.length===0){
          return res.status(404).json({message: "cannot find product"})
       }
       //console.log("searched products -> ",products)
       res.products = products
    }catch(e){
       res.status(500).json({message: e.message})
    }
 
    
    res.send(res.products)
 })

//get product image
router.get('/image/:id', async (req,res) => {
    try{
        var file = 'product-image/'+req.params.id;
        //console.log("getting image");
        fs.readFile(file, function(err, content){
        //console.log("File -> ", file);
        if(err){
            console.log("file not found ",file);
            res.writeHead(404);
            res.end();
        }else{

            res.end(content);
        }
    })
    }catch(e) {
       res.status(500).json({message: e.message})
    }
 })

 //get product image by id
 router.get('/pimage/:id', getProduct,async (req,res) => {
    try{

        var pr = res.product
        var file = 'product-image/'+pr.image;
        //console.log("getting image");
        fs.readFile(file, function(err, content){
        //console.log("File -> ", file);
        if(err){
            console.log("file not found ",file);
            res.writeHead(404);
            res.end();
        }else{

            res.end(content);
        }
    })
    }catch(e) {
       res.status(500).json({message: e.message})
    }
 })

 //add image

 router.post('/image/:id', async (req,res) => {
     try{
        var folder = 'product-image';
        var pid = req.params.id;
        var data = req.body.data
        filename = pid+'.jpg';
        writeImage(folder,product,filename,data);
        res.end();

     }catch(e){

     }
 })

//create product

router.post('/', upload.single('fileData'), async (req, res) =>{
    console.log(req.file)
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      cid: req.body.cid,
      image: req.file.originalname
   })

   try{
      const newProduct = await product.save()
      let products = await Product.find({"cid": new RegExp(req.body.cid,'i')});
      res.status(201).json(products)
   }catch(e){
      res.status(400).json({message: e.message})
   }
})

//update product
router.patch('/update/:id', upload.single('fileData'), getProduct, async (req, res) =>{

    console.log(req.file)
    
   try{
    Product.findOne({'_id':req.params.id}, function(err, updatedProd){
        if(req.body.name){
            updatedProd.name = req.body.name
            console.log("Product name is updated",updatedProd.name)
        }
        if(req.body.price){
            updatedProd.price = req.body.price
            console.log("Product price is updated",updatedProd.price)
        }
          
        if(req.body.cid){
            updatedProd.cid = req.body.cid
            console.log("Product cid is updated",updatedProd.cid)
        }
          
        if(req.file!==undefined){
            updatedProd.image = req.file.originalname
            console.log("Product img is updated")
        }
        updatedProd.save(function(err, prod){
            //if(err) throw(err);
            res.status(200)
        })
    })
      let products = await Product.find({"cid": new RegExp(req.body.cid,'i')});
      res.json(products)
      
   }catch(e){
      res.status(400).json({message: e.message})
   }
})

//delete
router.get('/delete/:id', getProduct, async (req, res) =>{
   try{
      await res.product.remove()
      let products= await Product.find()
      res.json(products)
   }catch(e){
      res.status(500).json({message: e.message})
   }
})

//sort
router.get('/sort/:value', async (req, res) =>{
    try{
        let products
        let v = req.params.value
        if(v==="HL"){
            products= await Product.find().sort({"price":-1})
        }else if(v === "LH"){
            products= await Product.find().sort({"price":1})
        }else if(v === "NA"){
            products= await Product.find().sort({"_id":-1})
        }

        console.log("sort ",req.params.value,products)
       res.json(products)
    }catch(e){
       res.status(500).json({message: e.message})
    }
 })

async function getProduct(req, res, next){
   let product
   try{
      product = await Product.findById(req.params.id)
      if(product == null){
         return res.status(404).json({message: "cannot find product"})
      }
      
   }catch(e){
      res.status(500).json({message: e.message})
   }

   res.product = product
   next()
}


module.exports = router