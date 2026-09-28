const express = require('express')

const router = express.Router()
const projectController = require('../controllers/projectController')
const authMiddleware = require('../middleware/auth')
const {body} = require('express-validator')
const validateMiddleware = require('../middleware/validate')


router.route('/').post(body('name').notEmpty(), validateMiddleware.validate, authMiddleware.authCheck, projectController.createProject).get(authMiddleware.authCheck, projectController.allProjects)


module.exports = router
