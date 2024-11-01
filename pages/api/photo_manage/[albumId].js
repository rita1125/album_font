import axios from 'axios';

export default async function handler(req, res) {
    const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server/';

    if(req.method === 'GET'){ 
        const { albumId } = req.query; // 使用 req.query 而不是 req.body 來獲取參數，可以看 Network的 Payload
        if (!albumId) {
            // 用戶端的錯誤
            return res.status(400).json({ success: false, message: 'Need AlbumID!' });
        }

        try {
            // GET方法的參數應該是作為查詢字符串傳遞，而不是作為請求體內容
            const response = await axios.get(`${serverApiUrl}/photos.php?albumId=${albumId}`);
            const result = response.data;
            if (result) {
                return res.status(200).json({ result });
            }else{
                return res.status(404).json({ message: 'No photos found' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }else{
        // 處理 非GET請求，返回405
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}