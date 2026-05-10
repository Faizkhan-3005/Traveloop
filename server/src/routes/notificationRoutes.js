const { Router } = require('express')
const { listNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationController')
const { requireAuth } = require('../middleware/auth')

const router = Router()

router.use(requireAuth)

router.get('/', listNotifications)
router.patch('/read-all', markAllAsRead)
router.patch('/:id/read', markAsRead)
router.delete('/:id', deleteNotification)

module.exports = router
