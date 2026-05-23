// app.js
const BOT_TOKEN = "7282402921:AAEv0r2LDNGDTp-__LwbyzQ3cLJ6Ns2Px6w";

async function loadTelegramContent() {
    const container = document.getElementById('feed-container');
    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-5`);
        const data = await res.json();

        if (data.ok && data.result.length > 0) {
            container.innerHTML = ''; // Hapus pesan loading
            
            // Ambil data terbaru
            data.result.reverse().forEach(async (update) => {
                const post = update.channel_post || update.message;
                if (!post) return;

                let mediaHtml = '';
                // Jika ada foto, kita ambil URL-nya
                if (post.photo) {
                    const fileId = post.photo[post.photo.length - 1].file_id;
                    const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
                    const fileData = await fileRes.json();
                    const imgUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;
                    mediaHtml = `<div class="post-media"><img src="${imgUrl}"></div>`;
                }

                container.innerHTML += `
                    <div class="post-card">
                        ${mediaHtml}
                        <div class="post-content">
                            <p class="post-text">${post.text || post.caption || ""}</p>
                            <span class="post-date">${new Date(post.date * 1000).toLocaleTimeString()}</span>
                        </div>
                    </div>`;
            });
        }
    } catch (error) {
        container.innerHTML = '<p class="status-msg">Gagal memuat konten.</p>';
    }
}

loadTelegramContent();
setInterval(loadTelegramContent, 30000); // Update otomatis setiap 30 detik
