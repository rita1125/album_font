// next.config.js
module.exports = {
  async rewrites() {  //定義 URL 重寫規則，允許不同端口的前端路徑（如 /albums）重定向到另一個 URL（如一個 API 或 PHP 檔案）
    return [
      {
        source: '/albums', //使用者輸入的 URL
        destination: 'http://localhost/album_nextjs/server/albums.php'  || `${process.env.NEXT_PUBLIC_API_URL}/albums.php`, //處理該請求的 URL 
      },
      {
        source: '/manage', //使用者輸入的 URL
        destination: 'http://localhost/album_nextjs/server/manage.php' || `${process.env.NEXT_PUBLIC_API_URL}/manage.php`, //際理該請求的 URL 
      },
    ];
  },
};