const express = require('express');
const { getAgents, createUser } = require('../controllers/userController');
const { authMiddleware, rbacMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(authMiddleware, rbacMiddleware(['super_admin', 'admin']), createUser);

router.route('/agents')
  .get(authMiddleware, getAgents);

module.exports = router;
