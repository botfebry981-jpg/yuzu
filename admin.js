let myChart = null;

// Eksekusi halaman utama admin saat pertama kali dimuat
window.onload = () => gantiMenu('beranda');

function gantiMenu(pilihan) {
    // Perbarui penanda visual tombol menu bawah yang aktif
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${pilihan}`);
    if(activeBtn) activeBtn.classList.add('active');

    const topStats = document.getElementById('topStatsArea');
    const content = document.getElementById('mainContentBox');

    // Hapus grafik lama untuk membebaskan ruang memori browser
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }

    // Sistem pengalihan konten halaman internal
    switch(pilihan) {
        case 'beranda':
            renderBeranda(topStats, content);
            break;
        case 'dashboard':
            renderDashboard(topStats, content);
            break;
        case 'daftar-bot':
            renderDaftarBot(topStats, content);
            break;
    }
}

function renderBeranda(stats, content) {
    stats.innerHTML = '';
    content.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <i class="fa-solid fa-house" style="font-size: 40px; color: var(--primary); margin-bottom: 15px;"></i>
            <h3>Selamat Datang!</h3>
            <p style="color: #718096; font-size: 13px; margin-top: 8px;">Sistem siap digunakan. Silakan pilih menu di bawah.</p>
        </div>`;
}

function renderDashboard(stats, content) {
    stats.innerHTML = `
        <div class="stats-grid-premium">
            <div class="card-premium"><div class="card-value">$154k</div><div style="font-size:10px; color:var(--text-gray)">Total Sales</div></div>
            <div class="card-premium"><div class="card-value">6.4k</div><div style="font-size:10px; color:var(--text-gray)">Visits</div></div>
        </div>`;
    content.innerHTML = `<h4 style="margin-bottom:15px; font-size:14px;">Statistik Aktivitas</h4><canvas id="salesChart" style="max-height:200px"></canvas>`;
    
    const ctx = document.getElementById('salesChart').getContext('2d');
    myChart = new Chart(ctx, { 
        type: 'bar', 
        data: { 
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'], 
            datasets: [{ label: 'Sales', data: [45, 56, 39, 70, 85], backgroundColor: '#3182ce', borderRadius: 5 }] 
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

function renderDaftarBot(stats, content) {
    stats.innerHTML = '';
    content.innerHTML = `
        <h4 style="margin-bottom:15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Bot Terhubung</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="padding: 12px; background: #f8fafc; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fa-solid fa-robot"></i> Bot AI Utama</span>
                <span style="color: green; font-size: 11px;">● Online</span>
            </div>
        </div>`;
}
