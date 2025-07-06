// Inject only the top nav bar into WhatsApp Web header
function injectCRMTopBar() {
  const waApp = document.getElementById('app') || document.querySelector('.app');
  if (waApp && !document.getElementById('wa-crm-top-bar')) {
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
    waApp.parentNode.insertBefore(topBar, waApp);
    // Add button events
    topBar.querySelectorAll('.wa-crm-top-btn').forEach(btn => {
      btn.addEventListener('click', () => alert(`Clicked: ${btn.textContent}`));
    });
  }
}

// Inject right-hand sidebar if not present
if (!document.getElementById('wa-crm-right-sidebar')) {
  const sidebar = document.createElement('div');
  sidebar.id = 'wa-crm-right-sidebar';
  document.body.appendChild(sidebar);
}

// Wrap WhatsApp main content to allow scaling and prevent bars from covering UI
function wrapWhatsAppContent() {
  const waApp = document.getElementById('app') || document.querySelector('.app');
  if (waApp && !document.getElementById('wa-crm-wa-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'wa-crm-wa-wrapper';
    waApp.parentNode.insertBefore(wrapper, waApp);
    wrapper.appendChild(waApp);
    // document.querySelector("#app > div > div.x78zum5.xdt5ytf.x5yr21d").style.paddingTop = "52px";
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wrapWhatsAppContent);
} else {
  wrapWhatsAppContent();
}

// Run on load and on navigation changes
injectCRMTopBar();
const observer = new MutationObserver(injectCRMTopBar);
observer.observe(document.body, { childList: true, subtree: true }); 