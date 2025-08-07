// Invoice status enum
export const InvoiceStatus = {
  PAID: 'Pagada',
  PENDING: 'Pendiente'
};

// Export a simple validation function for invoice objects
export const validateInvoice = (invoice) => {
  return {
    invoiceNumber: invoice.invoiceNumber && invoice.invoiceNumber.trim().length > 0,
    customerName: invoice.customerName && invoice.customerName.trim().length > 0,
    date: invoice.date && !isNaN(new Date(invoice.date)),
    amount: invoice.amount && !isNaN(parseFloat(invoice.amount)) && parseFloat(invoice.amount) > 0,
    status: invoice.status && Object.values(InvoiceStatus).includes(invoice.status)
  };
};

// Helper function to check if invoice is valid
export const isValidInvoice = (invoice) => {
  const validation = validateInvoice(invoice);
  return Object.values(validation).every(Boolean);
};