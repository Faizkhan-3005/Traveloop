const prisma = require('../prisma')

const listNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return res.json(notifications)
  } catch (error) {
    return next(error)
  }
}

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params
    const notification = await prisma.notification.update({
      where: { id, userId: req.user.id },
      data: { read: true }
    })
    return res.json(notification)
  } catch (error) {
    return next(error)
  }
}

const markAllAsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true }
    })
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.notification.delete({
      where: { id, userId: req.user.id }
    })
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

module.exports = { listNotifications, markAsRead, markAllAsRead, deleteNotification }
