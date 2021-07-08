const Category = require('../models/category')
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
        .populate("category")
        .populate("slug")
        .exec()

        res.json(product)
        
    } catch (error) {
        console.log(error)
        res.status(400).send('Failed to product from categry')
    }
}