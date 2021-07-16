const mongoose = require('mongoose')
const { ObjectId } =  mongoose.Schema

const productSchema = new mongoose.Schema({
    title: {
        type: String, 
        trim: true, 
        required: true, 
        maxLength: 32,
        text: true
    },
    slug: {
        type: String, 
        unique: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String, 
        required: true, 
        maxLength: 2000,
        text: true
    },
    price: {
        type: Number, 
        trim: true, 
        required: true, 
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    subs: [{
        type: ObjectId,
        ref: 'Sub'
    }],
    quantity: Number,
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    shipping: {
        type: String,
        enum: ["yes", "no"]
    },
    color: {
        type: String,
        enum: ["Black", "Brown", "Silver", "White", "Blue"]
    },
    Brand: {
        type: String,
        enum: ["Apple", "HP", "Nokia", "Yamaha", "Microsoft"]
    }, 
    ratings: [
        {
            star: Number,
            postedBy: {type: ObjectId, ref: 'User'}
        }
    ]

}, {timestamps: true})


module.exports = mongoose.model('Product', productSchema)