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
  
  // Invoice detail modal state
  selectedInvoice: null,
  isInvoiceDetailOpen: false,
  payingInvoiceId: null,

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

  // Add function to check if invoice already exists
  checkInvoiceDuplicate: (invoiceNumber, customerName, date, amount) => {
    const { invoices } = get();
    return invoices.some(invoice => 
      invoice.invoiceNumber === invoiceNumber ||
      (invoice.customerName === customerName && 
       invoice.date === date && 
       Math.abs(invoice.amount - parseFloat(amount)) < 0.01)
    );
  },

  // Add function to import multiple invoices from CSV
  importInvoicesFromCSV: (csvInvoices) => set((state) => {
    const results = {
      successful: [],
      duplicates: [],
      errors: []
    };

    csvInvoices.forEach((invoiceData, index) => {
      try {
        // Check for duplicates
        const isDuplicate = state.invoices.some(existing => 
          existing.invoiceNumber === invoiceData.invoiceNumber ||
          (existing.customerName === invoiceData.customerName && 
           existing.date === invoiceData.date && 
           Math.abs(existing.amount - parseFloat(invoiceData.amount)) < 0.01)
        );

        if (isDuplicate) {
          results.duplicates.push({
            row: index + 2, // +2 because CSV starts at row 2 (after header)
            data: invoiceData,
            reason: 'Factura duplicada (mismo número o misma combinación cliente/fecha/monto)'
          });
        } else {
          // Validate required fields
          if (!invoiceData.invoiceNumber || !invoiceData.customerName || 
              !invoiceData.date || !invoiceData.amount) {
            results.errors.push({
              row: index + 2,
              data: invoiceData,
              reason: 'Campos requeridos faltantes'
            });
          } else if (isNaN(parseFloat(invoiceData.amount)) || parseFloat(invoiceData.amount) <= 0) {
            results.errors.push({
              row: index + 2,
              data: invoiceData,
              reason: 'Monto inválido'
            });
          } else if (isNaN(new Date(invoiceData.date).getTime())) {
            results.errors.push({
              row: index + 2,
              data: invoiceData,
              reason: 'Fecha inválida'
            });
          } else {
            // Valid invoice, add to successful list
            const newInvoice = {
              id: (Date.now() + index).toString(),
              invoiceNumber: invoiceData.invoiceNumber,
              customerName: invoiceData.customerName,
              date: invoiceData.date,
              amount: parseFloat(invoiceData.amount),
              status: invoiceData.status || 'Pendiente'
            };
            results.successful.push(newInvoice);
          }
        }
      } catch (error) {
        results.errors.push({
          row: index + 2,
          data: invoiceData,
          reason: `Error de procesamiento: ${error.message}`
        });
      }
    });

    // Add only successful invoices
    const updatedInvoices = [...state.invoices, ...results.successful];
    const filteredInvoices = filterInvoices(updatedInvoices, state.filters);

    // Emit custom event for notifications with results
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('csv-import-completed', { 
        detail: { results } 
      }));
    }, 0);

    return {
      invoices: updatedInvoices,
      filteredInvoices
    };
  }),

  updateInvoice: (id, invoiceData) => set((state) => {
    const updatedInvoices = state.invoices.map(invoice =>
      invoice.id === id ? { ...invoice, ...invoiceData } : invoice
    );
    const filteredInvoices = filterInvoices(updatedInvoices, state.filters);
    
    // Update selectedInvoice if it's the same invoice being updated
    const updatedSelectedInvoice = state.selectedInvoice && state.selectedInvoice.id === id 
      ? { ...state.selectedInvoice, ...invoiceData }
      : state.selectedInvoice;
    
    return {
      invoices: updatedInvoices,
      filteredInvoices,
      selectedInvoice: updatedSelectedInvoice
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

  // Invoice detail modal actions
  openInvoiceDetail: (invoice) => set({ 
    selectedInvoice: invoice, 
    isInvoiceDetailOpen: true 
  }),
  closeInvoiceDetail: () => set({ 
    selectedInvoice: null, 
    isInvoiceDetailOpen: false 
  }),
  setPayingInvoiceId: (id) => set({ payingInvoiceId: id }),

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