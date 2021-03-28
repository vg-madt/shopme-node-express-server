const express = require('express')
const router = express.Router()
const Category = require('../models/category')

//get categories
router.get('/', async (req,res) => {
   try{
    const categories = await Category.find()
    res.json(categories)
   }catch(e) {
      res.status(500).json({message: e.message})
   }
})

//get category id
router.get('/:id', async (req, res) => {
   res.send(res.category)
})

//create category

router.post('/', async (req, res) =>{
   const category = new Category({
      name: req.body.name
   })

   try{
      const newCategory = await category.save()
      res.status(201).json(newCategory)
   }catch(e){
      res.status(400).json({message: e.message})
   }
})

//update
router.patch('/:id', getCategory, async (req, res) =>{
   if(req.body.name != null){
      res.category.name = req.body.name
   }

   try{
      const updatedCategory = await res.category.save()
      res.json(updatedCategory)
   }catch(e){
      res.status(400).json({message: e.message})
   }
})

//delete
router.delete('/:id', getCategory, async (req, res) =>{
   try{
      await res.category.remove()
      res.json({message: "Deleted category"})
   }catch(e){
      res.status(500).json({message: e.message})
   }
})

async function getCategory(req, res, next){
   let category
   try{
      category = await Category.findById(req.params.id)
      if(category == null){
         return res.status(404).json({message: "cannot find category"})
      }
      
   }catch(e){
      res.status(500).json({message: e.message})
   }

   res.category = category
   next()
}

module.exports = router