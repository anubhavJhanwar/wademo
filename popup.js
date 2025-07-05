const buttons = document.querySelectorAll('.header-btn');
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chrome.tabs.create({ url: 'about:blank' });
  });
});

const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    alert('Logged out!');
  });
} 