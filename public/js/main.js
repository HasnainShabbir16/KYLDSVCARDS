// main.js - Handles form, live preview, and animations for KYLDSVCARDS
const form = document.getElementById('cardForm');
const previewName = document.getElementById('previewName');
const previewTitle = document.getElementById('previewTitle');
const previewPhone = document.getElementById('previewPhone');
const previewEmail = document.getElementById('previewEmail');
const previewWebsite = document.getElementById('previewWebsite');
const previewImg = document.getElementById('previewImg');
const imageInput = document.getElementById('imageInput');

const defaultAvatar = '/default-avatar.png';

// Live preview
form.name.addEventListener('input', e => {
  previewName.textContent = e.target.value || 'John Doe';
});
form.title.addEventListener('input', e => {
  previewTitle.textContent = e.target.value || '';
});
form.phone.addEventListener('input', e => {
  previewPhone.textContent = e.target.value || '';
});
form.email.addEventListener('input', e => {
  previewEmail.textContent = e.target.value || '';
});
form.website.addEventListener('input', e => {
  previewWebsite.textContent = e.target.value || '';
});
imageInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e2 => { previewImg.src = e2.target.result; };
    reader.readAsDataURL(file);
  } else {
    previewImg.src = defaultAvatar;
  }
});

// Handle form submit
form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(form);
  const res = await fetch('/create-card', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (data.success) {
    document.getElementById('qrHolder').innerHTML = `<img src='${data.qrcode}' class='w-full h-full object-contain qr-anim' />`;
    document.getElementById('goToCardBtn').href = data.url;
    document.getElementById('successModal').classList.remove('hidden');
  } else {
    alert('Error: ' + (data.error || 'Failed to create card.'));
  }
});
// Modal dismiss
window.addEventListener('click', e => {
  if (e.target.id === 'successModal') {
    document.getElementById('successModal').classList.add('hidden');
  }
});
