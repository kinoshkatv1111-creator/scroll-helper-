jQuery(document).ready(() => {
    if (document.getElementById('st-scroll-down-btn')) return;
    const btn = document.createElement('div');
    btn.id = 'st-scroll-down-btn';
    btn.innerHTML = '🔽';
    btn.style = 'position:fixed;right:20px;bottom:100px;width:45px;height:45px;background:rgba(0,0,0,0.7);border:1px solid rgba(255,255,255,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;z-index:9999;opacity:0.6;box-shadow:0 4px 6px rgba(0,0,0,0.3);';
    btn.addEventListener('click', () => {
        const chat = document.getElementById('chat');
        if (chat) chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    });
    document.body.appendChild(btn);
    window.addEventListener('resize', () => {
        setTimeout(() => {
            const chat = document.getElementById('chat');
            if (chat) chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
        }, 200);
    });
});
