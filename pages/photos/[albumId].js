import axios from 'axios';
import { useState,useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Pagination from '../../components/Pagination'; //分頁
import { HiLibrary, HiZoomIn, HiCog } from "react-icons/hi";

//伺服器端抓取資料
export async function getServerSideProps(context) {
  //訪問 /photos/12 時，12 作為 albumId 會自動傳遞到 getServerSideProps 的 params
  const { albumId } = context.params;  //只會在動態路由頁面中出現，取路由中的動態參數
  const frontApiUrl = process.env.NEXT_PUBLIC_FRONT_API_URL || 'http://localhost:3000';

  const response = await axios.get(`${frontApiUrl}/api/photos/${albumId}`);
  const data = response.data.result;
  //console.log('Data :', data);

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
      thisAlbum: data.thisAlbum,
      photos: data.photos
    },
  };
}

export default function PhotosPage({ thisAlbum, photos }) {
  const router = useRouter();
  const isHomepage = router.pathname === '/'; 
  const [nowPage, setNowPage] = useState(0);
  const itemsInPage = 4;
  const pageRef = useRef(null);
  const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server';

  // 計算當前頁的資料
  const pageCount = Math.ceil(photos.length / itemsInPage);
  const newPhotos = photos.slice(nowPage * itemsInPage, (nowPage + 1) * itemsInPage);
  // 分頁
  const pageClick = (data) => {
    setNowPage(data.selected);
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
    }
  };

  if (!thisAlbum) {
    return <div className='container mx-auto w-full h-screen flex justify-center items-center'>未找到相簿任何資料</div>;
  }

  return (
    <div className="container mx-auto px-4 w-full md:w-[70%] h-screen flex flex-col">
      <Head>
        <title>繽紛生活-圖片總覽</title>
        <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Rita Chen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        {/* Facebook、LinkedIn分享時的預覽效果 */}
        <meta property="og:title" content="繽紛生活-圖片總覽" />
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
          />
        </div>
        <div className="flex justify-center space-x-4">
          { !isHomepage && (
            <div className="bg-[#f29b6c] hover:bg-orange-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]">  
              <Link href="/" className="text-white flex items-center justify-center"><HiLibrary className='mr-1'/>回到首頁</Link>
            </div>
          ) }
          <div className="bg-[#8bbae5] hover:bg-sky-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
            <Link href={`/photo_manage/${thisAlbum.album_id}`} className="text-white flex items-center justify-center"><HiCog className='mr-1'/>圖片管理</Link>
          </div>
        </div>
      </div>
      {/* 頁面簡述與分隔線 */}
      <div className="B flex justify-evenly sm:justify-between items-center text-rose-900 my-2 sm:my-4">
        <div className="text-left font-semibold text-xl sm:text-3xl sm:ml-6 flex items-center justify-center"><HiLibrary className='mr-1'/>{thisAlbum.album_name}</div>
        <div className="text-right font-semibold text-xl sm:text-3xl sm:mr-6">圖片數量 : {photos.length}</div>
      </div>
      <hr className="hidden sm:block h-px bg-gray-700 border-2 sm:mt-8 sm:mb-12"></hr>
      {/* 主要內容 */}
      {/* 電腦版相簿概述 */}
      <div className='hidden sm:block sm:text-2xl leading-10 mb-4 ml-1'>
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
      {photos.length === 0 ?
        <div className='flex justify-center items-center font-bold text-rose-900 h-48 text-xl sm:text-2xl'>~此相簿沒有圖片~</div>
        :
        <div ref={pageRef} className="C grid justify-center sm:grid-cols-2 md:grid-cols-4 gap-4 mx-auto w-full h-[24rem] overflow-y-scroll overflow-x-hidden sm:h-auto sm:overflow-visible">
          {newPhotos.map(photo => (
            <Link href={`/photoShow/${photo.photo_id}`} key={photo.photo_id}>
              <div>
                {/* 圖片的容器，設置固定尺寸和 overflow-hidden */}
                <div className="w-72 sm:w-full h-48 bg-white overflow-hidden rounded-lg mb-2">
                  <img src={`${serverApiUrl}/public/images/thumbnail/${photo.photo_file}`} alt={thisAlbum.album_name} className="w-full h-full object-cover" />
                </div>
                <p className="flex items-center justify-center font-bold text-rose-900 hover:text-rose-700 focus:text-rose-700 text-center text-lg sm:text-xl">
                  <HiZoomIn className="mr-1" />
                  點擊看全圖
                </p>
              </div>
            </Link>
            ))
          }
        </div>
      }
      {/* 分頁按鈕 */}
      {photos.length === 0 ?
        <></>
        :
        <Pagination photos={photos} pageCount={pageCount} pageClick={pageClick} />
      }
      {/* 
        <style jsx>
          {`
            .photos {
              display: flex;
              flex-wrap: wrap;
            }
            .photo {
              width: 250px;
            }
          `}
        </style> 
      */}
    </div>
  );
}