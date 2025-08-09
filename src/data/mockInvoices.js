import { InvoiceStatus } from '../types/invoice.js';

// Mock invoice data - Updated with recent dates (August 2025)
export const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    customerName: 'Empresa ABC S.A.',
    date: '2025-08-01',
    amount: 1250.50,
    status: InvoiceStatus.PAID
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    customerName: 'Comercial XYZ Ltda.',
    date: '2025-08-02',
    amount: 2890.00,
    status: InvoiceStatus.PENDING
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-003',
    customerName: 'Servicios DEF Corp.',
    date: '2025-08-03',
    amount: 750.25,
    status: InvoiceStatus.PAID
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-004',
    customerName: 'Industrias GHI S.A.S.',
    date: '2025-08-04',
    amount: 4200.00,
    status: InvoiceStatus.PENDING
  },
  {
    id: '5',
    invoiceNumber: 'INV-2025-005',
    customerName: 'Distribuciones JKL',
    date: '2025-08-05',
    amount: 1800.75,
    status: InvoiceStatus.PAID
  },
  {
    id: '6',
    invoiceNumber: 'INV-2025-006',
    customerName: 'Consultores MNO',
    date: '2025-08-06',
    amount: 950.00,
    status: InvoiceStatus.PENDING
  },
  {
    id: '7',
    invoiceNumber: 'INV-2025-007',
    customerName: 'Tecnología PQR',
    date: '2025-08-07',
    amount: 3500.25,
    status: InvoiceStatus.PAID
  },
  {
    id: '8',
    invoiceNumber: 'INV-2025-008',
    customerName: 'Logística STU',
    date: '2025-08-08',
    amount: 2150.00,
    status: InvoiceStatus.PENDING
  }
];

// Helper function to generate a new invoice number
export const generateInvoiceNumber = (existingInvoices) => {
  const year = new Date().getFullYear();
  const maxNumber = existingInvoices
    .map(invoice => {
      const match = invoice.invoiceNumber.match(/INV-\d{4}-(\d{3})/);
      return match ? parseInt(match[1]) : 0;
    })
    .reduce((max, current) => Math.max(max, current), 0);
  
  return `INV-${year}-${String(maxNumber + 1).padStart(3, '0')}`;
};