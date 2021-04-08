const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cid: {
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    count:{
        type: Number
    }
})

module.exports = mongoose.model('Product', productsSchema)