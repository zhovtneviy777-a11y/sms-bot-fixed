const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Змінні з .env
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TARGET_CHAT_ID = process.env.TARGET_CHAT_ID;

// Маршрут для головної сторінки
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Маршрут для відправки повідомлення
app.post('/send-message', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || message.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'Повідомлення не може бути порожнім' 
            });
        }

        // Відправка повідомлення в Telegram
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TARGET_CHAT_ID,
                text: `📩 НОВЕ ПОВІДОМЛЕННЯ:\n\n${message}`,
                parse_mode: 'HTML'
            }
        );

        res.json({ 
            success: true, 
            message: 'Повідомлення успішно відправлено!',
            data: telegramResponse.data 
        });
        
    } catch (error) {
        console.error('Помилка:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Помилка при відправці повідомлення',
            details: error.response?.data || error.message 
        });
    }
});

// Статус бота
app.get('/bot-status', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
        );
        res.json({ 
            success: true, 
            bot: response.data.result 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Бот не активний' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущено на порті ${PORT}`);
    console.log(`🔗 Посилання: http://localhost:${PORT}`);
});
