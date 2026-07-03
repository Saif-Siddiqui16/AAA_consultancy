const express = require('express');
const { getCustomizationSettings, getLeadStages } = require('../controllers/settingsController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/customization')
  .get(authMiddleware, getCustomizationSettings);

router.route('/lead-stages')
  .get(authMiddleware, getLeadStages);

module.exports = router;
