import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { HiLibrary, HiPlus, HiCog, HiOutlineLogout, HiReply } from "react-icons/hi";    
import SnackbarAlert from '../../components/SnackbarAlert'      //提示訊息 
import Confirm from '../../components/Confirm'                  //確認對話框
import { useSnackbar } from '../../context/SnackbarContext';       //引入 useSnackbar
import { useConfirm } from '../../context/ConfirmContext';         //引入 useConfirm
import { verifyToken } from '../../utils/token';                //驗證token
import CircularProgress from '@mui/material/CircularProgress';  //loading

export default function AddPhoto() {
  const [photos, setPhotos] = useState([]);
  const router = useRouter();
  const isHomepage = router.pathname === '/'; 
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMes, setSnackbarMes] = useState('');
  // const [snackbarType, setSnackbarType] = useState('error');
  // const [dialogOpen, setDialogOpen] = useState(false); //dialog開關
  // const [dialogType, setDialogType] = useState('');    //儲存確認框的類型(刪除deleteAlbum、deletePhoto 或 登出logout)
  const { openSnackbar } = useSnackbar();         //從 context 獲取 openSnackbar
  const { openDialog } = useConfirm();            //從 context 獲取 openDialog
  const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server';
  const [loading, setLoading] = useState(false); 

  //檢查token
  useEffect(() => {
    //統整過的token
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token || !(await verifyToken(token))) {
        //('Token無效');
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        //console.log('Token驗證成功');
        //console.log('Token驗證成功:', response.data.decoded);
      }
    };
    checkToken();
  }, [router]);

  const addPhotoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    //加圖片
    photos.forEach((eachPhoto, index) => {
      formData.append(`up_photo[]`, eachPhoto);
    });
    //加albumId
    const albumId = router.query.albumId;
    formData.append("album_id", albumId); 
 
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
      //const response = await axios.post('http://localhost/album_nextjs/server/addPhoto.php', formData, {
      const response = await axios.post(`${serverApiUrl}/addPhoto.php`, formData, {
        // 已經使用 FormData，不需要額外在 axios.post 指定 headers: { 'Content-Type': 'multipart/form-data' }，因為 axios 會自動根據 FormData 類型來設定正確的 Content-Type
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      });
   
      if (response.data.success) {
        setLoading(false);
        router.push(`/photo_manage/${router.query.albumId}`);
      } else {
        setLoading(false);
        //alert('上傳失敗');
        //顯示訊息提示
        // setSnackbarMes('上傳失敗');
        // setSnackbarType('error');
        // setSnackbarOpen(true);
        openSnackbar('上傳失敗','error',true); 
      }
    } catch (error) {
      setLoading(false);
      //console.error(error);
      //alert('上傳過程中出錯');
      //顯示訊息提示
      // setSnackbarMes('上傳過程中出錯');
      // setSnackbarType('error');
      // setSnackbarOpen(true);
      openSnackbar('上傳過程中出錯','error',true); 
    }
  };

  //關掉Snackbar
  // const closeSnackbar = (event, reason) => {
  //   setSnackbarOpen(false);
  // };

  //多檔案上傳
  const fileUpload = (e) => {
    //Array.from 將 FileList 物件（e.target.files）轉為真正的陣列(原本是物件)，以便後續更方便操作檔案
    setPhotos(Array.from(e.target.files));
  };

  //把登出確認框打開
  const openLogoutDialog = () => {
    // setDialogType('logout');
    // setDialogOpen(true);
    openDialog('logout',true);
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
        <title>繽紛生活-新增圖片</title>
        <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Rita Chen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        {/* Facebook、LinkedIn分享時的預覽效果 */}
        <meta property="og:title" content="繽紛生活-新增圖片" />
        <meta property="og:description" content="使用Next.js與PHP進行全端開發實作，提供用戶相簿與照片管理功能" />
        <meta property="og:image" content="https://albums-front-b62f334991df.herokuapp.com/images/og_image.png" />
        <meta property="og:url" content="https://albums-front-b62f334991df.herokuapp.com/" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="h-[2%] sm:h-1/6"></div>
      {/* 網站標題與按鈕 */}
      <div className="A flex flex-col sm:flex-row justify-between items-center max-h-max sm:max-h-none sm:h-1/6">
        <div className="mb-3 flex justify-center sm:justify-start sm:mb-7 sm:flex-start max-w-[88%] sm:max-w-[100%]">
          <Link href="/">
            <Image
              src="/images/title.png?v2"
              alt="Title Image"
              width={420}
              height={113}
              priority
              //style={{ width: '100%', height: 'auto' }} 
            />
          </Link>
        </div>
        <div className="flex justify-center space-x-4 ">
          { !isHomepage && (
            <div className="bg-[#f29b6c] hover:bg-orange-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]">  
              <Link href="/" className="text-white flex items-center justify-center"><HiLibrary className='mr-1'/>回到首頁</Link>
            </div>
          ) }
          <div onClick={openLogoutDialog} className="bg-[#8bbae5] hover:bg-sky-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
            <div className="text-white flex items-center justify-center"><HiOutlineLogout className='mr-1'/>登出系統</div>
          </div>
          {/* <div className="bg-[#8bbae5] hover:bg-sky-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
            <Link href={`/photo_manage/${router.query.albumId}`} className="text-white flex items-center justify-center"><HiCog className='mr-1'/>回上一頁</Link>
          </div> */}
        </div>
      </div>
      {/* 頁面簡述與分隔線 */}
      <div className="B flex justify-center items-center text-teal-600 my-6 sm:my-4">
        <div className="text-left font-semibold text-rose-900 text-xl sm:text-3xl flex items-center justify-center pr-1"><HiCog className='mr-1'/>新增圖片頁面</div>
      </div>
      <hr className="hidden sm:block h-px bg-gray-700 border-2 sm:mt-8 sm:mb-12"></hr>
      {/* 主要內容 */}
      {loading ? ( 
        <div className='flex justify-center items-center flex-col text-center font-bold text-rose-900 h-48 text-xl sm:text-2xl'>
          <div><CircularProgress size="40px" sx={{ color: '#881337' }} /></div><div>正在為您上傳相片</div>
        </div>
        )
        : (
        <form onSubmit={addPhotoSubmit} encType="multipart/form-data">
        <div className="flex flex-col items-center justify-center mb-4 text-xl text-center">
          <input
            type="file"
            multiple //允許使用者一次選擇多個檔案
            onChange={fileUpload}
            required
            className="flex-gro sm:p-2 rounded-md min-w-64 w-[16rem]"
          />
        </div>
        <div className="flex items-center justify-center text-rose-900 text-base sm:text-xl mb-8 sm:mb-10">可以一次傳多張圖片，每張圖片大小不超過5MB，總共上限為10MB，僅接受檔案類型包括 jpg、jpeg、png 和 gif。</div>
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <div className="relative inline-block">
                <HiPlus className="fas fa-user absolute left-3 sm:left-5 top-[0.65rem] sm:top-[0.7rem] text-white text-lg sm:text-2xl" />
                <input type="submit" name="submit" value="新增圖片" className="bg-rose-900 hover:bg-rose-700 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 pl-6 font-semibold text-lg sm:text-2xl text-center text-white" />
            </div>
            <div onClick={() => router.back()} className="bg-gray-400 hover:bg-gray-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem] cursor-pointer">
              <div className="text-white flex items-center justify-center">
                  <HiReply className="mr-1" />回上一頁
              </div>
            </div>
          </div>
        </div>
        </form>
        )
      }
      {/* snackbar提示訊息 */}
      <SnackbarAlert ></SnackbarAlert>
      {/* <SnackbarAlert snackbarOpen={snackbarOpen} snackbarType={snackbarType} snackbarMes={snackbarMes} closeSnackbar={closeSnackbar}/> */}
      {/* confirm dialog提示訊息 */}
      <Confirm logout={logout}/>
      {/* <Confirm dialogType={dialogType} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} logout={logout}/> */}
    </div>
  );
}