const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
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
        count:Number
    }],
    address:{
        type:String,
        required: true
    },
    postalcode:{
        type: String,
        required:true
    },
    name:{
        type:String,
        required: true
    },
    phonenumber:{
        type:String,
        required: true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model('Order', orderSchema)