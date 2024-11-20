// import React from 'react';
// import { Snackbar, Alert } from '@mui/material';  //提示訊息

// const SnackbarAlert = ({ snackbarOpen = false, snackbarType='error', snackbarMes='',closeSnackbar }) => {
//   return (
//     <>
//     <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
//         <Alert onClose={closeSnackbar} severity={snackbarType} variant="filled" sx={{ width: '100%' }}>
//           {snackbarMes}
//         </Alert>
//     </Snackbar>
//     </>
//   );
// };

// export default SnackbarAlert;

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbar } from '../context/SnackbarContext';

const SnackbarAlert = () => {
  const { snackbarOpen, snackbarMes, snackbarType, closeSnackbar } = useSnackbar();

  return (
    <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={closeSnackbar} severity={snackbarType} variant="filled" sx={{ width: '100%' }}>
        {snackbarMes}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;