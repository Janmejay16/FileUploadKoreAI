const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes')

// Database Connection
require("dotenv").config(); 
mongoose.connect(
    process.env.MONGODB_URI, 
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/*
----------------------------------------------------------------------------------
                            IMPORTANT
----------------------------------------------------------------------------------
MaxCapacity is defined as: 100 litres per day (.env file)
*/
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Order Routes
app.use('/', orderRoutes)

app.get('/*', (req, res) => {
    res.json({Error: 404, Message: "Looks like you got lost!"})
})

app.listen(5000, () => console.log("Server is running"));