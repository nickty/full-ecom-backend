const mongoose = require('mongoose')
const { ObjectId } =  mongoose.Schema
const Schema = mongoose.Schema


const orderSchema = new Schema({
    products:  [
        {
            product: {
                type: ObjectId, 
                ref: 'Product'
            }, 
            count: Number, 
            color: String, 
           
        }, 
       

    ], 
    paymentIntent: {},
    orderStatus: {
        type: String, 
        default: 'Not processed', 
        enum:[
            "Not processed", 
            "processing",
            "cash on delivery",
            "dispatched",
            "cancelled",
            "completed"
        ]
    }, 
    orderedBy: {
        type: ObjectId, 
        ref: "User"
    }
}, {timestamps: true})

module.exports = mongoose.model("Order", orderSchema)
