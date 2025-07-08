// Inject only the top nav bar into WhatsApp Web header
function injectCRMTopBar() {
  const waApp = document.getElementById('app') || document.querySelector('.app');
  if (waApp && !document.getElementById('wa-crm-top-bar')) {
    const topBar = document.createElement('div');
    topBar.id = 'wa-crm-top-bar';
    topBar.innerHTML = `  
      <div class="wa-crm-top-inner">
        <div class="wa-crm-top-buttons">
          <button class="wa-crm-top-btn" id="wa-crm-dashboard-btn">All</button>
          <button class="wa-crm-top-btn" id="wa-crm-tickets-btn">Unread</button>
          <button class="wa-crm-top-btn" id="wa-crm-settings-btn">Active</button>
          <button class="wa-crm-top-btn" id="wa-crm-closed-btn">Dues</button>
          <button class="wa-crm-top-btn" id="wa-crm-followup-btn">Followup</button>
          <button class="wa-crm-top-btn" id="wa-crm-respond-btn">Respond</button>
          <button class="wa-crm-top-btn" id="wa-crm-unknown-btn">Unknown</button>
          <button class="wa-crm-top-btn" id="wa-crm-groups-btn">Groups</button>
          <button class="wa-crm-top-btn" id="wa-crm-businesses-btn">Businesses</button>
          <button class="wa-crm-top-btn" id="wa-crm-brands-btn">Brands</button>
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

// ADDING ICONS TO RIGHT SIDE BAR 

const iconFiles = [
  {src: 'icons/icon1.png', id: 'sidebar-icon-home'},
  {src: 'icons/icon2.png', id: 'sidebar-icon-notification'},
  {src: 'icons/icon3.png', id: 'sidebar-icon-contact'},
  {src: 'icons/icon4.png', id: 'sidebar-icon-contactBook'},
  {src: 'icons/icon5.png', id: 'sidebar-icon-addContact'},
  {src: 'icons/icon6.png', id: 'sidebar-icon-settings'},
  {src: 'icons/icon7.png', id: 'sidebar-icon-refresh'},
  {src: 'icons/icon8.png', id: 'sidebar-icon-adminPanel'},
]

function addPngIconsToSidebar() {
  const sidebar = document.getElementById('wa-crm-right-sidebar');
  if (sidebar) {
    sidebar.innerHTML = ''; // Clear previous content

    iconFiles.forEach(icon => {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'wa-crm-logo-item';
      iconDiv.id = icon.id; // Assign unique id

      const img = document.createElement('img');
      img.src = chrome.runtime.getURL(icon.src);
      img.alt = icon.id;

      iconDiv.appendChild(img);
      sidebar.appendChild(iconDiv);
    });
  }
}

addPngIconsToSidebar();