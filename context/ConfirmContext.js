import React, { createContext, useContext, useState } from 'react';

// 創建 ConfirmContext
const ConfirmContext = createContext();

// 提供者組件
export const ConfirmProvider = ({ children }) => {
//  const [snackbarMes, setSnackbarMes] = useState('');
//  const [snackbarType, setSnackbarType] = useState('error');
//  const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); //dialog開關
    const [dialogType, setDialogType] = useState('');    //儲存確認框的類型(刪除:deleteAlbum、deletePhoto 或 登出:logout)

  const openDialog = (type,isOpen) => {
    setDialogType(type);
    setDialogOpen(isOpen);
  };

  return (
    <ConfirmContext.Provider value={{ dialogOpen, dialogType, openDialog }}>
      {children}
    </ConfirmContext.Provider>
  );
};

// 使用自定義 hook 來讀取 context
export const useConfirm = () => useContext(ConfirmContext);