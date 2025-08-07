import { create } from 'zustand';
import { mockInvoices, generateInvoiceNumber } from '../data/mockInvoices.js';
import { InvoiceStatus } from '../types/invoice.js';

export const useInvoiceStore = create((set, get) => ({
  // State
  invoices: mockInvoices,
  filteredInvoices: mockInvoices,
  filters: {
    status: '',
    dateFrom: '',
    dateTo: '',
    customerName: ''
  },
  isModalOpen: false,
  loading: false,
  error: null,

  // Actions
  setInvoices: (invoices) => set({ invoices }),
  
  setFilters: (newFilters) => set((state) => {
    const updatedFilters = { ...state.filters, ...newFilters };
    const filteredInvoices = filterInvoices(state.invoices, updatedFilters);
    return {
      filters: updatedFilters,
      filteredInvoices
    };
  }),

  clearFilters: () => set((state) => ({
    filters: {
      status: '',
      dateFrom: '',
      dateTo: '',
      customerName: ''
    },
    filteredInvoices: state.invoices
  })),

  addInvoice: (invoiceData) => set((state) => {
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(state.invoices),
      ...invoiceData,
      amount: parseFloat(invoiceData.amount)
    };
    
    const updatedInvoices = [...state.invoices, newInvoice];
    const filteredInvoices = filterInvoices(updatedInvoices, state.filters);
    
    // Emit custom event for notifications
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('invoice-added', { 
        detail: { invoice: newInvoice } 
      }));
    }, 0);
    
    return {
      invoices: updatedInvoices,
      filteredInvoices,
      isModalOpen: false
    };
  }),

  updateInvoice: (id, invoiceData) => set((state) => {
    const updatedInvoices = state.invoices.map(invoice =>
      invoice.id === id ? { ...invoice, ...invoiceData } : invoice
    );
    const filteredInvoices = filterInvoices(updatedInvoices, state.filters);
    
    return {
      invoices: updatedInvoices,
      filteredInvoices
    };
  }),

  deleteInvoice: (id) => set((state) => {
    const updatedInvoices = state.invoices.filter(invoice => invoice.id !== id);
    const filteredInvoices = filterInvoices(updatedInvoices, state.filters);
    
    return {
      invoices: updatedInvoices,
      filteredInvoices
    };
  }),

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Initialize filtered invoices on first load
  initialize: () => set((state) => {
    const filteredInvoices = filterInvoices(state.invoices, state.filters);
    
    // Only update if different to prevent unnecessary re-renders
    if (JSON.stringify(filteredInvoices) !== JSON.stringify(state.filteredInvoices)) {
      return { filteredInvoices };
    }
    
    return state; // Return same state if no changes
  })
}));

// Helper function to filter invoices
const filterInvoices = (invoices, filters) => {
  return invoices.filter(invoice => {
    // Status filter
    if (filters.status && invoice.status !== filters.status) {
      return false;
    }

    // Customer name filter
    if (filters.customerName && 
        !invoice.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom && new Date(invoice.date) < new Date(filters.dateFrom)) {
      return false;
    }

    if (filters.dateTo && new Date(invoice.date) > new Date(filters.dateTo)) {
      return false;
    }

    return true;
  });
};

// Selectors for computed values
export const useInvoiceStats = () => {
  const invoices = useInvoiceStore(state => state.invoices);
  
  return {
    total: invoices.length,
    paid: invoices.filter(invoice => invoice.status === InvoiceStatus.PAID).length,
    pending: invoices.filter(invoice => invoice.status === InvoiceStatus.PENDING).length,
    totalAmount: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    paidAmount: invoices
      .filter(invoice => invoice.status === InvoiceStatus.PAID)
      .reduce((sum, invoice) => sum + invoice.amount, 0),
    pendingAmount: invoices
      .filter(invoice => invoice.status === InvoiceStatus.PENDING)
      .reduce((sum, invoice) => sum + invoice.amount, 0)
  };
};