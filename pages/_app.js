import '../styles/global.css';  //全局 CSS 文件，會應用到整個程式中
import { SnackbarProvider } from '../context/SnackbarContext';
import { ConfirmProvider } from '../context/ConfirmContext';


// App 元件是所有頁面共用的最上層元件，使用它來保留頁面間的狀態
// 新增 pages/_app.js 時，需要停下伺服器並重新啟動伺服器 (npm run dev)
// 不能在 pages/_app.js 以外的檔案中匯入 全域性 CSS 的原因，是全域性 CSS 會影響頁面上的所有元素

export default function App({ Component, pageProps }) {
    return (
      <SnackbarProvider>
        <ConfirmProvider>
          <Component {...pageProps} />
        </ConfirmProvider>
      </SnackbarProvider>
    );
  }


