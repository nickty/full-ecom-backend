const Category = require('../models/category')
const User = require('../models/user')
const Product = require('../models/product')
const slugify = require('slugify')



exports.create = async (req, res) => {
    try {

        console.log(req.body)

        req.body.slug = slugify(req.body.title)

        const newProduct = await new Product(req.body).save()

        res.json(newProduct)
        
    } catch (error) {
        console.log(error)
        // res.status(400).send('Create product failed')
        res.status(400).json({
            err: error.message
        })
    }
} 

exports.listAll = async (req, res) => {
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([["createdAt", "desc"]])
    .exec()

    res.json(products)
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec(); 

        res.json(deleted)
        
    } catch (error) {
        console.log(error)
        res.status(400).send('Product delete failed')
       
    }
}

exports.read = async (req, res) => {
    try {

        const product = await Product.findOne({slug: req.params.slug})
        .populate('category')
        .populate('subs')
        .exec()

        res.json(product)
        
    } catch (error) {
        console.log(error)
        res.status(400).send('Failed to product from categry')
    }
}

exports.update =  async (req, res) => {
    try {

        // if(req.body.title){
        //     req.body.slug = slugify(req.body.title)
        // }

        const updated = await Product.findOneAndUpdate({slug: req.params.slug}, req.body, {new: true}).exec()

        res.json(updated)
        
    } catch (error) {
        console.log(error)
        res.status(400).send('Proudct update failed')
    }
}

// exports.list = async (req, res) => {
//     try {

//         const {sort, order, limit} = req.body
//         const products = await Product.find({})
//         .populate('category')
//         .populate('subs')
//         .sort([[sort, order]])
//         .limit(limit)
//         .exec()

//         res.json(products)
        
//     } catch (error) {
//         console.log(error)
//         res.status(400).send('Proudct query failed')
//     }
// }

//with pagination
exports.list = async (req, res) => {
    try {

        const {sort, order, page} = req.body
        const currentPage = page || 1
        const perPage = 3

        const products = await Product.find({})
        .skip((currentPage - 1) * perPage)
        .populate('category')
        .populate('subs')
        .sort([[sort, order]])
        .limit(perPage)
        .exec()

        res.json(products)
        
    } catch (error) {
        console.log(error)
        res.status(400).send('Proudct query failed')
    }
}

exports.productsCount = async (req, res) => {
    
    let total = await Product.find({}).estimatedDocumentCount().exec();

    res.json(total)
}

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({email: req.user.email}).exec()

    const { star } = req.body

    // who is updating
    //check if currently logged in user have already added rating thos project

    let existingRatingObject = product.ratings.find(el => 
        el.postedBy.toString() === user._id.toString()
        )

    //if user haven't left rating yet, push it
    if(existingRatingObject === undefined){
        let ratingAdded = await Product.findByIdAndUpdate(product._id, {
            $push : { ratings: { star: star, postedBy: user._id} }
        }, {new: true}).exec()

        res.json(ratingAdded)
    } else {
        //if user have already left rating, update it

        ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject}
            }, {
                $set: { "ratings.$.star": star }
            }, 
            {new: true}
        ).exec()

        res.json(ratingUpdated)

    }
    

}

const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search : query}})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

    res.json(products)
}

const handlePrice = async (req, res, price ) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1]
            }
        })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()

        res.json(products)

    } catch (error) {
        console.log(error)
        res.status(400).send('Price query failed')
    }
}

const handleCategory = async(req, res, category) => {
    try {

        let products = await Product.find({
            category
        })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()

        res.json(products)
        
    } catch (error) {
        console.log(error)
        res.status(400).send('Cateogry query failed')
    }
}

const handleStar = (req, res, stars) => {
    Product.aggregate([
        {
            $project: {
                document: "$$ROOT",
                floorAverage: {
                    $floor : {
                        $avg: "$ratings.star" 
                    }
                }
            }
        }, 
        {
            $match: {floorAverage: stars}
        }
    ])
    .limit(12)
    .exec((err, aggregate) => {
        if(err) console.log('Aggregate error', err)

        Product.find({_id:aggregate})
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, products) => {
            if(err) console.log('Aggregate error', err)
            res.json(products)
        })
    })
}

const handleSub = async(req, res, sub) => {
    const products = await Product.find({subs: sub})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

    res.json(products)
}

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({shipping})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

    res.json(products)
}
const handleColor = async (req, res, color) => {
    const products = await Product.find({color})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

    res.json(products)
}
const handleBrand = async (req, res, brand) => {
    const products = await Product.find({brand})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

    res.json(products)
}

exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, sub, shipping, color, brand } = req.body

    if(query){
        console.log('query', query)
        handleQuery(req, res, query)
    }

    if(price !== undefined){
        console.log('price ---> ', price)
       await handlePrice(req, res, price)
    }

    if(category){
        console.log("category ---> ", category)
        await handleCategory(req, res, category)
    }

    if(stars){
        console.log("stars ---> ", stars)
        await handleStar(req, res, stars)
    }

    if(sub){
        console.log("Subs ---> ", sub)
        await handleSub(req, res, sub)
    }

    if(shipping){
        console.log("shiping ---> ", shipping)
        await handleShipping(req, res, shipping)
    }
    if(brand){
        console.log("brand ---> ", brand)
        await handleBrand(req, res, brand)
    }
    if(color){
        console.log("color ---> ", color)
        await handleColor(req, res, color)
    }
}