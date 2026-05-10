const prisma = require('../prisma')

const createNotification = async ({ userId, title, message, type = 'info' }) => {
  try {
    return await prisma.notification.create({
      data: { userId, title, message, type }
    })
  } catch (error) {
    console.error('[NOTIFICATION_CREATE_ERROR]', error)
  }
}

module.exports = { createNotification }
