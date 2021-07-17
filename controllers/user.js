const User = require('../models/user')
const Product = require('../models/product')
const Cart = require('../models/cart')

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
    .populate('products.product', '_id title, price, totalAfterDiscount')
    .exec()

    const { products, cartTotal, totalAfterDiscount } = cart
    res.json({ products, cartTotal, totalAfterDiscount })

}