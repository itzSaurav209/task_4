// Smooth scroll for navbar
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Scroll progress bar
window.addEventListener('scroll', () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = (scrolled / height) * 100 + '%';
});

// Intersection fade-in animation
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity .6s ease, transform .6s ease';
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(24px)';
    observer.observe(s);
});

// Edit / Save functionality + image replace
const editBtn = document.getElementById('editBtn');
const downloadBtn = document.getElementById('downloadBtn');
const imgInput = document.getElementById('imgInput');
let isEditing = false;

function setEditable(state) {
    document.querySelectorAll('[data-editable]').forEach(el => {
        el.contentEditable = state;
        el.classList.toggle('editable-on', state);
    });
}

function enableImageReplace(enable) {
    const imgs = document.querySelectorAll('.portrait');
    imgs.forEach(img => {
        img.style.cursor = enable ? 'pointer' : 'default';
        img.onclick = enable ? () => (imgInput._targetImg = img, imgInput.click()) : null;
    });
}

imgInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        const target = imgInput._targetImg;
        if (target) {
            target.src = evt.target.result;
            // keep both home and about previews in sync if needed
            if (target.id === 'homeProfile') {
                const about = document.getElementById('aboutProfile');
                if (about) about.src = evt.target.result;
            } else if (target.id === 'aboutProfile') {
                const home = document.getElementById('homeProfile');
                if (home) home.src = evt.target.result;
            }
        }
    };
    reader.readAsDataURL(file);
    imgInput.value = '';
});

editBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    setEditable(isEditing);
    enableImageReplace(isEditing);
    editBtn.textContent = isEditing ? '💾 Save' : '✏️ Edit';
});

// ---- PDF Download (improved alignment technique) ----
downloadBtn.addEventListener('click', async() => {
    const actionBar = document.querySelector('.action-buttons');
    const nav = document.querySelector('.navbar');
    // hide action-buttons so they don't appear in PDF
    if (actionBar) actionBar.style.visibility = 'hidden';
    // temporarily unfix navbar so it won't overlay content in PDF
    const prevNavPosition = nav ? nav.style.position : '';
    if (nav) nav.style.position = 'static';

    // Also temporarily remove transitions/animations to get a stable render
    const origTransition = document.body.style.transition;
    document.body.style.transition = 'none';

    // Choose the element to export (full body so it looks like the browser view)
    const element = document.body;

    // html2pdf options
    const opt = {
        margin: 0.3,
        filename: 'portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            // Increase width so html2canvas captures full width (helps keep layout)
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
        // Wait a tick to let styles apply after changing nav position
        await new Promise(r => setTimeout(r, 150));
        await html2pdf().set(opt).from(element).save();
    } catch (err) {
        console.error('PDF generation error:', err);
        alert('Error creating PDF — check console for details.');
    } finally {
        // restore visibility & navbar position and transitions
        if (actionBar) actionBar.style.visibility = 'visible';
        if (nav) nav.style.position = prevNavPosition || 'fixed';
        document.body.style.transition = origTransition || '';
    }
});