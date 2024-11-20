import React, { createContext, useContext, useState } from 'react';

// 創建 SnackbarContext
const SnackbarContext = createContext();

// 提供者組件
export const SnackbarProvider = ({ children }) => {
  const [snackbarMes, setSnackbarMes] = useState('');
  const [snackbarType, setSnackbarType] = useState('error');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const openSnackbar = (message, type = 'error',isOpen) => {
    setSnackbarMes(message);
    setSnackbarType(type);
    setSnackbarOpen(isOpen);
  };

  const closeSnackbar = (event, reason) => {
    setSnackbarOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ snackbarOpen, snackbarMes, snackbarType, closeSnackbar, openSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

// 使用自定義 hook 來讀取 context
export const useSnackbar = () => useContext(SnackbarContext);