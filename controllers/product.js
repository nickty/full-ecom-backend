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
        .populate("subs")
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

exports.list = async (req, res) => {
    try {

        const {sort, order, limit} = req.body
        const products = await Product.find({})
        .populate('category')
        .populate('subs')
        .sort([[sort, order]])
        .limit(limit)
        .exec()

        res.json(products)
        
    } catch (error) {
        console.log(error)
        res.status(400).send('Proudct query failed')
    }
}