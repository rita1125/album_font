import axios from 'axios';

export default async function handler(req, res) {
    const serverApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/album_nextjs/server';

    if(req.method === 'GET'){ 
        const { albumId } = req.query; //用 req.query 來獲取 URL查詢字符串
        if (!albumId) {
            // 用戶端的錯誤
            return res.status(400).json({ success: false, message: 'Need AlbumID!' });
        }

        try {
            // GET方法的參數應該是作為查詢字符串傳遞，而不是作為請求體內容
            const response = await axios.get(`${serverApiUrl}/editalbum.php?albumId=${albumId}`);
            const result = response.data;
            if (result) {
                return res.status(200).json({ result });
            }else{
                return res.status(404).json({ message: 'No album introduction found' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }

    }else if (req.method === 'POST') {
            const { albumId } = req.query; 
            //使用 URLSearchParams格式會自動將資料格式化為 application/x-www-form-urlencoded，這是表單提交常用的格式
            //axios會自動設置正確的請求投 Content-Type 為 application/x-www-form-urlencoded，不需要手動設置
            const params = new URLSearchParams(req.body); //把 物件 轉成URLSearchParams格式
            try {
            const response = await axios.post(`${serverApiUrl}/editalbum.php?albumId=${albumId}`, params, {
                // headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded' //設置表單提交常用的格式
                // }
            });
        
            if (response.data.success) {
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({ success: false, message: 'Failed to update album' });
            }
            } catch (error) {
            // 處理 PHP 伺服器錯誤
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
            }

        } else {
            //通知使用者這個 API 不支持 GET、POST 方法
            res.status(405).json({ message: 'Method not allowed' });
        }
    }

    