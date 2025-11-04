const socket = io();
const streamImg = document.getElementById('stream');

// Update frame
socket.on('frame', base64 => {
    streamImg.src = 'data:image/png;base64,' + base64;
});

// Mouse click
streamImg.addEventListener('click', e => {
    const rect = e.target.getBoundingClientRect();
    socket.emit('click', { x: e.clientX - rect.left, y: e.clientY - rect.top });
});

// Mouse move
streamImg.addEventListener('mousemove', e => {
    const rect = e.target.getBoundingClientRect();
    socket.emit('move', { x: e.clientX - rect.left, y: e.clientY - rect.top });
});

// Smooth scroll handler
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
            const step = scrollBuffer * 0.2; // smooth factor
            scrollBuffer -= step;
            socket.emit('wheel', { deltaY: step });
        }, 16); // roughly 60fps
    }
});

// Keyboard input
window.addEventListener('keydown', e => {
    let modifiers = [];
    if (e.shiftKey) modifiers.push('Shift');
    if (e.ctrlKey) modifiers.push('Control');
    if (e.altKey) modifiers.push('Alt');

    e.preventDefault();
    socket.emit('keydown', { code: e.code, modifiers });
});

