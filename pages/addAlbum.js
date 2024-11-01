import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { HiLibrary, HiPlus, HiOutlineLogout, HiReply } from "react-icons/hi";   
import SnackbarAlert from '../components/SnackbarAlert'   //提示訊息 
import Confirm from '../components/Confirm'               //確認對話框
import { verifyToken } from '../utils/token';             //驗證token

export default function AddAlbum() {
  const [albumName, setAlbumName] = useState('');
  const [albumDate, setAlbumDate] = useState('');
  const [albumPlace, setAlbumPlace] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [photos, setPhotos] = useState([]);
  const router = useRouter();
  const isHomepage = router.pathname === '/';  //判斷是否為首頁路徑
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMes, setSnackbarMes] = useState('');
  const [snackbarType, setSnackbarType] = useState('error');
  const [dialogOpen, setDialogOpen] = useState(false); //dialog開關
  const [dialogType, setDialogType] = useState('');    //儲存確認框的類型(刪除deleteAlbum、deletePhoto 或 登出logout)
  const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server';

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


  const addAlbumSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    //加相簿各資訊、圖片給 formData
    formData.append('album_name', albumName);
    formData.append('album_date', albumDate);
    formData.append('album_place', albumPlace);
    formData.append('album_desc', albumDesc);
    photos.forEach((eachPhoto, index) => {
      formData.append(`up_photo[]`, eachPhoto);
    });
 
    //測試
    // for(let key of formData.keys()){
    //   console.log(key);  
    // }
    // for(let value of formData.values()){
    //   console.log(value);  
    // }
    // for(let entry of formData.entries()) {
    //   console.log(entry[0], entry[1]); 
    // }

    try {
      //const response = await axios.post('http://localhost/album_nextjs/server/addAlbum.php', formData, {
      const response = await axios.post(`${serverApiUrl}/addAlbum.php`, formData, {
        // 已經使用 FormData，不需要額外在 axios.post 指定 headers: { 'Content-Type': 'multipart/form-data' }，因為 axios 會自動根據 FormData 類型來設定正確的 Content-Type
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      });
      if (response.data.success) {
        router.push('/album_manage');
      } else {
        //alert('上傳失敗');
        //顯示訊息提示
        setSnackbarMes('上傳失敗');
        setSnackbarType('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      //alert('上傳過程中出錯');
      //顯示訊息提示
      setSnackbarMes('上傳過程中出錯');
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  //關掉Snackbar
  const closeSnackbar = (event, reason) => {
    setSnackbarOpen(false);
  };


  //多檔案上傳
  const fileUpload = (e) => {
    //Array.from  將 FileList 物件（e.target.files）轉為真正的陣列(原本是物件)，以便後續可以更方便地操作檔案
    setPhotos(Array.from(e.target.files));
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
  

  return (
    <div className="container mx-auto px-4 w-full md:w-[70%] h-screen flex flex-col">
      <Head>
        <title>繽紛生活-新增相簿</title>
        <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Rita Chen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        {/* Facebook、LinkedIn分享時的預覽效果 */}
        <meta property="og:title" content="繽紛生活-新增相簿" />
        <meta property="og:description" content="使用Next.js與PHP進行全端開發實作，提供用戶相簿與照片管理功能" />
        <meta property="og:image" content="https://albums-front-b62f334991df.herokuapp.com/images/og_image.png" />
        <meta property="og:url" content="https://albums-front-b62f334991df.herokuapp.com/" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="h-[2%] sm:h-1/6"></div>
      {/* 網站標題與按鈕 */}
      <div className="A flex flex-col sm:flex-row justify-between items-center max-h-max sm:max-h-none sm:h-1/6">
        <div className="mb-4 flex justify-center sm:justify-start sm:mb-7 sm:flex-start">
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
        <div className="flex justify-center space-x-4">
          { !isHomepage && (
            <div className="bg-[#f29b6c] hover:bg-orange-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]">  
              <Link href="/" className="text-white flex items-center justify-center"><HiLibrary className='mr-1'/>回到首頁</Link>
            </div>
          ) }
          <div onClick={openLogoutDialog} className="bg-[#8bbae5] hover:bg-sky-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
            <div className="text-white flex items-center justify-center"><HiOutlineLogout className='mr-1'/>登出系統</div>
          </div>
        </div>
      </div>
      {/* 頁面簡述與分隔線 */}
      <div className="B flex justify-center items-center text-teal-600 my-6 sm:my-4">
        <div className="text-left font-semibold text-rose-900 text-xl sm:text-3xl sm:ml-6 flex items-center justify-center pr-1"><HiPlus className='mr-1'/>新增相簿頁面</div>
      </div>
      <hr className="hidden sm:block h-px bg-gray-700 border-2 sm:mt-8 sm:mb-12"></hr>
      {/* 主要內容 */}
      <div className="C justify-center mx-auto w-full h-[29rem] sm:pt-0 overflow-y-scroll overflow-x-hidden sm:h-auto sm:overflow-visible">
        <form onSubmit={addAlbumSubmit} encType="multipart/form-data">
          <div className="flex items-center mb-4 text-xl">
            <label className="w-[4rem] pr-4">名稱:</label>
            <input
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              required
              maxLength={50}  //字數
              className="flex-grow border border-gray-300 p-1 sm:p-2 rounded-md bg-gray-200 min-w-0" 
            />
          </div>
          <div className="flex items-center mb-4 text-xl">
            <label className="w-[4rem] pr-4">時間:</label>
            <input
              type="text"
              value={albumDate}
              onChange={(e) => setAlbumDate(e.target.value)}
              maxLength={50}  //字數
              className="flex-grow border border-gray-300 p-1 sm:p-2 rounded-md bg-gray-200 min-w-0" 
            />
          </div>
          <div className="flex items-center mb-4 text-xl">
            <label className="w-[4rem] pr-4">地點:</label>
            <input
              type="text"
              value={albumPlace}
              onChange={(e) => setAlbumPlace(e.target.value)}
              maxLength={100}  //字數
              className="flex-grow border border-gray-300 p-1 sm:p-2 rounded-md bg-gray-200 min-w-0" 
            />
          </div>
          <div className="flex items-center mb-4 text-xl">
            <label className="w-[4rem] pr-4">說明:</label>
            <textarea
              value={albumDesc}
              onChange={(e) => setAlbumDesc(e.target.value)}
              maxLength={500}  //字數
              className="flex-grow border border-gray-300 p-1 sm:p-2 rounded-md bg-gray-200 min-w-0" 
            />
          </div>
          <div className="flex items-center mb-4 text-xl">
            <label className="w-[4rem] pr-4">照片:</label>
            <input
              type="file"
              multiple
              onChange={fileUpload}
              className="flex-gro p-1 sm:p-2 rounded-md min-w-64 w-[16rem]"
            />
          </div>
          <div className="flex items-center justify-center text-rose-900 text-base sm:text-xl mb-3 sm:mb-5">可以一次傳多個圖片，每張圖片大小不得超過10MB，上傳檔案類型僅為jpg、jpeg、png、gif </div>
          <div className="text-center">
            <div className="flex justify-center space-x-4">
              <div className="relative inline-block">
                <HiPlus className="fas fa-user absolute left-3 sm:left-5 top-[0.65rem] sm:top-[0.7rem] text-white text-lg sm:text-2xl" />
                <input type="submit" name="submit" value="新增相簿" className="bg-rose-900 hover:bg-rose-700 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 pl-6 font-semibold text-lg sm:text-2xl text-center text-white" />
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