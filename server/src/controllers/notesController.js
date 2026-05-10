const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllNotes = async (req, res, next) => {
  try {
    const notes = await prisma.tripNote.findMany({
      where: { ownerId: req.user.id },
      include: { trip: true },
      orderBy: [
        { pinned: 'desc' },
        { updatedAt: 'desc' }
      ]
    })
    return res.json(notes)
  } catch (error) {
    return next(error)
  }
}

const createNote = async (req, res, next) => {
  try {
    const { title, content, tripId, tags, pinned, favorite } = req.body
    const note = await prisma.tripNote.create({
      data: {
        title: title || 'Untitled Note',
        content: content || '',
        ownerId: req.user.id,
        tripId: tripId || null,
        tags: tags || [],
        pinned: pinned || false,
        favorite: favorite || false
      },
      include: { trip: true }
    })
    return res.status(201).json(note)
  } catch (error) {
    return next(error)
  }
}

const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, content, tags, pinned, favorite, tripId } = req.body
    
    // Check ownership
    const existing = await prisma.tripNote.findFirst({ where: { id, ownerId: req.user.id } })
    if (!existing) return res.status(404).json({ message: 'Note not found' })

    const updated = await prisma.tripNote.update({
      where: { id },
      data: { 
        title, 
        content, 
        tags, 
        pinned, 
        favorite,
        tripId: tripId || null
      },
      include: { trip: true }
    })
    return res.json(updated)
  } catch (error) {
    return next(error)
  }
}

const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params
    const existing = await prisma.tripNote.findFirst({ where: { id, ownerId: req.user.id } })
    if (!existing) return res.status(404).json({ message: 'Note not found' })

    await prisma.tripNote.delete({ where: { id } })
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote
}
