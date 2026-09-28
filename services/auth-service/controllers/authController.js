const User = require('../models/User')
const JWT = require('jsonwebtoken')

 function generateToken(userId){
    return JWT.sign({id: userId}, process.env.JWT_SECRET)
}





exports.register = async (req, res) => {

   try {
     // retrieve password

    const {password, email} = req.body

    const userCheck = await User.findOne({email})

    if (userCheck){
        return res.status(400).json({
        status: 'fail',
        message: 'Unauthorized access'
    })
    }

    const newUser = await User.create({password, email})

    const token = generateToken(newUser._id)


    newUser.password = undefined

    // secure -> true

    res.cookie('jwt', token, {
       expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
       httpOnly: true
    })

    res.status(201).json({
        message: 'success',
        data: {
            newUser
        }
    })

   } catch(err) {
    res.status(400).json({
        status: 'fail',
        message: err.message
    })
   }

}

exports.login = async (req, res) => {
    try {

    const {email, password} = req.body

    const findingUser = await User.findOne({email}).select('+password')


    if (!findingUser){
        return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized access'
     })
    }

    const isMatch = await findingUser.comparePassword(password)


    if (!isMatch){
        return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized access'
     })

    }

    const token = generateToken(findingUser._id)

    findingUser.password = undefined

    res.cookie('jwt', token, {
       expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
       httpOnly: true
    })


    res.status(200).json({
        message: 'success',
        data: {
            findingUser
        }
    })



    } catch(err){
        res.status(401).json({
        status: 'fail',
        message: err.message
     })

}
}



exports.me = async (req, res) => {

try {
    const userBack = await User.findById(req.user.id)

if (!userBack){
   return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized access'
     })
}

    const email = userBack.email
    const id = userBack._id
    const createdAt = userBack.createdAt

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                email,
                id,
                createdAt
            }
        }
    })




} catch(err){
      res.status(401).json({
        status: 'fail',
        message: err.message
     })
}

}
