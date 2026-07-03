const bcrypt = require('bcrypt');
const prisma = require('../config/db');

// @desc    Get all users (agents)
// @route   GET /api/v1/users/agents
// @access  Private (Admin/Super Admin)
const getAgents = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        hotlineNumber: true,
        spokenLanguages: true,
        nationalities: true,
        commissionRate: true,
        immigrationBio: true,
        customPermissions: true,
        createdAt: true
      }
    });
    // Add virtual fields for frontend mapping
    const mappedAgents = agents.map(a => ({
      ...a,
      name: a.fullName,
      casesCount: 0,
      avatar: 'https://i.pravatar.cc/150?u=' + a.id
    }));
    res.json(mappedAgents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new user (agent)
// @route   POST /api/v1/users
// @access  Private (Super Admin)
const createUser = async (req, res) => {
  try {
    const {
      fullName, email, password, hotlineNumber, role,
      spokenLanguages, nationalities, commissionRate, immigrationBio, customPermissions
    } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        hotlineNumber,
        role: role || 'consultant',
        spokenLanguages,
        nationalities,
        commissionRate: Number(commissionRate) || 0,
        immigrationBio,
        customPermissions
      }
    });

    res.status(201).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAgents, createUser };
