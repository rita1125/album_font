import { useState, useEffect, useRef } from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import Pagination from '../components/Pagination';  //分頁
import { HiLibrary, HiCog } from "react-icons/hi";    
import CircularProgress from '@mui/material/CircularProgress';  //loading

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const router = useRouter();                 //取得當前路徑
  const isHomepage = router.pathname === '/'; // 判斷是否為首頁路徑
  const [nowPage, setNowPage] = useState(0);  //0當第1頁
  const itemsInPage = 4;                      //4個為一頁
  const pageRef = useRef(null);
  const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server';
  const [loading, setLoading] = useState(true); 

  // useEffect(() => {
  //   axios.get(`/albums`) 
  //     .then((res) => {
  //       setAlbums(res.data.albums);
  //     })
  //     .catch(error => {
  //       console.error("GET albums error! ", error); 
  //     });
  // }, []);
  useEffect(() => {
    const getAlbums = async () => {
      try {
        const res = await axios.get(`/albums`);
        setAlbums(res.data.albums);
      } catch (error) {
        console.error("GET albums error! ", error);
      } finally {
        setLoading(false); 
      }
    };

    getAlbums();
  }, []);


  // 計算當前頁的資料
  const pageCount = Math.ceil(albums.length / itemsInPage);  //計算整筆資料分成幾頁
  const newAlbums = albums.slice(nowPage * itemsInPage, (nowPage + 1) * itemsInPage);  //slice(起始index，結束index前停止提取) ，slice(0,4)提取 index 0~index 3
  // 分頁
  const pageClick = (data) => {
    //console.log(data)  //{selected: 0}、{selected: 1}...
    setNowPage(data.selected);
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="container mx-auto px-4 w-full sm:w-[90%] lg:w-[70%] h-screen flex flex-col">
      <Head>
        <title>繽紛生活-相簿首頁</title>
        <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Rita Chen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        {/* Facebook、LinkedIn分享時的預覽效果 */}
        <meta property="og:title" content="繽紛生活-相簿首頁" />
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
            // style={{ width: '100%', height: 'auto' }}  //使圖片的寬度為100%的父元素尺寸，高度自動調整，保持原始寬高比
          />
        </div>
        <div className="flex justify-center space-x-4">
          { !isHomepage && (
            <div className="bg-[#f29b6c] hover:bg-orange-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]">  
              <Link href="/" className="text-white flex items-center justify-center"><HiLibrary className='mr-1'/>回到首頁</Link>
            </div>
          ) }
          <div className="bg-[#8bbae5] rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
            <Link href="/album_manage" className="text-white flex items-center justify-center"><HiCog className='mr-1'/>相簿管理</Link>
          </div>
        </div>
      </div>
      {/* 頁面簡述與分隔線 */}
      <div className="B flex justify-evenly sm:justify-between items-center text-rose-900 my-2 sm:my-4">
        <div className="text-left font-semibold text-xl sm:text-3xl sm:ml-6 flex items-center justify-center"><HiLibrary className='mr-1'/>相簿首頁</div>
        <div className="text-right font-semibold text-xl sm:text-3xl sm:mr-6">總數量 : {albums.length}</div>
      </div>
      <hr className="hidden sm:block h-px bg-gray-700 border-2 sm:mt-8 sm:mb-12"></hr>
      {/* 主要內容 */}
      {loading ? ( 
        <div className='flex justify-center items-center flex-col text-center font-bold text-rose-900 h-48 text-xl sm:text-2xl'>
          <div><CircularProgress size="40px" sx={{ color: '#881337' }} /></div><div>正在為您加載中</div>
        </div>
        ) 
        : albums.length === 0 ? (
          <div className='flex justify-center items-center text-center font-bold text-rose-900 h-48 text-xl sm:text-2xl'>X沒有任何相簿X<br />~請於相簿管理進行新增~</div>
          )
          : (<div ref={pageRef} className="C grid justify-center sm:grid-cols-2 md:grid-cols-4 gap-4 mx-auto w-full h-[25rem] overflow-y-scroll overflow-x-hidden sm:h-auto sm:overflow-visible ">
            {newAlbums.map((album) => (
              <div key={album.album_id} className="w-72 sm:w-full h-72 bg-white flex flex-col justify-start rounded-lg leading-10 text-lg sm:text-xl text-center border-solid border-2 border-gray-200">
                <Link href={`/photos/${album.album_id}`}>
                  <div className="relative w-full h-48 bg-white overflow-hidden rounded-lg">
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
                  <p className="text-lg text-gray-500">共 {album.photo_count} 張</p>
                </Link>
              </div>
              ))
            }
          </div>)
      }
      

      {/* 分頁按鈕 */}
      { !loading && albums.length > 0 && (<Pagination albums={albums} pageCount={pageCount} pageClick={pageClick} />) }
    </div>
  );
}