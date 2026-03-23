const express = require('express');
const router = express.Router();
const { getDocuments, addDocument, updateDocument, deleteDocument, testReminder } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getDocuments)
  .post(protect, addDocument);

router.post('/test-reminder/:id', protect, testReminder);

router.route('/:id')
  .put(protect, updateDocument)
  .delete(protect, deleteDocument);

module.exports = router;
