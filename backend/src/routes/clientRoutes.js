const express = require('express');
const { getClients, createClient, updateClientStatus } = require('../controllers/clientController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(authMiddleware, getClients)
  .post(authMiddleware, createClient);

router.patch('/:id/status', authMiddleware, updateClientStatus);

module.exports = router;
