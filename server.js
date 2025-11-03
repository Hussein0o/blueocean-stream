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
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();
    console.log('🌐 Opening page...');
    await page.goto(process.env.BLUEOCEAN_URL, { waitUntil: 'networkidle2', timeout: 120000 });
    console.log('✅ Page loaded successfully!');
}

async function streamPage() {
    if (!page) return;
    const screenshot = await page.screenshot({ encoding: 'base64' });
    io.emit('frame', screenshot);
}

io.on('connection', (socket) => {
    console.log('📡 Viewer connected:', socket.id);

    // Handle mouse clicks
    socket.on('click', async (data) => {
        if (!page) return;
        await page.mouse.click(data.x, data.y);
    });

    // Handle mouse movement (hover)
    socket.on('move', async (data) => {
        if (!page) return;
        await page.mouse.move(data.x, data.y);
    });

    // Handle scrolling
    socket.on('scroll', async (data) => {
        if (!page) return;
        await page.evaluate(({ deltaY }) => {
            window.scrollBy(0, deltaY);
        }, data);
    });

    // Handle keyboard typing
    socket.on('type', async (data) => {
        if (!page) return;
        await page.keyboard.type(data.text);
    });

    socket.on('disconnect', () => {
        console.log('❌ Viewer disconnected:', socket.id);
    });
});

(async () => {
    await startBrowser();
    setInterval(streamPage, process.env.SCRAPE_INTERVAL_MS || 1000);
    server.listen(process.env.PORT, () =>
        console.log(`🌍 Server running on http://localhost:${process.env.PORT}`)
    );
})();

