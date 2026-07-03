const express = require('express');
const { getPayments, generatePaymentLink, updatePaymentStatus } = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(authMiddleware, getPayments);

router.post('/generate-link', authMiddleware, generatePaymentLink);
router.patch('/:id/status', authMiddleware, updatePaymentStatus);

module.exports = router;
