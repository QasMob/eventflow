const JWT = require('jsonwebtoken')


exports.authCheck = async (req, res, next) => {
    try {

    const token = req.cookies.jwt

    if (!token){
        return res.status(401).json({
                        status: 'fail',
                        message: 'Failure to indentify token'
                    })

    }


    const decodedPayload = JWT.verify(token, process.env.JWT_SECRET)

    // req.user = id
    req.user = decodedPayload

    next()

    }

    catch(err){
        res.status(401).json({
        status: 'fail',
        message: 'Failure to indentify token'
    })
    }

}
