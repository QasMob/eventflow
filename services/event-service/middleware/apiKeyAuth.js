const Project = require('../models/Project')

exports.apiKeyCheck = async (req, res, next) => {

    try {
    const apiKeyRetrieval = req.headers['x-api-key']

    const project = await Project.findOne({apiKey: apiKeyRetrieval})

    if (!project){
        return res.status(401).json({
            status: 'fail',
            message: 'Unable to send api request'
        })
    }

    req.project = project


    next()

    } catch(err){
         return res.status(401).json({
            status: 'fail',
            message: 'Unable to send api request'
        })
    }


}
