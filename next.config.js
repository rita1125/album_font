// next.config.js
module.exports = {
  async rewrites() {  //定義 URL 重寫規則，允許不同端口的前端路徑（如 /albums）重定向到另一個 URL（如一個 API 或 PHP 檔案）
    return [
      {
        source: '/albums', //使用者輸入的 URL，首頁index
        destination: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/albums.php`:'http://localhost/album_nextjs/server/albums.php', //處理該請求的 URL 
      },
      {
        source: '/manage', //使用者輸入的 URL，管理相簿的系統頁面
        destination: process.env.NEXT_PUBLIC_API_URL? `${process.env.NEXT_PUBLIC_API_URL}/manage.php`:'http://localhost/album_nextjs/server/manage.php',//處理該請求的 URL 
      },
    ];
  },
  // images: {
  //   domains: [
  //     'localhost',
  //     'albums-server-8c95f917560b.herokuapp.com', //heroku後端主機名
  //     'i.imgur.com', // 允許從 imgur 下載圖片
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',  // 依實際情況配置 目前無設定，直接使用localhost，例如http://localhost/album_nextjs/server/testC.php
        pathname: '/album_nextjs/server/public/images/bigphoto/**', 
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',  // 依實際情況配置 目前無設定，直接使用localhost，例如http://localhost/album_nextjs/server/testC.php
        pathname: '/album_nextjs/server/public/images/thumbnail/**',
      },
      {
        protocol: 'https',
        hostname: 'albums-server-8c95f917560b.herokuapp.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
};