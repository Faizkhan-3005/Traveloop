const express = require('express')
const router = express.Router()
const { getAllNotes, createNote, updateNote, deleteNote } = require('../controllers/notesController')
const { requireAuth } = require('../middleware/auth')

router.use(requireAuth)

router.get('/', getAllNotes)
router.post('/', createNote)
router.put('/:id', updateNote)
router.delete('/:id', deleteNote)

module.exports = router
