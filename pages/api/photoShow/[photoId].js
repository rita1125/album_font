import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') { // 檢查是否為 GET 請求
      const { photoId } = req.query; // 使用 req.query 而不是 req.body 來獲取參數
      const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server/';

      try {
        // GET方法的參數應該是作為查詢字符串傳遞，而不是作為請求體內容
        //const response = await axios.get(`${serverApiUrl}/photoShow.php`,{ params:{photoId} });
        const response = await axios.get(`${serverApiUrl}/photoShow.php?photoId=${photoId}`);

        const result = response.data;
        //console.log(result)

        if (result.photos) {
          return res.status(200).json({ photos: result.photos });
        } else {
          return res.status(404).json({ message: 'No photos found' });
        }
      } catch (error) {
        // 處理伺服器錯誤
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
    } else {
      // 處理非 GET 請求
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}