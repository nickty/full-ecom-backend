const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
// const authRouter = require('./routes/auth')
const { readdirSync } = require('fs')
require('dotenv').config()

const app = express()

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false, 
    useUnifiedTopology: true
})
.then( () =>  console.log(`DB Connected`))
.catch(err => console.log(`DB Connection err ${err}`))

//middlewares 
app.use(morgan('dev'))
app.use(express.json({limit: '50mb'}))
app.use(cors())

//route 
// app.use('/api', authRouter)
readdirSync('./routes').map(r => app.use('/api', require('./routes/' + r))); 


//port 
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))