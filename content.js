// Inject only the top nav bar into WhatsApp Web header
function injectCRMTopBar() {
  const waHeader = document.querySelector('header[role="banner"], header');
  if (waHeader && !waHeader.querySelector('#wa-crm-top-bar')) {
    const topBar = document.createElement('div');
    topBar.id = 'wa-crm-top-bar';
    topBar.innerHTML = `
      <div class="wa-crm-top-inner">
        <div class="wa-crm-top-buttons">
          <button class="wa-crm-top-btn" id="wa-crm-dashboard-btn">Dashboard</button>
          <button class="wa-crm-top-btn" id="wa-crm-tickets-btn">Tickets</button>
          <button class="wa-crm-top-btn" id="wa-crm-settings-btn">Settings</button>
          <button class="wa-crm-top-btn" id="wa-crm-flags-btn">Flags</button>
        </div>
      </div>
    `;
    waHeader.insertBefore(topBar, waHeader.firstChild);
    // Add button events
    topBar.querySelectorAll('.wa-crm-top-btn').forEach(btn => {
      btn.addEventListener('click', () => alert(`Clicked: ${btn.textContent}`));
    });
  }
}

// Run on load and on navigation changes
injectCRMTopBar();
const observer = new MutationObserver(injectCRMTopBar);
observer.observe(document.body, { childList: true, subtree: true }); 