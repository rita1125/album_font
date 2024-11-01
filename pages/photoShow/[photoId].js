import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { HiLibrary, HiReply , HiCog } from "react-icons/hi";    

// 在伺服器端抓取資料
export async function getServerSideProps(context) {
  const { photoId } = context.params; 
  const frontApiUrl = process.env.NEXT_PUBLIC_FRONT_API_URL || 'http://localhost:3000';
  try {
    // 傳遞 photoId 作為查詢參數
    // axios選項，用來構建 URL查詢參數，在 GET 請求中。它會自動將 params中的 key-value 對附加到 URL 後，形成完整的查詢字串
    // const response = await axios.get('http://localhost:3000/api/photoShow', { 
    //   params: { photoId }
    // });
    const response = await axios.get(`${frontApiUrl}/api/photoShow/${photoId}`);
    const data = response.data;
    if (!data.photos) {
      return {
        props: {
          photos: [], // 若未找到照片則返回空陣列
        },
      };
    }
    return {
      props: {
        photos: data.photos,
      },
    };
  } catch (error) {
    console.error('Error取圖片', error);
    return {
      props: {
        photos: [], 
      },
    };
  }
}


export default function PhotosPage({ photos }) {
  const router = useRouter();  
  const isHomepage = router.pathname === '/'; 
  //console.log(photos);

  if (!photos) {
    return <div className='container mx-auto w-full h-screen flex justify-center items-center'>未找到此張全圖</div>;
  }

  return (
    <div className="container mx-auto px-4 w-full md:w-[70%] h-screen flex flex-col">
        <Head>
          <title>繽紛生活-全圖</title>
          <meta name="description" content="使用Next.js與PHP進行全端開發實作。此專案提供用戶新建、編輯和刪除相簿與照片，能有效地進行照片分類和相簿管理，提升資料管理的便捷性" />
          <meta charSet="UTF-8" />
          <meta name="author" content="Rita Chen" />
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
          {/* Facebook、LinkedIn分享時的預覽效果 */}
          <meta property="og:title" content="繽紛生活-全圖" />
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
                <Link href="/" className="text-white flex items-center justify-center"><HiLibrary className='mr-1'/>回到首頁</Link>
                </div>
            ) }
            <div className="bg-[#8bbae5] hover:bg-sky-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem]"> 
                <Link href="/login" className="text-white flex items-center justify-center"><HiCog className='mr-1'/>相簿管理</Link>
            </div>
            </div>
        </div>
        {/* 主要內容 */}
        <div className="C mx-auto text-xl mt-10 flex flex-col items-center">
            {photos.map(photo => (
                <div key={photo.photo_id}>
                    <div className="w-[21rem] h-[12rem] md:w-[50rem] md:h-[27rem] flex justify-center overflow-hidden bg-white rounded-lg mb-12">
                      <img src={`/images/bigphoto/${photo.photo_file}`} className=" h-full object-cover" />
                    </div>
                </div>
            ))}
            {/* 上一頁 */}
            <div onClick={() => window.history.back()} className="bg-gray-400 hover:bg-gray-300 rounded-3xl w-[7.5rem] sm:w-44 h-10 sm:h-12 font-semibold text-lg sm:text-2xl text-center text-white leading-[2.6rem] sm:leading-[3rem] cursor-pointer">
              <div className="text-white flex items-center justify-center">
                <HiReply className="mr-1" />回上一頁
              </div>
            </div>
        </div>
    </div>
  );
}

