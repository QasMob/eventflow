const express = require('express')
const eventController = require('../controllers/eventController')
const apiMiddleware = require('../middleware/apiKeyAuth')
const {body} = require('express-validator')
const validateMiddleware = require('../middleware/validate')

const router = express.Router()



router.route('/').post(body('userId').notEmpty(), body('eventName').notEmpty(), validateMiddleware.validate, apiMiddleware.apiKeyCheck, eventController.ingestEvent).get(apiMiddleware.apiKeyCheck, eventController.getEvents)


module.exports = router
