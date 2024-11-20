import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';  //提示訊息
import { useConfirm } from '../context/ConfirmContext';

//const Confirm = ({ dialogType='', dialogOpen = false, setDialogOpen, deleteAlbum, deletePhoto, logout }) => {
const Confirm = ({ deleteAlbum, deletePhoto, logout }) => {
  //console.log(dialogOpen)
  const { dialogType, dialogOpen, openDialog } = useConfirm();
  return (
    <>
    {dialogType=='deleteAlbum' && (
        <Dialog open={dialogOpen} onClose={() => openDialog('',false)}>
        <DialogTitle>刪除不可復原</DialogTitle>
        <DialogContent>
          <DialogContentText>確定要刪除相簿嗎?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => openDialog('',false)} color="primary">取消</Button>
          <Button onClick={deleteAlbum} color="error" autoFocus>確定</Button>
        </DialogActions>
        </Dialog>
      )
    }
     {dialogType=='deletePhoto' && (
        <Dialog open={dialogOpen} onClose={() => openDialog('',false)}>
        <DialogTitle>刪除不可復原</DialogTitle>
        <DialogContent>
          <DialogContentText>確定要刪除圖片嗎?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => openDialog('',false)} color="primary">取消</Button>
          <Button onClick={deletePhoto} color="error" autoFocus>確定</Button>
        </DialogActions>
        </Dialog>
      )
    }
    {dialogType=='logout' && (
        <Dialog open={dialogOpen} onClose={() => openDialog('',false)}>
        <DialogTitle>帳號登出</DialogTitle>
        <DialogContent>
          <DialogContentText>確定要登出嗎?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => openDialog('',false)} color="primary">取消</Button>
          <Button onClick={logout} color="error" autoFocus>確定</Button>
        </DialogActions>
        </Dialog>
      )
    }

    </>
  );
};

export default Confirm;