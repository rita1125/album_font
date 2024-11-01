// pages/api 目錄下的檔案會自動被視為 API 路徑
// handler:專門處理 HTTP 請求的函數，API 路由檔案位於 pages/api 資料夾中。每個檔案對應一個 API 路徑
import axios from 'axios';
export default async function handler(req, res) {
    if (req.method === 'POST') { //req.method: 檢查前端請求的 HTTP 方法
      //req.body: 從前端送來的請求中獲取登入表單中的 username 和 password
      const { username, password } = req.body; 
      const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server';
      
      try {
        // const response = await fetch('http://localhost/album_nextjs/login.php', {
        //   method: 'POST',
        //   // headers: { 
        //   //   //用於傳統表單提交，設定內容類型是URL編碼的格式，例如:username=test01&password=01234
        //   //   //在 PHP 中，你可以使用 $_POST['username'] 和 $_POST['password'] 來輕鬆訪問這些數據
        //   //   //因為使用 URLSearchParams 會自動將資料格式化為 application/x-www-form-urlencoded，這是表單提交常用的格式
        //   //   //不需要在使用 URLSearchParams 時指定 headers: { 'Content-Type': 'application/x-www-form-urlencoded' }，PHP會自動處理
        //   // },
        //   body: new URLSearchParams({  URLSearchParams POST 方法
        //     username,
        //     password,
        //   }),
        // });
        const response = await axios.post(`${serverApiUrl}/login.php`, new URLSearchParams({
          username,
          password,
        }));
        const result = response.data;
        if (result.success) {
          return res.status(200).json({ success: true, token: result.token });
        } else {
          return res.status(401).json({ success: false });
        }
      } catch (error) {
        //伺服器錯誤
        return res.status(500).json({ success: false });
      }
    } else {
      //不是 POST 方法，回傳405錯誤
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }