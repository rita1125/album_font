import axios from 'axios';
export async function verifyToken(token){
    const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server';
    try {
    //發送請求到後端驗證token
    //const response = await axios.post('http://localhost/album_nextjs/server/token.php', {token}, 
    const response = await axios.post(`${serverApiUrl}/token.php`, {token}, 
        //Bearer 是身份驗證方案，它告訴伺服器請求中的 token 是用來進行身份驗證的，使用 Authorization 標頭並附加 Bearer 是 JWT 的標準做法
        //後端提取請求中的 token，並用密鑰驗證這個 token。如果驗證成功，後端可以確認用戶的身份，根據token裡的資料執行相應的操作
        {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, }
        }
    );
      return response.data.success;
    } catch (error) {
      console.error('驗證Token失敗:', error);
      return false;
    }
  }