document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('messageForm');
    const statusDiv = document.getElementById('status');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const messageInput = document.getElementById('message');
        const senderInput = document.getElementById('sender');
        
        let message = messageInput.value.trim();
        const sender = senderInput.value.trim();
        
        if (sender) {
            message = `👤 Від: ${sender}\n\n${message}`;
        }
        
        // Показати завантаження
        statusDiv.textContent = '⏳ Відправка повідомлення...';
        statusDiv.className = 'status';
        
        try {
            const response = await fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                statusDiv.textContent = '✅ Повідомлення успішно відправлено!';
                statusDiv.className = 'status success';
                
                // Очистити форму
                form.reset();
                
                // Сховати повідомлення через 5 секунд
                setTimeout(() => {
                    statusDiv.textContent = '';
                    statusDiv.className = 'status';
                }, 5000);
            } else {
                throw new Error(data.error || 'Помилка відправки');
            }
            
        } catch (error) {
            console.error('Error:', error);
            statusDiv.textContent = `❌ Помилка: ${error.message}`;
            statusDiv.className = 'status error';
        }
    });
});
