const BOT_TOKEN = "7282402921:AAEv0r2LDNGDTp-__LwbyzQ3cLJ6Ns2Px6w";

async function getAdminFeed() {
    const feed = document.getElementById('admin-feed-container');
    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-5`);
        const data = await res.json();

        if (data.ok && data.result.length > 0) {
            feed.innerHTML = ''; 
            data.result.reverse().forEach(item => {
                const post = item.channel_post || item.message;
                if (!post) return;

                const card = `
                    <div class="post-card-admin">
                        <div class="post-info">
                            <span class="msg-id">ID: ${post.message_id}</span>
                            <span class="timestamp">${new Date(post.date * 1000).toLocaleTimeString()}</span>
                        </div>
                        <p class="post-text">${post.text || post.caption || "📦 Media Sent"}</p>
                    </div>`;
                feed.innerHTML += card;
            });
        }
    } catch (err) {
        feed.innerHTML = '<p style="text-align:center;">Gagal memuat feed admin.</p>';
    }
}

getAdminFeed();
setInterval(getAdminFeed, 10000); // Update setiap 10 detik
