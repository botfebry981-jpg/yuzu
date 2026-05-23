// ========================================================
// 1. DEKLARASI VARIABEL GLOBAL & ELEMEN HTML
// ========================================================
const tg = window.Telegram.WebApp;

const roleSelect = document.getElementById('roleSelect');
const passwordGroup = document.getElementById('passwordGroup');
const nameGroup = document.getElementById('nameGroup');
const errorMsg = document.getElementById('errorMsg');
const loginForm = document.getElementById('loginForm');
const userNameInput = document.getElementById('userNameInput');

// Ambil data user dari sistem Telegram
const userTelegram = tg.initDataUnsafe?.user;


// ========================================================
// 2. FUNGSI INISIALISASI (Menyiapkan Aplikasi Pertama Kali)
// ========================================================
function inisialisasiAplikasi() {
    tg.ready();   // Pastikan SDK Telegram siap
    tg.expand();  // Buka Mini App langsung layar penuh
}


// ========================================================
// 3. FUNGSI TAMPILAN DINAMIS (Mengatur Switch Kolom Input)
// ========================================================
function aturTampilanForm() {
    const role = roleSelect.value;
    errorMsg.style.display = 'none';

    if (role === 'user') {
        passwordGroup.style.display = 'none';
        nameGroup.style.display = 'block';   
        
        // Isi nama otomatis dari data Telegram
        if (userTelegram) {
            userNameInput.value = userTelegram.first_name;
        } else {
            userNameInput.value = "User Luar Telegram";
        }
    } else {
        passwordGroup.style.display = 'block';
        nameGroup.style.display = 'none';    
    }
}


// ========================================================
// 4. FUNGSI VALIDASI LOGIN (Inti Pemeriksaan Hak Akses)
// ========================================================
function prosesValidasiLogin(role, password) {
    if (role === 'admin') {
        if (password === '4567') {
            tg.showAlert("Login Berhasil sebagai Admin!");
            window.location.href = 'admin.html';
        } else {
            errorMsg.style.display = 'block';
        }
    }
    else if (role === 'it') {
        if (password === '7654') {
            tg.showAlert("Login Berhasil sebagai Tim IT!");
            window.location.href = 'it.html';
        } else {
            errorMsg.style.display = 'block';
        }
    }
    else if (role === 'user') {
        const nama = userNameInput.value;
        tg.showAlert(`Selamat datang di aplikasi, ${nama}!`);
        window.location.href = 'user.html';
    }
}




// ========================================================
// 5. EVENT LISTENER (Penggerak Utama Aplikasi)
// ========================================================

// Jalankan inisialisasi awal saat script dimuat
inisialisasiAplikasi();

// Deteksi jika user mengganti pilihan role di dropdown menu
roleSelect.addEventListener('change', aturTampilanForm);

// Deteksi jika user menekan tombol "Lanjutkan"
loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah halaman reload otomatis
    
    const roleTerpilih = roleSelect.value;
    const passwordInput = document.getElementById('password').value;

    // Kirim data ke fungsi validasi
    prosesValidasiLogin(roleTerpilih, passwordInput);
});

