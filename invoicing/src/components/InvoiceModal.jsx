import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CAlert,
  CSpinner
} from '@coreui/react';
import { cilSave, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useInvoiceStore } from '../stores/invoiceStore.js';
import { InvoiceStatus } from '../types/invoice.js';

// Validation schema with Yup
const validationSchema = Yup.object({
  customerName: Yup.string()
    .required('El nombre del cliente es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  date: Yup.date()
    .required('La fecha es obligatoria')
    .max(new Date(), 'La fecha no puede ser futura'),
  amount: Yup.number()
    .required('El monto es obligatorio')
    .positive('El monto debe ser mayor que 0')
    .min(0.01, 'El monto mínimo es $0.01')
    .max(999999.99, 'El monto máximo es $999,999.99'),
  status: Yup.string()
    .required('El estado es obligatorio')
    .oneOf(Object.values(InvoiceStatus), 'Estado inválido')
});

const InvoiceModal = () => {
  const { isModalOpen, closeModal, addInvoice, loading } = useInvoiceStore();

  // Initial form values
  const initialValues = {
    customerName: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    amount: '',
    status: InvoiceStatus.PENDING
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await addInvoice(values);
      resetForm();
      closeModal();
      
      // Success notification would be handled by the parent component
      console.log('Invoice created successfully');
    } catch (error) {
      console.error('Error creating invoice:', error);
      setFieldError('submit', 'Error al crear la factura. Por favor intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CModal
      visible={isModalOpen}
      onClose={closeModal}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldValue
        }) => (
          <Form>
            <CModalHeader>
              <CModalTitle>Nueva Factura</CModalTitle>
            </CModalHeader>

            <CModalBody>
              {errors.submit && (
                <CAlert color="danger" className="mb-4">
                  {errors.submit}
                </CAlert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Name Field */}
                <div className="md:col-span-2">
                  <CFormLabel htmlFor="customerName">
                    Nombre del Cliente <span className="text-red-500">*</span>
                  </CFormLabel>
                  <CFormInput
                    id="customerName"
                    name="customerName"
                    type="text"
                    placeholder="Ej: Empresa ABC S.A."
                    value={values.customerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.customerName && errors.customerName)}
                    className={`mt-1 ${
                      touched.customerName && errors.customerName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {touched.customerName && errors.customerName && (
                    <div className="mt-1 text-sm text-red-600">{errors.customerName}</div>
                  )}
                </div>

                {/* Date Field */}
                <div>
                  <CFormLabel htmlFor="date">
                    Fecha <span className="text-red-500">*</span>
                  </CFormLabel>
                  <CFormInput
                    id="date"
                    name="date"
                    type="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.date && errors.date)}
                    className={`mt-1 ${
                      touched.date && errors.date 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {touched.date && errors.date && (
                    <div className="mt-1 text-sm text-red-600">{errors.date}</div>
                  )}
                </div>

                {/* Amount Field */}
                <div>
                  <CFormLabel htmlFor="amount">
                    Monto (USD) <span className="text-red-500">*</span>
                  </CFormLabel>
                  <CFormInput
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.amount && errors.amount)}
                    className={`mt-1 ${
                      touched.amount && errors.amount 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {touched.amount && errors.amount && (
                    <div className="mt-1 text-sm text-red-600">{errors.amount}</div>
                  )}
                </div>

                {/* Status Field */}
                <div className="md:col-span-2">
                  <CFormLabel htmlFor="status">
                    Estado <span className="text-red-500">*</span>
                  </CFormLabel>
                  <CFormSelect
                    id="status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.status && errors.status)}
                    className={`mt-1 ${
                      touched.status && errors.status 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  >
                    <option value={InvoiceStatus.PENDING}>Pendiente</option>
                    <option value={InvoiceStatus.PAID}>Pagada</option>
                  </CFormSelect>
                  {touched.status && errors.status && (
                    <div className="mt-1 text-sm text-red-600">{errors.status}</div>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Vista Previa</h4>
                <div className="text-sm text-blue-700">
                  <p><strong>Cliente:</strong> {values.customerName || 'No especificado'}</p>
                  <p><strong>Fecha:</strong> {values.date ? new Date(values.date).toLocaleDateString('es-ES') : 'No especificada'}</p>
                  <p><strong>Monto:</strong> {values.amount ? `$${parseFloat(values.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}</p>
                  <p><strong>Estado:</strong> {values.status}</p>
                </div>
              </div>
            </CModalBody>

            <CModalFooter>
              <CButton
                color="secondary"
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                <CIcon icon={cilX} size="sm" className="me-1" />
                Cancelar
              </CButton>
              <CButton
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CSpinner size="sm" className="me-1" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} size="sm" className="me-1" />
                    Crear Factura
                  </>
                )}
              </CButton>
            </CModalFooter>
          </Form>
        )}
      </Formik>
    </CModal>
  );
};

export default InvoiceModal;