const prisma = require('../config/db');

const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        client: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const mapped = payments.map(p => ({
      ...p,
      clientName: p.client ? `${p.client.firstName} ${p.client.lastName}` : 'Unknown'
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching payments' });
  }
};

const generatePaymentLink = async (req, res) => {
  try {
    const { clientId, packageId, amount } = req.body;
    
    const payment = await prisma.payment.create({
      data: {
        clientId,
        amount: Number(amount) || 0,
        status: 'Pending',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    // Mock link generation
    res.status(201).json({
      ...payment,
      paymentUrl: `https://checkout.stripe.mock/pay/${payment.id}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error generating payment link' });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentMethod, transactionId } = req.body;
    
    const payment = await prisma.payment.findUnique({ where: { id } });
    
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { 
        status, 
        paymentMethod, 
        transactionId,
        totalPaid: status === 'Paid' ? payment.amount : payment.totalPaid
      }
    });
    
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating payment' });
  }
};

module.exports = { getPayments, generatePaymentLink, updatePaymentStatus };
