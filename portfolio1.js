// Smooth scroll for navbar
document.querySelectorAll('#navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Editable + Downloadable Portfolio
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const downloadBtn = document.getElementById('downloadBtn');
const editableSections = document.querySelectorAll('.editable-section');

// Enable edit mode
editBtn.addEventListener('click', () => {
    editableSections.forEach(sec => {
        sec.setAttribute('contenteditable', 'true');
        sec.classList.add('editing');
    });
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
});

// Save edits
saveBtn.addEventListener('click', () => {
    editableSections.forEach(sec => {
        sec.setAttribute('contenteditable', 'false');
        sec.classList.remove('editing');
    });
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    alert('✅ Changes saved! Now you can download your updated portfolio.');
});

// Download updated HTML
downloadBtn.addEventListener('click', () => {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'MyEditedPortfolio.html';
    a.click();
});

// ===== Editable Photo Section =====
const photoUpload = document.getElementById('photoUpload');
const changePhotoBtn = document.getElementById('changePhotoBtn');
const profilePhoto = document.getElementById('profilePhoto');

// Open file selector
changePhotoBtn.addEventListener('click', () => {
    photoUpload.click();
});

// Update photo preview
photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            profilePhoto.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});