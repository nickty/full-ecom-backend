const User = require('../models/user')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Coupon = require('../models/coupon')
const stripe = require('stripe')(process.env.STRIPE_SECRET)


exports.createPaymentIntent = async (req, res) => {
    //later applie coupon 
    
    const user = await User.findOne({email: req.user.email}).exec()

    const { cartTotal } = await Cart.findOne({orderedBy: user._id})

    console.log('Cart total change', cartTotal)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: cartTotal * 100,
        currency: 'usd'
    })

    res.send({
        clientSecret: paymentIntent.client_secret,
    })
}