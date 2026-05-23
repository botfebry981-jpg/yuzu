let currentFile = 'index.html';
let fileSHA = ''; 

function showToast(message) {
    const toast = document.getElementById('statusToast');
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function getGitHubConfig() {
    return {
        token: document.getElementById('ghToken').value.trim(),
        owner: document.getElementById('ghOwner').value.trim(),
        repo: document.getElementById('ghRepo').value.trim()
    };
}

function selectFile(filename, element) {
    document.querySelectorAll('.file-chip').forEach(chip => chip.classList.remove('selected'));
    element.classList.add('selected');
    currentFile = filename;
    fetchFileFromGitHub();
}

// Helper: Decode Base64 UTF-8 secara aman (Mendukung Emoji)
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// Helper: Encode String ke Base64 UTF-8 secara aman
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

// MEMBACA FILE DARI GITHUB
async function fetchFileFromGitHub() {
    const config = getGitHubConfig();
    const editor = document.getElementById('codeEditor');
    
    if (!config.token) {
        editor.value = "// Masukkan GitHub Token Anda pada kolom di atas untuk memuat file '" + currentFile + "'.";
        return;
    }

    editor.value = "// Sedang mengambil file '" + currentFile + "' dari repository...";
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${currentFile}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 404) {
            editor.value = "// File tidak ditemukan. Tulis kode baru lalu klik simpan untuk membuatnya.";
            fileSHA = '';
            return;
        }

        if (!response.ok) throw new Error("Akses ditolak. Periksa kevalidan Token.");

        const data = await response.json();
        fileSHA = data.sha; 
        
        editor.value = b64DecodeUnicode(data.content.replace(/\s/g, ''));
        showToast(`Berhasil memuat ${currentFile}`);

    } catch (error) {
        editor.value = `// Gagal memuat file: ${error.message}`;
        fileSHA = ''; 
    }
}

// MENYIMPAN / PUSH UPDATE KE GITHUB
async function saveToGitHub() {
    const config = getGitHubConfig();
    const contentCode = document.getElementById('codeEditor').value;
    const btn = document.getElementById('btnUpdate');

    if (!config.token) {
        alert("Harap isi GitHub Personal Access Token (PAT) terlebih dahulu!");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Melakukan Commit...`;

    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${currentFile}`;
    
    try {
        // Ambil SHA terbaru secara real-time sebelum push untuk mencegah tabrakan/konflik data
        const checkRes = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (checkRes.ok) {
            const checkData = await checkRes.json();
            fileSHA = checkData.sha;
        }
    } catch(e) {}

    const base64Content = b64EncodeUnicode(contentCode);

    const bodyData = {
        message: `Perbaikan skrip ${currentFile} via Panel Kontrol IT Mini App`,
        content: base64Content
    };

    if (fileSHA) bodyData.sha = fileSHA;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(bodyData)
        });

        const resData = await response.json();

        if (response.ok) {
            showToast(`Sukses! ${currentFile} berhasil dicommit.`);
            fileSHA = resData.content.sha; 
        } else {
            alert("Gagal Push ke GitHub: " + resData.message);
        }

    } catch (error) {
        alert("Kesalahan Jaringan: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Amankan & Update Kode`;
    }
}

// Otomatis memicu pembacaan file jika mendeteksi token selesai diinput
document.getElementById('ghToken').addEventListener('change', () => {
    fetchFileFromGitHub();
});


