import { useState } from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image'
import Head from 'next/head';
import { HiLibrary, HiCog, HiOutlineCheck  } from "react-icons/hi";    
import SnackbarAlert from '../components/SnackbarAlert'   //提示訊息


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 
  const isHomepage = router.pathname === '/';  
  const [errors, setErrors] = useState({});  //表單錯誤驗證
  const [snackbarOpen, setSnackbarOpen] = useState(false); //Snackbar開關 
  const [snackbarMes, setSnackbarMes] = useState(''); //Snackbar訊息
  const [snackbarType, setSnackbarType] = useState('error'); //Snackbar類型

  const formSubmit = async (event) => {
    event.preventDefault();

    //重置表單錯誤狀態
    setErrors({});
    //驗證輸入
    const newErrors = {};
    if (!username) newErrors.username = '請輸入帳號預設值';
    if (!password) newErrors.password = '請輸入密碼預設值';

    // 有錯誤就返回
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.data.success) {
         //成功登入後，會將 token 儲存到 localStorage，每次發送請求時可以取出並放到請求的Authorization標頭中
        localStorage.setItem('token', response.data.token);
        window.location.href = '/album_manage';
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        //alert('帳號密碼錯誤，請重新登入');
        setSnackbarMes('帳號密碼錯誤，請重新登入');
      } else {
        //alert('網路錯誤，請稍後再試');
        setSnackbarMes('網路錯誤，請稍後再試');
      }
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  //關掉Snackbar
  const closeSnackbar = (event, reason) => {
    //當使用者點擊背景會觸發clickaway，下面是不允許點擊背景來關閉snackbar
    // if (reason === 'clickaway') {
    //   return;
    // }
    setSnackbarOpen(false);
  };

  return (
    <div className="container mx-auto px-4 w-full md:w-[70%] h-screen flex flex-col">
      <Head>
        <title>繽紛生活-管理登入</title>
        <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Rita Chen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        {/* Facebook、LinkedIn分享時的預覽效果 */}
        <meta property="og:title" content="繽紛生活-管理登入" />
        <meta property="og:description" content="使用Next.js與PHP進行全端開發實作，提供用戶相簿與照片管理功能" />
        <meta property="og:image" content="https://albums-front-b62f334991df.herokuapp.com/images/og_image.png" />
        <meta property="og:url" content="https://albums-front-b62f334991df.herokuapp.com/" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="h-[2%] sm:h-1/6"></div>
      {/* 網站標題與按鈕 */}
      <div className="A flex flex-col sm:flex-row justify-between items-center max-h-max sm:max-h-none sm:h-1/6">
        <div className="mb-3 flex justify-center sm:justify-start sm:mb-7 sm:flex-start">
          <Image
            src="/images/title.png?v2"
            alt="Title Image"
            width={420}
            height={113}
            priority
            className='max-w-[88%] sm:max-w-[100%]'
            //style={{ width: '100%', height: 'auto' }} 
          />
        </div>
        <div className="flex justify-center space-x-4 ">
          { !isHomepage && (
            <div className="bg-[#f29b6c] hover:bg-orange-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]">  
              <Link href="/" className="text-white flex items-center justify-center"><HiLibrary className='mr-1'/>回到首頁</Link>
            </div>
          ) }
        </div>
      </div>
      {/* 頁面簡述與分隔線 */}
      <div className="B flex justify-center sm:justify-between items-center text-rose-900 my-6 sm:my-4">
        <div className="text-left font-semibold text-xl sm:text-3xl sm:ml-6 flex items-center justify-center"><HiCog className='mr-1'/>相簿管理登入</div>
      </div>
      <hr className="hidden sm:block h-px bg-gray-700 border-2 sm:mt-8 sm:mb-12"></hr>
      {/* 主要內容 */}
      <div className="C justify-center mx-auto w-full h-[25rem] overflow-y-scroll overflow-x-hidden sm:h-auto sm:overflow-visible">
        <div className="flex justify-center text-xl sm:text-2xl mt-10">
          <form onSubmit = {formSubmit}>
            <div className="mb-4 focus:border-gray-400">帳號
                <input className="ml-3 pl-1 bg-gray-200" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                {/* 表單錯誤驗證 */}
                {errors.username && <div className="text-rose-800 text-sm pl-14 sm:pl-16 leading-7">{errors.username}</div>}
            </div>
            <div className="mb-4">密碼
                <input className="ml-3 pl-1 bg-gray-200"  type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {/* 表單錯誤驗證 */}
                {errors.password && <div className="text-rose-800 text-sm pl-14 sm:pl-16 leading-7">{errors.password}</div>}
            </div>
            <div className="mb-4 text-center">預設值 : 帳號<span style={{ color: '#06F' }}>test01</span>，密碼<span style={{ color: '#06F' }}>pass1234
            </span></div>
            <div className="mb-4 text-center flex justify-center">
              <div className="relative inline-block">
                <HiOutlineCheck className="fas fa-user absolute left-8 top-2 text-white" />
                <input type="submit" name="Submit" value="登入" className="bg-rose-900 hover:bg-rose-700 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl pl-6 text-center text-white"/>
              </div>
              {/* <div className="relative inline-block">
                <HiReply className="fas fa-user absolute left-6 top-2 text-white" />
                <input type="button" name="button" value="上一頁" className="bg-[#939ba1] hover:bg-gray-300 rounded-3xl w-36 h-10 pl-6 font-semibold text-xl text-center text-white" onClick={() => window.history.back()} />
              </div> */}
            </div>
          </form>
        </div>
      </div>
      {/* snackbar提示訊息 */}
      <SnackbarAlert snackbarOpen={snackbarOpen} snackbarType={snackbarType} snackbarMes={snackbarMes} closeSnackbar={closeSnackbar}/>
      {/* <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={closeSnackbar} severity={snackbarType} variant="filled" sx={{ width: '100%' }}>
          {snackbarMes}
        </Alert>
      </Snackbar> */}
    </div>
  );
}