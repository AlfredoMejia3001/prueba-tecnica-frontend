import { InvoiceStatus } from '../types/invoice.js';

// Mock invoice data
export const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerName: 'Empresa ABC S.A.',
    date: '2024-01-15',
    amount: 1250.50,
    status: InvoiceStatus.PAID
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerName: 'Comercial XYZ Ltda.',
    date: '2024-01-18',
    amount: 2890.00,
    status: InvoiceStatus.PENDING
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customerName: 'Servicios DEF Corp.',
    date: '2024-01-20',
    amount: 750.25,
    status: InvoiceStatus.PAID
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    customerName: 'Industrias GHI S.A.S.',
    date: '2024-01-22',
    amount: 4200.00,
    status: InvoiceStatus.PENDING
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    customerName: 'Distribuciones JKL',
    date: '2024-01-25',
    amount: 1800.75,
    status: InvoiceStatus.PAID
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-006',
    customerName: 'Consultores MNO',
    date: '2024-01-28',
    amount: 950.00,
    status: InvoiceStatus.PENDING
  },
  {
    id: '7',
    invoiceNumber: 'INV-2024-007',
    customerName: 'Tecnología PQR',
    date: '2024-02-01',
    amount: 3500.25,
    status: InvoiceStatus.PAID
  },
  {
    id: '8',
    invoiceNumber: 'INV-2024-008',
    customerName: 'Logística STU',
    date: '2024-02-03',
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