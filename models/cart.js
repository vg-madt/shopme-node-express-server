const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    totalcost: {
        type: Number,
    },
    subtotal: {
        type: Number,
    },
    hst: {
        type: Number,
    },
    email:{
        type: String,
        required: true
    },
    products: [{
        pid:String,
        name:String,
        price:String,
        count:Number,
    }]
})

module.exports = mongoose.model('Cart', cartSchema)