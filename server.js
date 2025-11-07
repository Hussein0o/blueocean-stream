const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

let browser, page;

async function startBrowser() {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--kiosk'],
        defaultViewport: null
    });
    await openPage();
}

async function openPage() {
    if (page && !page.isClosed()) return;
    console.log('🌐 Opening page...');
    page = await browser.newPage();
    await page.goto(process.env.BLUEOCEAN_URL, {
        waitUntil: 'networkidle2',
        timeout: 180000
    });
    await page.setViewport({ width: 1920, height: 1080 });
    console.log('✅ Page loaded successfully!');
}

async function ensurePage() {
    if (!page || page.isClosed()) {
        console.log('⚠️ Page closed, reopening...');
        await openPage();
    }
}

async function streamPage() {
    try {
        await ensurePage();
        const screenshot = await page.screenshot({ encoding: 'base64' });
        io.emit('frame', screenshot);
    } catch (err) {
        console.error('❌ Screenshot error:', err.message);
    }
}

io.on('connection', socket => {
    console.log('📡 Viewer connected:', socket.id);

    socket.on('click', async data => {
        await ensurePage();
        await page.mouse.click(data.x, data.y);
    });

    socket.on('move', async data => {
        await ensurePage();
        await page.mouse.move(data.x, data.y);
    });

    socket.on('wheel', async data => {
        await ensurePage();
        await page.mouse.wheel({ deltaX: data.deltaX || 0, deltaY: data.deltaY || 0 });
    });

    socket.on('keydown', async data => {
        await ensurePage();
        if (!data || !data.code) return;
        const modifiers = data.modifiers || [];
        for (let mod of modifiers) await page.keyboard.down(mod);
        await page.keyboard.down(data.code);
        for (let mod of modifiers) await page.keyboard.up(mod);
        await page.keyboard.up(data.code);
    });

    socket.on('disconnect', () => console.log('❌ Viewer disconnected:', socket.id));
});

(async () => {
    await startBrowser();
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`🌍 Server running on http://localhost:${PORT}`));
    setInterval(streamPage, 500);
})();
