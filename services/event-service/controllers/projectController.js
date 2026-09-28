
const Project = require('../models/Project')
const {nanoid} = require('nanoid')


//  create a project. It should take a name from the body, generate an API key using nanoid, attach the userId from the JWT, and save.
exports.createProject = async (req, res, next) => {
    try {

    const {name} = req.body
    const {id} = req.user

    const apiKeyGen = `pk_${nanoid()}`

    const project = await Project.create({name, userId: id, apiKey: apiKeyGen})

    res.status(201).json({
        status: 'success',
        data: {
            project
        }
    })
    }
    catch(err){
        res.status(400).json({
            status: 'fail',
            message: 'Unable to create project'
        })
    }


}



exports.allProjects = async (req, res, next) => {
    try {

    const {id} = req.user;


    const {name, sort} = req.query;

    const filterObj = {
        userId: id
    }

    if (name){
        filterObj.name = name;
    }


        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;



        let  projects = Project.find(filterObj).skip(skip).limit(limit)

        if (sort === 'asc'){
            projects.sort({createdAt: 1})
        } else if (sort === 'desc') {
            projects.sort({createdAt: -1})
        }

       projects = await projects;

        res.status(200).json({
            status: 'success',
            results: projects.length,
            page: page,
            data: {
                projects

            }
        })
    }
    catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}
