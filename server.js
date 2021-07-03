const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
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
app.use(express.json())
app.use(cors())

//route 
app.get('/api', (req, res) => {
    res.send('Hello')
})


//port 
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))