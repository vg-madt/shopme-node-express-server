require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json());

const categoriesRouter = require('./routes/categories');
const userRouter = require('./routes/users')

app.use('/categories', categoriesRouter)
app.use('/user', userRouter)
app.get('/', (req, res) => {
    res.send("app will work");
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
