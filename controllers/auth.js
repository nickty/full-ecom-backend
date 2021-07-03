const User = require('../models/user')

exports.createOrUpdateUser = async (req, res) => {
    
    const { name, picture, email } = req.user

    const user = await User.findOneAndUpdate({email}, {name: email.split('@')[0], picture}, {new: true})

    if(user){
        res.json(user)
    } else {
        const newUser = await new User({
            email, name: email.split('@')[0], picture
        }).save()

        res.json(newUser)
    }
}

exports.currentUser = async (req, res) => {

    const { email } = req.user

    const user = await User.findOne({email})

    console.log(user)

    if(user){
        res.json(user)
    } else {
        res.json({err: 'there is an error'})
    }

}