require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json());

const categoryRouter = require('./routes/categories');
const userRouter = require('./routes/users')
const productRouter = require('./routes/products')
const cartRouter = require('./routes/carts')
const orderRouter = require('./routes/orders')

app.use('/category', categoryRouter)
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)

app.get('/', (req, res) => {
    res.send("app will work");
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
