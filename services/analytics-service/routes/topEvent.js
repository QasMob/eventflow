const express = require('express')

const analyticsController = require('../controllers/analyticsController')

const router = express.Router()


router.route('/top-events').get(analyticsController.topEvents)

router.route('/dau').get(analyticsController.dailyActiveUsers)


router.route('/mau').get(analyticsController.monthlyActiveUsers)

router.route('/funnel-analytics').get(analyticsController.funnelAnalytics)


router.route('/retention').get(analyticsController.retention)

module.exports = router
