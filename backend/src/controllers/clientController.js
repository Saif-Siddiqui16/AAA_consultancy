const prisma = require('../config/db');

const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        assignedTo: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const mapped = clients.map(c => ({
      ...c,
      name: `${c.firstName} ${c.lastName}`,
      assignedConsultantName: c.assignedTo?.fullName
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching clients' });
  }
};

const createClient = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nationality, serviceType, assignedToId } = req.body;
    
    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        nationality,
        serviceType,
        assignedToId
      }
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating client' });
  }
};

const updateClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, visaStatus } = req.body;
    
    const data = {};
    if (status) data.status = status;
    if (visaStatus) data.visaStatus = visaStatus;
    
    const client = await prisma.client.update({
      where: { id },
      data
    });
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating client status' });
  }
};

module.exports = { getClients, createClient, updateClientStatus };
