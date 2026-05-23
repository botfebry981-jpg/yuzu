// Gunakan huruf kecil 'const' agar tidak error
const BOT_TOKEN = "7282402921:AAEv0r2LDNGDTp-__LwbyzQ3cLJ6Ns2Px6w";

async function getAdminFeed() {
    // Pastikan ID ini sama dengan yang ada di beranda.html
    const feed = document.getElementById('admin-feed-container');
    if (!feed) return; 

    try {
        // Mengambil 5 update terakhir dari Telegram API
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-5`);
        const data = await res.json();

        if (data.ok && data.result.length > 0) {
            feed.innerHTML = ''; 
            // Membalik urutan agar pesan terbaru muncul di paling atas
            data.result.reverse().forEach(item => {
                const post = item.channel_post || item.message;
                if (!post) return;

                // Membuat tampilan kartu untuk setiap pesan
                const card = `
                    <div class="post-card-admin" style="background:white; margin-bottom:10px; padding:15px; border-radius:8px; border-left:4px solid #0088cc;">
                        <div class="post-info" style="display:flex; justify-content:space-between; font-size:11px; color:#999; margin-bottom:8px;">
                            <span>ID: ${post.message_id}</span>
                            <span>${new Date(post.date * 1000).toLocaleTimeString('id-ID')}</span>
                        </div>
                        <p class="post-text" style="margin:0; font-size:14px; color:#333; line-height:1.5;">
                            ${post.text || post.caption || "📦 Media (Foto/Video)"}
                        </p>
                    </div>`;
                feed.innerHTML += card;
            });
        } else {
            feed.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">Belum ada aktivitas baru di bot.</p>';
        }
    } catch (err) {
        feed.innerHTML = '<p style="text-align:center; color:red; padding:20px;">Gagal memuat feed. Periksa koneksi atau Token Bot.</p>';
    }
}

// Menjalankan fungsi saat halaman dibuka
getAdminFeed();

// Melakukan pembaruan otomatis setiap 10 detik
setInterval(getAdminFeed, 10000);
