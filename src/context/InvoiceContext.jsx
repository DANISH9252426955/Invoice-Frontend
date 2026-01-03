import React, { createContext, useContext, useReducer, useEffect } from 'react';

const InvoiceContext = createContext();

const initialState = {
  invoices: [],
  nextInvoiceNumber: 1,
  companyInfo: {
    name: 'Your Company Name',
    address: '123 Business Street',
    city: 'City, State 12345',
    phone: '(555) 123-4567',
    email: 'info@company.com'
  }
};

function invoiceReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;
    case 'ADD_INVOICE':
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
        nextInvoiceNumber: state.nextInvoiceNumber + 1
      };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(inv => 
          inv.id === action.payload.id ? action.payload : inv
        )
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(inv => inv.id !== action.payload)
      };
    case 'UPDATE_COMPANY_INFO':
      return {
        ...state,
        companyInfo: action.payload
      };
    default:
      return state;
  }
}

export function InvoiceProvider({ children }) {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('invoiceData');
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoiceData', JSON.stringify(state));
  }, [state]);

  return (
    <InvoiceContext.Provider value={{ state, dispatch }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within InvoiceProvider');
  }
  return context;
}