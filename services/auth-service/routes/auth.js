const express = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')
const {body} = require('express-validator')
const validateMiddleware = require('../middleware/validate')

const router = express.Router();



router.route('/register').post(body('email').isEmail(), body('password').isLength({min: 6}), validateMiddleware.validate, authController.register)

router.route('/login').post(body('email').isEmail(), body('password').isLength({min: 6}), validateMiddleware.validate, authController.login)

router.route('/me').get(authMiddleware.authCheck, authController.me)

module.exports = router
