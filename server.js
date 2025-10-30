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

// ✅ 1. دالة لتشغيل المتصفح والدخول للموقع
async function startBrowserAndLogin() {
  browser = await puppeteer.launch({
    headless: true, // خليه true لأننا على سيرفر بدون واجهة
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      '--single-process'
    ]
  });

  page = await browser.newPage();

  console.log('🌍 openning page ...');
  await page.goto(process.env.BLUEOCEAN_URL, { waitUntil: 'networkidle2', timeout: 60000 });

  console.log('✅ succesfully opened');
}

// ✅ 2. دالة لجمع البيانات وبثها عبر Socket.io
async function scrapeAndEmit() {
  try {
    const data = await page.evaluate(() => {
      const title = document.title;
      return { title };
    });

    io.emit('update', { ts: Date.now(), payload: data });
  } catch (err) {
    console.error('❌ scrape error', err.message);
  }
}

// ✅ 3. إعداد Socket.io للاتصال
io.on('connection', socket => {
  console.log('💡 client connected', socket.id);
  socket.on('disconnect', () => console.log('client disconnected', socket.id));
});

// ✅ 4. بدء السيرفر وPuppeteer
(async () => {
  await startBrowserAndLogin();

  // يحدث البيانات كل 30 ثانية
  setInterval(scrapeAndEmit, 30000);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`🚀 lesining to ${PORT}`));
})();

