const socket = io();
const streamImg = document.getElementById('stream');

// --- Frame update ---
socket.on('frame', base64 => {
    streamImg.src = 'data:image/png;base64,' + base64;
});

// --- Mouse / Touch ---
function emitClick(x, y) {
    socket.emit('click', { x, y });
}

function emitMove(x, y) {
    socket.emit('move', { x, y });
}

// Desktop mouse
streamImg.addEventListener('click', e => {
    const rect = e.target.getBoundingClientRect();
    emitClick(e.clientX - rect.left, e.clientY - rect.top);

    // Fullscreen on first click
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn('Fullscreen error:', err);
        });
    }
});

streamImg.addEventListener('mousemove', e => {
    const rect = e.target.getBoundingClientRect();
    emitMove(e.clientX - rect.left, e.clientY - rect.top);
});

// Mobile touch
let lastTouchY = null;
streamImg.addEventListener('touchstart', e => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const touch = e.touches[0];
    emitClick(touch.clientX - rect.left, touch.clientY - rect.top);
    lastTouchY = touch.clientY;
});

streamImg.addEventListener('touchmove', e => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const touch = e.touches[0];
    emitMove(touch.clientX - rect.left, touch.clientY - rect.top);

    if (lastTouchY !== null) {
        const deltaY = lastTouchY - touch.clientY;
        socket.emit('wheel', { deltaX: 0, deltaY });
        lastTouchY = touch.clientY;
    }
});

streamImg.addEventListener('touchend', e => {
    e.preventDefault();
    lastTouchY = null;
});

// --- Smooth scroll (desktop wheel) ---
let scrollBuffer = 0;
let scrollTimer = null;
window.addEventListener('wheel', e => {
    scrollBuffer += e.deltaY;
    if (!scrollTimer) {
        scrollTimer = setInterval(() => {
            if (Math.abs(scrollBuffer) < 1) {
                clearInterval(scrollTimer);
                scrollTimer = null;
                return;
            }
            const step = scrollBuffer * 0.2;
            scrollBuffer -= step;
            socket.emit('wheel', { deltaX: 0, deltaY: step });
        }, 16);
    }
});

// --- Keyboard ---
window.addEventListener('keydown', e => {
    let modifiers = [];
    if (e.shiftKey) modifiers.push('Shift');
    if (e.ctrlKey) modifiers.push('Control');
    if (e.altKey) modifiers.push('Alt');

    e.preventDefault();
    socket.emit('keydown', { code: e.code, modifiers });
});
