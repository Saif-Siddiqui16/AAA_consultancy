import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

export const SaaSInvoiceReceiptDialog = ({ open, onClose, invoice }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === 'Paid' || invoice.status === 'Active';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1.5,
          position: 'relative',
          overflow: 'hidden',
          '@media print': {
            boxShadow: 'none',
            border: 'none',
            p: 0,
            m: 0,
          }
        }
      }}
    >
      {/* Close Button (Hidden during print) */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'text.secondary',
          '@media print': { display: 'none' }
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Print Target Content */}
      <DialogContent id="saas-invoice-print-area" sx={{ pt: 3 }}>
        {/* Invoice Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#00205B', letterSpacing: '-0.5px' }}>
              AAA BUSINESS CONSULTANCY
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
              SaaS CRM License Division
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.72rem' }}>
              FZC LLC, Dubai, United Arab Emirates
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
              RECEIPT
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
              {invoice.id}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5, borderStyle: 'dashed' }} />

        {/* Billed To / Meta Details */}
        <Box className="grid grid-cols-12 gap-3 mb-4">
          <Box className="col-span-6">
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
              BILLED TO:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {invoice.agencyName || 'Partner Agency Admin'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {invoice.email}
            </Typography>
            {invoice.phone && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {invoice.phone}
              </Typography>
            )}
          </Box>

          <Box className="col-span-6" sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
              TRANSACTION METADATA:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              <b>Issue Date:</b> {invoice.date}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              <b>Payment Type:</b> {invoice.gateway || 'Stripe Gateway'}
            </Typography>
          </Box>
        </Box>

        {/* Itemized Payout Breakdown */}
        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'background.neutral' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', color: '#00205B' }}>Item Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.72rem', color: '#00205B' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    SaaS License Subscription - {invoice.planName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    30-Day seat license provisioning validity period.
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  €{invoice.amount}.00
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Subtotal</Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none', fontWeight: 600, color: 'text.secondary' }}>
                  €{invoice.amount}.00
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>VAT / Local Taxes (0%)</Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none', fontWeight: 600, color: 'text.secondary' }}>
                  €0.00
                </TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: 'rgba(20, 184, 166, 0.04)' }}>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#00205B' }}>Total Paid Amount</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#00205B' }}>
                    €{invoice.amount}.00
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dynamic Watermark / Status Stamp */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2.5 }}>
          <Box
            sx={{
              border: '3px solid',
              borderColor: isPaid ? '#10B981' : '#F59E0B',
              color: isPaid ? '#10B981' : '#F59E0B',
              borderRadius: 2,
              px: 3,
              py: 0.8,
              transform: 'rotate(-4deg)',
              fontWeight: 900,
              fontSize: '1.25rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              opacity: 0.85,
              textAlign: 'center'
            }}
          >
            {isPaid ? '✓ PAID' : '⚠ PENDING'}
          </Box>
        </Box>

        {/* Footer info details */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
            Thank you for licensing our partner agency CRM platform workspace!
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.62rem', mt: 0.5 }}>
            This is a system generated transaction receipt receipt of purchase.
          </Typography>
        </Box>
      </DialogContent>

      {/* Action Buttons (Hidden during print) */}
      <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid', borderColor: 'divider', '@media print': { display: 'none' } }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ fontWeight: 700 }}
        >
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaaSInvoiceReceiptDialog;
