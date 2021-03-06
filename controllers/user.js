const User = require('../models/user')
const Product = require('../models/product')
const Cart = require('../models/cart')
const Coupon = require('../models/coupon')
const Order = require('../models/order')
const uniqueid = require('uniqueid')

exports.userCart = async (req, res) => {
    const { cart } = req.body

    let products = []

    const user = await User.findOne({email: req.user.email}).exec()

    //check if cart iwth logged in user id alredy exist
    let cartExistByThisUser = await Cart.findOne({orderedBy: user._id}).exec()

    if(cartExistByThisUser){
        cartExistByThisUser.remove()
        console.log("remove old cart")
    }

    for (let i = 0; i < cart.length; i++) {      
        const object = {}

        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color

        //get prirce from total
        let { price } = await Product.findById(cart[i]._id).select("price").exec()
        object.price = price

        products.push(object)
       }

    // console.log(products)   

    let cartTotal = 0

    for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count
        
    }

    // console.log(cartTotal)


    let newCart = await new Cart({
        products, 
        cartTotal, 
        orderedBy: user._id
    }).save()

    console.log(newCart)

    res.json({
        ok: true
    })
}

exports.getCart = async (req, res) =>{
    const user = await User.findOne({email: req.user.email}).exec()

    let cart = await Cart.findOne({orderedBy: user._id})
    .populate('products.product', '_id title price totalAfterDiscount')
    .exec()

    const { products, cartTotal, totalAfterDiscount } = cart
  
    res.json({ products, cartTotal, totalAfterDiscount })

}

exports.emptyCart = async (req, res) => {
    const user = await User.findOne({email: req.user.email}).exec()

    const cart = await Cart.findOneAndRemove({orderedBy: user._id}).exec()

    res.json({ok: true})
}

exports.saveAddress = async (req, res) => {
    const userAddress = await User.findOneAndUpdate({email: req.user.email}, {address: req.body.address}).exec()

    res.json({ok: true})
}

exports.applyCouponToUserCart = async (req, res) => {
    const { coupon } = req.body

    const validCoupon = await Coupon.findOne({name: coupon}).exec()

    if(validCoupon === null){
        return res.json({err: 'Invalid coupon'})
    }

    const user = await User.findOne({email: req.user.email}).exec()

    let {products, cartTotal } = await Cart.findOne({orderedBy: user._id})
    .populate('proeucts.product', "_id title price")

    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2)

    Cart.findOneAndUpdate({orderedBy: user._id}, {totalAfterDiscount}, {new: true}).exec()

    res.json(totalAfterDiscount)
}

exports.createOrder = async (req, res) => {
    const {paymentIntent} = req.body.stripeResponse
    const user = await User.findOne({email: req.user.email}).exec()

    let { products } = await Cart.findOne({orderedBy: user._id}).exec()

    let newOrder = await new Order({
        products,
        paymentIntent,
        orderedBy: user._id
    }).save()

    // Reduce the quantity, increament sold
    let bulkOptions = products.map((item) => {
        return {
            updateOne:{
                filter: {_id: item.product._id},
                update: { $inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    })

    let updated = await Product.bulkWrite(bulkOptions, {});
    console.log("quantity and sold updated", updated)


    console.log("new order", newOrder)

    res.json({ok: true})
}

exports.orders = async (req, res) => {
    let user = await User.findOne({email: req.user.email}).exec()

    let userOrders = await Order.find({orderedBy: user._id})
    .populate('products.product').exec()

    res.json(userOrders)
}

exports.AddToWishlist = async (req, res) => {

    const { productId } = req.body
    
    const user = await User.findOneAndUpdate({email: req.user.email}, {$addToSet: {wishlist: productId}}, { new: true})
    .exec()

    res.json({ok: true})

}

exports.wishlist = async (req, res) => {

    const list = await User.findOne({email: req.user.email}).select('wishlist').populate('wishlist').exec()

    res.json(list)
    
}

exports.removeFromWishlist = async (req, res) => {
    
    const { productId } = req.params
    const user = await User.findOneAndUpdate({email: req.user.email}, {$pull: {wishlist: productId}}).exec()

    res.json({ok: true})
}

exports.createCashOrder = async (req, res) => {
    const {cod, couponApplied} = req.body

    if(!cod) return res.status(400).send()

    const user = await User.findOne({email: req.user.email}).exec()
    let userCart= await Cart.findOne({orderedBy: user._id}).exec()

    let finalAmount = 0

    if(couponApplied && userCart.totalAfterDiscount ){
        finalAmount = totalAfterDiscount * 100
    } else {
        finalAmount = cartTotal * 100
    }

  
    let newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
            id: uniqueid(), 
            amount: userCart.cartTotal,
            currency: 'usd',
            status: 'Cash On Delivery',
            created: Date.now(), 
            payment_method_types: ["cash"]
        },
        orderedBy: user._id, 
        status: "Cash On Delivery"
    }).save()

    // Reduce the quantity, increament sold
    let bulkOptions = userCart.products.map((item) => {
        return {
            updateOne:{
                filter: {_id: item.product._id},
                update: { $inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    })

    let updated = await Product.bulkWrite(bulkOptions, {});
    console.log("quantity and sold updated", updated)


    console.log("new order", newOrder)

    res.json({ok: true})
}