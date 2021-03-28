const mongoose = require('mongoose')

const productssSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Float,
        required: true
    },
    cid: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Product', productsSchema)