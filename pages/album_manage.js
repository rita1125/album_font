import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { HiLibrary, HiTrash, HiPlus, HiCog, HiOutlineLogout } from "react-icons/hi";    
import Pagination from '../components/Pagination';        //分頁
import Confirm from '../components/Confirm'               //確認對話框
import SnackbarAlert from '../components/SnackbarAlert'   //提示訊息
import { verifyToken } from '../utils/token';             //驗證token
import CircularProgress from '@mui/material/CircularProgress';

const AlbumManage = () => {
  const [albums, setAlbums] = useState([]);
  const router = useRouter();  
  const isHomepage = router.pathname === '/';  
  const [nowPage, setNowPage] = useState(0);  //0當第1頁，設定當前頁面是第幾頁
  const itemsInPage = 4;   //4個為一頁
  const pageRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); //Snackbar開關 
  const [snackbarMes, setSnackbarMes] = useState(''); //Snackbar訊息
  const [snackbarType, setSnackbarType] = useState('error'); //Snackbar類型
  const [dialogOpen, setDialogOpen] = useState(false); //dialog開關
  const [dialogType, setDialogType] = useState('');    //儲存確認框的類型(刪除deleteAlbum、deletePhoto 或 登出logout)
  const [delAlbumId, setdelAlbumId] = useState(null);  //儲存要刪除的相簿ID
  const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server';
  const [loading, setLoading] = useState(true);        //loading


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
    // if (!token ) {
    //   router.push('/login'); //沒有token就去登錄頁
    //   return;
    // }
    // axios.post('http://localhost/album_nextjs/server/token.php', { token },
    //   //Bearer 是身份驗證方案，它告訴伺服器請求中的 token 是用來進行身份驗證的，使用 Authorization 標頭並附加 Bearer 是 JWT 的標準做法
    //   //後端提取請求中的 token，並用密鑰驗證這個 token。如果驗證成功，後端可以確認用戶的身份，根據token裡的資料執行相應的操作
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //   }
    // )
    // .then(response => {
    //    if (response.data.success) {
    //     console.log('Token驗證成功');
    //     //console.log('Token驗證成功:', response.data.decoded);
    //    } else {
    //     console.log('Token無效');
    //     localStorage.removeItem('token'); //刪除無效的 token
    //     router.push('/login');            //導向登錄頁
    //    }
    // })
    // .catch(error => {
    //   console.error('驗證token錯誤:', error);
    //   localStorage.removeItem('token'); //刪除無效的 token
    // });

  }, [router]);


  //獲取各相簿
  useEffect(() => {
    axios.get(`/manage`, {
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem('token')}`,
      // },
    })
      .then(res => {
        setAlbums(res.data.albums);
        //console.log(res.data.albums)
      })
      .catch(error => {
        console.error("GET manage error! ", error); 
      })
      .finally(() =>{
        setLoading(false);
      })
  }, [nowPage]);


  //把刪除相簿的確認框打開
  const openDelDialog = (albumId) => {
    setdelAlbumId(albumId);
    setDialogType('deleteAlbum');
    setDialogOpen(true);
  };
  //刪除相簿
  const deleteAlbum = () => {
    //在 axios.delete 請求中，將資料傳送到 data 屬性中，並且資料格式為 JSON 時，理論上 不需要 手動指定 Content-Type: application/json
    //if (confirm('確定要刪除此相簿嗎?')) {
    if(delAlbumId){
      //axios.delete('http://localhost/album_nextjs/server/manage.php', {
      axios.delete(`${serverApiUrl}/manage.php`, {
        data: { album_id: delAlbumId }, //將要被刪掉的 album_id包在 data中
        //當請求的內容類型為 application/json 時，PHP不會自動填$_POST 陣列，PHP需要使用 ile_get_contents("php://input") 來獲取原始請求資料，然後進行解碼json_decode()
        // headers: {
        //   'Content-Type': 'application/json'
        // }
      })
      .then(() => {
        //alert('相簿已刪除');
        //顯示訊息提示
        setSnackbarMes('相簿已刪除');
        setSnackbarType('success');
        setSnackbarOpen(true);

        //更新相簿
        const updateAlbums = albums.filter(album => album.album_id !== delAlbumId);
        setAlbums(updateAlbums);

        //此頁面是否還有相簿，有的話把相簿物件保存在 albumInThisPage變數
        const albumInThisPage = updateAlbums.slice(nowPage * itemsInPage, (nowPage + 1) * itemsInPage);//slice(起始index，結束index前停止提取) ，slice(0,4)提取 index 0~index 3
        console.log(albumInThisPage)  
        if (albumInThisPage.length === 0 && nowPage > 1) {  //若刪除後，此頁面沒有任何相簿，就把所處頁數 - 1，重新載入前一頁的資料
          setNowPage(nowPage - 1);  //設定頁面往前一頁
        }
      })
      .catch(error => console.error("刪除相簿時出錯: ", error))
      .finally(() => {
        //關閉confirm對話框
        setDialogOpen(false);
        setdelAlbumId(null);
      });
    }
  }


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
    

  // 計算當前頁的資料
  const pageCount = Math.ceil(albums.length / itemsInPage);  //計算整筆資料分成幾頁
  const newAlbums = albums.slice(nowPage * itemsInPage, (nowPage + 1) * itemsInPage);  //slice(起始index，結束index前停止提取) ，slice(0,4)提取 index 0~index 3
  // 分頁
  const pageClick = (data) => {
    //console.log(data)  //{selected: 0}、{selected: 1}...
    setNowPage(data.selected);
    //用在手機版的頁面滾動至頂部
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
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
        <title>繽紛生活-相簿管理</title>
        <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Rita Chen" />
        {/* Facebook、LinkedIn分享時的預覽效果 */}
        <meta property="og:title" content="繽紛生活-相簿管理" />
        <meta property="og:description" content="使用Next.js與PHP進行全端開發實作..." />
        <meta property="og:image" content="https://yourdomain.com/preview-image.jpg" />
        <meta property="og:url" content="https://yourdomain.com" />
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
            className='h-[100%] sm:max-w-[100%]'
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
      <div className="B flex justify-center space-x-4 sm:justify-between items-center my-2 sm:my-2">
        <div className="text-left font-semibold text-rose-900 text-xl sm:text-3xl sm:ml-6 flex items-center justify-center pr-1"><HiCog className='mr-1 hidden sm:block'/>相簿管理系統</div>
        <div className="bg-rose-900 hover:bg-rose-700 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]">  
            <Link href="/addAlbum" className="text-white flex items-center justify-center"><HiPlus className='mr-1'/>新增相簿</Link>
        </div>
      </div>
      <hr className="hidden sm:block h-px bg-gray-700 border-2 sm:mt-8 sm:mb-12"></hr>
      {/* 主要內容 */}
      {loading ? ( 
        <div className='flex justify-center items-center flex-col text-center font-bold text-rose-900 h-48 text-xl sm:text-2xl'>
          <div><CircularProgress size="40px" sx={{ color: '#881337' }} /></div><div>正在為您加載中</div>
        </div>
        ) 
        : albums.length === 0 ?(
          <div className='flex justify-center items-center text-center font-bold text-rose-900 h-48 text-xl sm:text-2xl'>X沒有任何相簿X<br />~請新增相簿~</div>
          )
          :
          // h-[25rem]
          (<div ref={pageRef} className="C grid justify-center sm:grid-cols-2 md:grid-cols-4 gap-4 mx-auto w-full overflow-y-scroll overflow-x-hidden sm:h-auto sm:overflow-visible">
            {newAlbums.map((album) => (
              <div key={album.album_id} className="w-72 sm:w-full h-72 bg-white flex flex-col justify-start rounded-lg leading-10 text-lg sm:text-xl text-center border-solid border-2 border-gray-200">
                <Link href={`/photo_manage/${album.album_id}`}>
                  <div className="relative w-full h-48 overflow-hidden">
                    {album.photo_file == null ?
                      <div className="leading-[13rem] bg-[#f1f1f1]">此相簿沒有圖片</div>
                      :
                      <Image 
                        src={`${serverApiUrl}/public/images/thumbnail/${album.photo_file}`} 
                        alt={album.album_name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="object-cover rounded-t-lg transform transition-transform duration-250 ease-in-out hover:scale-125 focus:scale-125" 
                      />
                    }
                  </div>
                  <p className="mt-2 font-medium">{album.album_name}</p>
                </Link>
                <p className="flex items-center justify-center cursor-pointer pt-3 text-rose-800 hover:text-rose-600 focus:text-rose-600" onClick={() => openDelDialog(album.album_id)}>
                  <HiTrash className='mr-1'/>刪除相簿
                </p>
              </div>
            ))}
          </div>)
      }

      {/* 分頁按鈕 */}
      { !loading && albums.length > 0 && (<Pagination albums={albums} pageCount={pageCount} pageClick={pageClick} />) }
      {/* snackbar提示訊息 */}
      <SnackbarAlert snackbarOpen={snackbarOpen} snackbarType={snackbarType} snackbarMes={snackbarMes} closeSnackbar={closeSnackbar}/>
      {/* <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={closeSnackbar} severity={snackbarType} variant="filled" sx={{ width: '100%' }}>
          {snackbarMes}
        </Alert>
      </Snackbar> */}
      {/* confirm dialog提示訊息 */}
      <Confirm dialogType={dialogType} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} deleteAlbum={deleteAlbum} logout={logout}/>
      {/* <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>刪除不可復原</DialogTitle>
        <DialogContent>
          <DialogContentText>確定要刪除此相簿嗎?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">取消</Button>
          <Button onClick={deleteAlbum} color="error" autoFocus>確認</Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default AlbumManage;