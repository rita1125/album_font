import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { HiCog, HiOutlineLogout, HiReply, HiPencil, HiCheck } from "react-icons/hi";    
import SnackbarAlert from '../../components/SnackbarAlert'   //提示訊息 
import Confirm from '../../components/Confirm'               //確認對話框
import { verifyToken } from '../../utils/token';             //驗證token

export default function AlbumUpdate() {
  const router = useRouter(); 
  const isHomepage = router.pathname === '/';  
  const { albumId } = router.query;
  const [album, setAlbum] = useState({
    album_name: '',
    album_date: '',
    album_place: '',
    album_desc: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMes, setSnackbarMes] = useState('');
  const [snackbarType, setSnackbarType] = useState('error');
  const [dialogOpen, setDialogOpen] = useState(false);  //dialog開關
  const [dialogType, setDialogType] = useState('');     //儲存確認框的類型(刪除deleteAlbum、deletePhoto 或 登出logout)
  const frontApiUrl = process.env.NEXT_PUBLIC_FRONT_API_URL || 'http://localhost:3000';


  //檢查token
  useEffect(() => {
    //統整過的token
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token || !(await verifyToken(token))) {
        console.log('Token無效');
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        console.log('Token驗證成功');
        //console.log('Token驗證成功:', response.data.decoded);
      }
    };
    checkToken();
  }, [router]);

  //讀取相簿資料
  useEffect(() => {
    if(albumId){
      //axios.get(`http://localhost/album_nextjs/server/editalbum.php?albumId=${albumId}`)
      axios.get(`${frontApiUrl}/api/editalbum/${albumId}`)
      .then(response => 
          //console.log(response.data)
          setAlbum({
              album_name: response.data.result.album_name || '',
              album_date: response.data.result.album_date || '',
              album_place: response.data.result.album_place || '',
              album_desc: response.data.result.album_desc || '',
            })
      )
      .catch(error => {
        console.error('取資料失敗:', error);
      });
    }
  }, [albumId]);

  const updateSubmit = async (e) => {
    e.preventDefault();
    //PHP的 $_POST 陣列主要用於處理 application/x-www-form-urlencoded 和 multipart/form-data 格式的資料，而對於 Content-Type: application/json 的請求，PHP 不會自動填充 $_POST 陣列
    //當JS傳給伺服器請求的內容類型為 application/json 時，在PHP使用 file_get_contents('php://input') 來獲取原始請求資料，然後進行解碼 json_decode
    //JS使用 Content-Type: application/json 時，需要手動處理請求資料，這樣才能在 PHP 中正確獲取並使用它
    // JS:|
    // headers: {
    //   'Content-Type': 'application/json'
    // }
    //上面程式告訴伺服器，傳送的資料格式是 JSON，這樣 PHP 才會知道要使用 file_get_contents('php://input') 來讀取資料，而不是使用 $_POST
    //如果不寫這段程式，伺服器將假設傳送的資料是 URL 編碼的格式（application/x-www-form-urlencoded），而無法正確處理 JSON 格式的資料
    
    //PHP只會自動處理 application/x-www-form-urlencoded 格式的資料，或 multipart/form-data
    //直接傳送 JavaScript 對象，則 PHP 無法自動解析它
    //使用 FormData 將資料轉換為表單格式，或將物件轉換為 application/x-www-form-urlencoded 格式
    // const formData = new FormData();
    // formData.append('album_name', album.album_name);
    // formData.append('album_date', album.album_date);
    // formData.append('album_place', album.album_place);
    // formData.append('album_desc', album.album_desc);

    //使用 URLSearchParams 會自動將資料格式化為 application/x-www-form-urlencoded，這是表單提交常用的格式，並且 axios 會自動設置正確的請求投 Content-Type 為 application/x-www-form-urlencoded，不需要手動設置
    // const params = new URLSearchParams();
    // params.append('album_name', album.album_name);
    // params.append('album_date', album.album_date);
    // params.append('album_place', album.album_place);
    // params.append('album_desc', album.album_desc);

    const params = {                  //參數以物件格式傳遞到 API，在 API裡面做 URLSearchParams處理
      album_name: album.album_name,
      album_date: album.album_date,
      album_place: album.album_place,
      album_desc: album.album_desc
    };

    try {
      //const response = await axios.post(`http://localhost/album_nextjs/server/editalbum.php?albumId=${albumId}`, params);
      const response = await axios.post(`${frontApiUrl}/api/editalbum/${albumId}`, params);
      console.log(response.data);
      if (response.status === 200) {
        router.push(`/photo_manage/${albumId}`);
      }
    } catch (error) {
       //alert('更新相簿資訊失敗');
       //顯示訊息提示
       setSnackbarMes('更新相簿資訊失敗');
       setSnackbarType('error');
       setSnackbarOpen(true);
    }
  };

  //關掉Snackbar
  const closeSnackbar = (event, reason) => {
    setSnackbarOpen(false);
  };

  //把登出確認框打開
  const openLogoutDialog = () => {
      setDialogType('logout');
      setDialogOpen(true);
  };
  //登出
  const logout = () => {
      //if (confirm('確定登出嗎?')) {
      localStorage.removeItem('token'); 
      router.push('/login'); 
    //}
  };



  const alnumChange = (e) => {
    setAlbum({ ...album, [e.target.name]: e.target.value });
  };

  return (
      <div className="container mx-auto px-4 w-full md:w-[70%] h-screen flex flex-col">
        <Head>
          <title>繽紛生活-編輯相簿</title>
          <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性。" />
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
          <meta charSet="UTF-8" />
          <meta name="author" content="Rita Chen" />
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
          {/* Facebook、LinkedIn分享時的預覽效果 */}
          <meta property="og:title" content="繽紛生活-編輯相簿" />
          <meta property="og:description" content="使用Next.js與PHP進行全端開發實作，提供用戶相簿與照片管理功能" />
          <meta property="og:image" content="https://albums-front-b62f334991df.herokuapp.com/images/og_image.png" />
          <meta property="og:url" content="https://albums-front-b62f334991df.herokuapp.com/" />
          <meta property="og:type" content="website" />
        </Head>
        <div className="h-[2%] sm:h-1/6"></div>
        {/* 網站標題跟按鈕 */}
        <div className="A flex flex-col sm:flex-row justify-between items-center max-h-max sm:max-h-none sm:h-1/6">
            <div className="mb-4 flex justify-center sm:justify-start sm:mb-7 sm:flex-start">
              <Link href="/">
                <Image
                    src="/images/title.png?v2"
                    alt="Title Image"
                    width={420}
                    height={113}
                    priority
                    className='max-w-[88%] sm:max-w-[100%]'
                    //style={{ width: '100%', height: 'auto' }} 
                />
              </Link>
            </div>
            <div className="flex justify-center space-x-4">
              { !isHomepage && (
                  <div className="bg-[#f29b6c] hover:bg-orange-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]">  
                  <Link href="/album_manage" className="text-white flex items-center justify-center"><HiCog className='mr-1'/>相簿管理</Link>
                  </div>
              ) }
              <div onClick={openLogoutDialog} className="bg-[#8bbae5] hover:bg-sky-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
                <div className="text-white flex items-center justify-center"><HiOutlineLogout className='mr-1'/>登出系統</div>
              </div>
            </div>
        </div>
        {/* 頁面簡述與分隔線 */}
        <div className="B flex justify-center items-center text-teal-600 my-6 sm:my-4">
            <div className="text-left font-semibold text-rose-900 text-xl sm:text-3xl flex items-center justify-center pr-1"><HiPencil className='mr-1'/>修改相簿</div>
        </div>    
        <hr className="hidden sm:block h-px bg-gray-700 border-2 sm:mt-8 sm:mb-12"></hr>
        {/* 主要內容 */}
        <div className="C justify-center mx-auto w-full h-[29rem] sm:pt-0 overflow-y-scroll overflow-x-hidden sm:h-auto sm:overflow-visible">
          <form onSubmit={updateSubmit}>
              <div className="flex items-center mb-4 text-xl">
                  <label className="w-[4rem] pr-4">名稱:</label>
                  <input name="album_name" value={album.album_name} onChange={alnumChange} required maxLength={50} className="flex-grow border border-gray-300 p-1 sm:p-2 rounded-md bg-gray-200 min-w-0"/>
              </div>
              <div className="flex items-center mb-4 text-xl">
                  <label className="w-[4rem] pr-4">時間:</label>
                  <input name="album_date" value={album.album_date} onChange={alnumChange} maxLength={50} className="flex-grow border border-gray-300 p-1 sm:p-2 rounded-md bg-gray-200 min-w-0"/>
              </div>
              <div className="flex items-center mb-4 text-xl">
                  <label className="w-[4rem] pr-4">地點:</label>
                  <input name="album_place" value={album.album_place} onChange={alnumChange} maxLength={100} className="flex-grow border border-gray-300 p-1 sm:p-2 rounded-md bg-gray-200 min-w-0"/>
              </div>
              <div className="flex items-center mb-4 text-xl">
                  <label className="w-[4rem] pr-4">說明:</label>
                  <textarea name="album_desc" value={album.album_desc} onChange={alnumChange} maxLength={500} className="flex-grow h-32 sm:h-20 border border-gray-300 p-1 sm:p-2 rounded-md bg-gray-200 min-w-0"/>
              </div>
              <div className="text-center">
                <div className="flex justify-center space-x-4">
                  <div className="relative inline-block">
                    <HiCheck className="fas fa-user absolute left-3 sm:left-5 top-[0.65rem] sm:top-[0.7rem] text-white text-lg sm:text-2xl" />
                    <input type="submit" name="submit" value="修改相簿" className="bg-rose-900 hover:bg-rose-700 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 pl-6 font-semibold text-lg sm:text-2xl text-center text-white" />
                  </div>
                  <div onClick={() => router.back()} className="bg-gray-400 hover:bg-gray-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem] cursor-pointer">
                    <div className="text-white flex items-center justify-center">
                      <HiReply className="mr-1" />回上一頁
                    </div>
                  </div>
                </div>
              </div>
          </form>
        </div>
        {/* snackbar提示訊息 */}
        <SnackbarAlert snackbarOpen={snackbarOpen} snackbarType={snackbarType} snackbarMes={snackbarMes} closeSnackbar={closeSnackbar}/>
        {/* confirm dialog提示訊息 */}
        <Confirm dialogType={dialogType} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} logout={logout}/>
    </div>
  );
}