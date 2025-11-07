# 🌊 BlueOcean Stream

Live interactive browser stream powered by Puppeteer, Express, and Socket.io.  
Watch and control a remote BlueOcean Jenkins page (or any target URL) directly from your browser in real-time — with full mouse, keyboard, and scroll support.

---

## 🚀 Features

✅ Real-time screen streaming (updated frequently)  
✅ Full mouse control — click, move, hover  
✅ Smooth scrolling support (wheel or touchpad)  
✅ Full keyboard control — including navigation keys  
✅ Fast & responsive rendering  
✅ Easy to run locally or deploy to VM / Cloud  

---

## 🧩 Project Structure

```
blueocean-stream/
├── public/
│   └── index.html       # Frontend UI + Socket.io client
├── server.js            # Express + Puppeteer + Socket.io server
├── .env                 # Environment variables
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```bash
BLUEOCEAN_URL=https://your-blueocean-instance-url
PORT=3000
SCRAPE_INTERVAL_MS=500
```

> 📝 Note: `BLUEOCEAN_URL` must be a valid and reachable URL (e.g. your Jenkins BlueOcean dashboard).

---

## 🪄 Installation & Run

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Hussein0o/blueocean-stream.git
cd blueocean-stream
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure your `.env` file
```bash
BLUEOCEAN_URL=https://your-blueocean-instance-url
PORT=3000
SCRAPE_INTERVAL_MS=500
```

### 4️⃣ Run the server
```bash
node server.js
```

### 5️⃣ Open in your browser
Go to 👉 [http://localhost:3000](http://localhost:3000)

---

## 💻 Usage

- The web page will show a **live feed** of the target page.  
- You can **move your mouse**, **click**, **scroll**, and **type** as if you’re on the real page.
- On mobile, touch and swipe gestures are supported.
- The interface enters full screen automatically on first interaction.
- Ideal for remote BlueOcean/Jenkins visualizations or controlled browser automation demos.

---

## 📝 Notes

- Puppeteer launches Chrome in kiosk mode for full screen streaming.
- The stream updates every 500ms.
- Make sure the BlueOcean URL is accessible from the server.
  
---

## 🧠 Troubleshooting

| Issue | Possible Cause | Fix |
|-------|----------------|-----|
| ❌ TimeoutError: Navigation timeout exceeded | Target URL not reachable | Check `BLUEOCEAN_URL` validity |
| ❌ Black screen | Page not loaded or Puppeteer crashed | Restart server or recheck URL |
| 🐢 Laggy stream | High `SCRAPE_INTERVAL_MS` value | Reduce to `500` or `250` |

---

## 🐳 Coming Soon: Docker Support

Planned enhancements:
- [ ] Dockerfile with lightweight Chromium image  
- [ ] Docker Compose integration for BlueOcean stream  
- [ ] Cloud deployment (Azure / AWS / GCP)

---

## 👨‍💻 Author

**Hussein Mahran**   
💼 DevOps / Infrastructure Engineer @ ARMA
📧 [hussein0o](https://github.com/Hussein0o)

---

## 🪪 License

MIT License © 2025 Hussein Mahran
