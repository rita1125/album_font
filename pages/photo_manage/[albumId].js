import { useState, useEffect, useRef } from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import {HiTrash, HiOutlineLogout, HiReply, HiCamera, HiPencil, HiPlus } from "react-icons/hi";   
import Pagination from '../../components/Pagination';         //分頁 
import SnackbarAlert from '../../components/SnackbarAlert'    //提示訊息
import Confirm from '../../components/Confirm'                //確認對話框
import { verifyToken } from '../../utils/token';             //驗證token

// 在伺服器端抓取資料
export async function getServerSideProps(context) {
  const { albumId } = context.query;  //取得 URL 所有查詢字符串參數
  const frontApiUrl = process.env.FRONT_API_URL || 'http://localhost:3000';
  //const response = await axios.get(`http://localhost/album_nextjs/server/photos.php?albumId=${albumId}`);
  const response = await axios.get(`${frontApiUrl}/api/photo_manage/${albumId}`);
  const data = response.data.result;
  //console.log('Data:',data); 

  if (!data.thisAlbum) {
    return {
      props: {
        thisAlbum: null,
        photos: [],
      },
    };
  }

  return {
    props: {
      thisAlbum: data.thisAlbum || {},
      photos: data.photos || []
    },
  };
}

//接收兩個 props：thisAlbum 和 photos，並把 photos命名為 initialPhotos
const photoManage = ({ thisAlbum, photos: initialPhotos }) => {
  const [photos, setPhotos] = useState(initialPhotos);
  const router = useRouter();  
  const isHomepage = router.pathname === '/'; 
  const [nowPage, setNowPage] = useState(0);    //0當第1頁
  const itemsInPage = 4;   //4個為一頁
  const pageRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); //Snackbar開關 
  const [snackbarMes, setSnackbarMes] = useState(''); //Snackbar訊息
  const [snackbarType, setSnackbarType] = useState('error'); //Snackbar類型
  const [dialogOpen, setDialogOpen] = useState(false); //dialog開關
  const [dialogType, setDialogType] = useState('');    //儲存確認框的類型(刪除deleteAlbum、deletePhoto 或 登出logout)
  const [delPhotoId, setdelPhotoId] = useState(null);  //儲存要刪除的圖片ID
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

    //未統整、分開寫的token
    //發送請求到後端驗證token
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   router.push('/login'); //沒有 token就去登錄頁
    //   return;
    // }
    // axios.post('http://localhost/album_nextjs/server/token.php', { token },
    //   //Bearer Token：使用 Authorization 標頭並附加 Bearer 是 JWT 的標準做法。Bearer 是一種身份驗證方案，它告訴服務器請求中包含的 token 是用來進行身份驗證的
    //   //後端會提取請求中的 token，然後使用密鑰驗證這個 token。如果驗證成功，後端可以確認用戶的身份，並根據 token 中的資料執行相應的操作
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //   }
    // )
    // .then(response => {
    //    if (response.data.success) {
    //       console.log('Token驗證成功');
    //       //console.log('Token驗證成功:', response.data.decoded); 
    //    } else {
    //      console.log('Token無效');
    //      localStorage.removeItem('token'); // 刪除無效的 token
    //      router.push('/login'); // 重定向到登錄頁
    //    }
    // })
    // .catch(error => {
    //    console.error('驗證token發生錯誤:', error);
    //    localStorage.removeItem('token'); // 刪除無效的 token
    //    //router.push('/login'); // 重定向到登錄頁
    // });

  }, [router]);

  //把刪除圖片的確認框打開
  const openDelDialog = (photoID) => {
    setdelPhotoId(photoID);
    setDialogType('deletePhoto');
    setDialogOpen(true);
  };
  // 刪除圖片的函數
  const deletePhoto = () => {
    //console.log('photoID: '+photoID)
    //if (confirm('確定要刪除此圖片嗎?')) {
    if (delPhotoId) {
      //axios.delete('http://localhost/album_nextjs/server/photos.php', {
      axios.delete(`${serverApiUrl}/photos.php`, {
        data: { photo_id: delPhotoId }
      })
      //在 axios.delete 請求中，將資料傳送到 data 屬性中，並且資料格式為 JSON 時，理論上 不需要 手動指定 Content-Type: application/json
      // axios.delete('http://localhost/album_nextjs/server/photos.php', {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   data: { photo_id: photoID }
      // })
      .then(() => {
        //alert('圖片已刪除');
        //顯示訊息提示
        setSnackbarMes('圖片已刪除');
        setSnackbarType('success');
        setSnackbarOpen(true);

        //更新 photos 狀態，將被刪除的圖片移除
        const updatePhotos = photos.filter(photo => photo.photo_id !== delPhotoId);
        setPhotos(updatePhotos);

        //此頁面是否還有圖片，有的話把圖片物件保存在 photoInThisPage變數
        const photoInThisPage = updatePhotos.slice(nowPage * itemsInPage, (nowPage + 1) * itemsInPage);//slice(起始index，結束index前停止提取) ，slice(0,4)提取 index 0~index 3
        console.log(photoInThisPage)  
        if (photoInThisPage.length === 0 && nowPage > 0) {  //若刪除後，此頁面沒有任何圖片，就把所處頁數 - 1，重新載入前一頁的資料
          setNowPage(nowPage - 1);  //設定頁面往前一頁
        }

      })
      .catch(error => {
        console.error("刪除圖片時出錯: ", error);
      })
      .finally(() => {
        //關閉confirm對話框
        setDialogOpen(false);
        setdelPhotoId(null);
      });
    }
  };

  // 計算當前頁的資料
  const pageCount = Math.ceil(photos.length / itemsInPage);  //計算整筆資料分成幾頁
  const newPhotos = photos.slice(nowPage * itemsInPage, (nowPage + 1) * itemsInPage);  //slice(起始index，結束index前停止提取) ，slice(0,4)提取 index 0~index 3
  // 分頁
  const pageClick = (data) => {
    //console.log(data)  //{selected: 0}、{selected: 1}...
    setNowPage(data.selected);
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
    }
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
        <title>繽紛生活-圖片管理</title>
        <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Rita Chen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        {/* Facebook、LinkedIn分享時的預覽效果 */}
        <meta property="og:title" content="繽紛生活-圖片管理" />
        <meta property="og:description" content="使用Next.js與PHP進行全端開發實作，提供用戶相簿與照片管理功能" />
        <meta property="og:image" content="https://albums-front-b62f334991df.herokuapp.com/images/og_image.png" />
        <meta property="og:url" content="https://albums-front-b62f334991df.herokuapp.com/" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="h-[2%] sm:h-1/6"></div>
      {/* 網站標題跟按鈕 */}
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
        <div className="flex justify-center space-x-4">
          { !isHomepage && (
            <div className="bg-[#f29b6c] hover:bg-orange-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]">  
              <Link href="/album_manage" className="text-white flex items-center justify-center"><HiReply className='mr-1'/>回到相簿</Link>
            </div>
          ) }
          <div onClick={openLogoutDialog} className="bg-[#8bbae5] hover:bg-sky-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
            <div className="text-white flex items-center justify-center"><HiOutlineLogout className='mr-1'/>登出系統</div>
          </div>
        </div>
      </div>
      {/* 頁面簡述與分隔線 */}
      <div className="flex sm:hidden items-center justify-center text-rose-900 text-left font-semibold text-xl mt-2"><HiCamera className='mr-1'/>{thisAlbum.album_name}</div>
      <div className="B flex justify-evenly sm:justify-between items-center text-rose-900 my-2 sm:my-4">
        <div className="hidden sm:flex items-center justify-center text-left font-semibold text-xl sm:text-3xl sm:ml-6"><HiCamera className='mr-1'/>{thisAlbum.album_name}</div>
        <div className='flex flex-row space-x-4'>
          <div className=" bg-rose-900 hover:bg-rose-700 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
              <Link href={`/editalbum/${thisAlbum.album_id}`} className="text-white flex items-center justify-center"><HiPencil className='mr-1'/>修改相簿</Link>
          </div>
          <div className="bg-rose-900 hover:bg-rose-700 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
              <Link href={`/addPhoto/${thisAlbum.album_id}`} className="text-white flex items-center justify-center"><HiPlus className='mr-1'/>新增圖片</Link>
          </div>
        </div>
      </div>
      <hr className="hidden sm:block h-px bg-gray-700 border-2 sm:mt-8 sm:mb-12"></hr>
      {/* 主要內容 */}
      {/* 電腦版相簿概述 */}
      <div className='hidden sm:block sm:text-2xl leading-10 mb-4 ml-6'>
        <span className='font-bold'>拍攝日期 : </span><span className='font-bold'>{thisAlbum.album_date}</span> 
        <span className='font-bold'>，拍攝地點 : </span><span className='font-bold'>{thisAlbum.album_place}</span>
        <span className='block font-bold'>簡介 : {thisAlbum.album_desc}</span>
      </div>
      {/* 手機版相簿概述 */}
      <div className='block sm:hidden text-lg mb-2 px-8 mx-auto leading-5'>
        <div className='block font-bold'>拍攝日期 : <div className='inline-block font-bold'>{thisAlbum.album_date}</div> </div>
        <div className='block font-bold'>拍攝地點 : <div className='inline-block font-bold'>{thisAlbum.album_place}</div></div>
        <div className='block font-bold'>簡介 : {thisAlbum.album_desc}</div>
      </div>
      {/* 圖片 */}
      {photos.length === 0 ? (
        <div className='flex justify-center items-center font-bold text-rose-900 h-48 text-xl sm:text-2xl'>~此相簿沒有圖片~</div>
      ) : (
        <div ref={pageRef} className="C grid justify-center sm:grid-cols-2 md:grid-cols-4 gap-4 mx-auto w-full h-[24rem] overflow-y-scroll overflow-x-hidden sm:h-auto sm:overflow-visible">
          {newPhotos.map(photo => (
            <div key={photo.photo_id}>
              <div className="w-72 sm:w-full h-48 bg-white overflow-hidden rounded-lg mb-2">
                <img src={`/images/thumbnail/${photo.photo_file}`} alt={thisAlbum.album_name} className="w-full h-full object-cover" />
              </div>
              <p className="flex items-center justify-center text-rose-800 hover:text-rose-600 focus:text-rose-600 text-center text-lg sm:text-xl" onClick={() => openDelDialog(photo.photo_id)}>
                <HiTrash className='mr-1' /> 刪除圖片
              </p>
            </div>
          ))}
        </div>
      )}
      {/* 分頁按鈕 */}
      {photos.length === 0 ?
        <></>
        :
        <Pagination photos={photos} pageCount={pageCount} pageClick={pageClick} />
      }
       {/* snackbar提示訊息 */}
       <SnackbarAlert snackbarOpen={snackbarOpen} snackbarType={snackbarType} snackbarMes={snackbarMes} closeSnackbar={closeSnackbar}/>
      {/* confirm dialog提示訊息 */}
      <Confirm dialogType={dialogType} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} deletePhoto={deletePhoto} logout={logout}/>
    </div>
  );
};

export default photoManage;