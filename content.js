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

function openAddContactPane() {
  // Always fetch latest info
  const { name, number, nameFound } = getWhatsAppContactInfo();
  let pane = document.getElementById('wa-crm-add-contact-pane');
  if (!pane) {
    pane = document.createElement('div');
    pane.id = 'wa-crm-add-contact-pane';
    pane.style.position = 'fixed';
    pane.style.top = '52px'; // Add padding for top nav bar
    pane.style.right = '64px'; // Move left of sidebar (assume sidebar is 64px wide)
    pane.style.height = 'auto';
    pane.style.minHeight = '320px'; // Optional: minimum height for aesthetics
    pane.style.background = 'rgb(255, 255, 255)';
    pane.style.boxShadow = '-2px 0 8px rgba(0,0,0,0.1)';
    pane.style.zIndex = '9999';
    pane.style.width = '320px';
    pane.style.transition = 'right 0.3s';
    pane.innerHTML = `
      <div style="padding: 20px 18px 18px 18px; font-family: sans-serif; height: 100%; display: flex; flex-direction: column;">
        <div style="padding-bottom: 12px; border-bottom: 1px solid #eee;">
          <div id="wa-crm-pane-name" style="font-weight: 600; font-size: 18px; color: #222;">${name || ''}</div>
          <div id="wa-crm-pane-number" style="font-size: 15px; color: #555; margin-top: 2px;">${number || ''}</div>
        </div>
        <div style="padding: 18px 0 0 0; flex: 1; display: flex; flex-direction: column;">
          <div style="color: #00bfae; font-size: 18px; font-weight: 600; margin-bottom: 8px;">New Contact!</div>
          <div style="color: #888; font-size: 14px; margin-bottom: 16px;">This contact is not saved in your CRM yet. To utilize CRM features such as tickets, activities, and chat sync, create a contact first.</div>
          <label for="wa-crm-contact-name-input" style="font-size: 13px; color: #444; margin-bottom: 6px;">Name</label>
          <input id="wa-crm-contact-name-input" type="text" value="${name || ''}" style="width: calc(100% - 30px); margin: 0 auto 16px auto; display: block; padding: 8px 10px; border-radius: 6px; border: 1px solid #222; background: #f6f6f6; font-size: 15px;" ${nameFound ? 'readonly' : ''} placeholder="${nameFound ? '' : 'Enter name'}" />
          <button id="wa-crm-create-contact-btn" style="background: #2a4bff; color: #fff; border: none; border-radius: 6px; padding: 8px 0; font-size: 15px; font-weight: 600; cursor: pointer; margin-bottom: 12px; width: 140px; align-self: flex-start;">Add to Contacts</button>
          <div id="wa-crm-google-status"></div>
        </div>
        <button id="wa-crm-close-pane" style="position: absolute; top: 10px; right: 10px; background: #eee; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 16px; cursor: pointer;">&times;</button>
      </div>
    `;
    document.body.appendChild(pane);
    document.getElementById('wa-crm-close-pane').onclick = () => {
      pane.style.display = 'none';
    };
    document.getElementById('wa-crm-create-contact-btn').onclick = () => {
      // Removed showContactAddedPopup();
    };
  } else {
    // Always update info if pane already exists
    pane.querySelector('#wa-crm-pane-name').textContent = name || '';
    pane.querySelector('#wa-crm-pane-number').textContent = number || '';
    const nameInput = pane.querySelector('#wa-crm-contact-name-input');
    nameInput.value = name || '';
    if (nameFound) {
      nameInput.setAttribute('readonly', '');
      nameInput.placeholder = '';
    } else {
      nameInput.removeAttribute('readonly');
      nameInput.placeholder = 'Enter name';
    }
    pane.style.display = 'block';
  }
}

function showContactAddedPopup() {
  let popup = document.createElement('div');
  popup.textContent = 'Contact added successfully';
  popup.style.position = 'fixed';
  popup.style.top = '30px';
  popup.style.right = '30px';
  popup.style.background = '#2a4bff';
  popup.style.color = '#fff';
  popup.style.padding = '16px 28px';
  popup.style.borderRadius = '8px';
  popup.style.fontSize = '18px';
  popup.style.fontWeight = '600';
  popup.style.zIndex = '10000';
  popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 1800);
}

function getWhatsAppContactInfo() {
  // Get number
  let numberElem = document.querySelector("#main > header > div.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xeuugli.xtnn1bt.x9v5kkp.xmw7ebm.xrdum7p > div > div > div > div > span");
  let number = numberElem ? numberElem.textContent : '';
  // Get name
  let nameElem = document.querySelector("#app > div > div.x78zum5.xdt5ytf.x5yr21d > div > div._aig-._as6h.x9f619.x1n2onr6.x5yr21d.x6ikm8r.x10wlt62.x17dzmu4.x1i1dayz.x2ipvbc.x1w8yi2h.xpilrb4.x1t7ytsu.x1m2ixmg.x1c4vz4f.x2lah0s.x1ks9yow.xwfak60.x5hsz1j.x17dq4o0.x10e4vud > span > div > span > div > div > section > div.x13mwh8y.x1q3qbx4.x1wg5k15.x3psx0u.xat24cr.x1280gxy.x1cnzs8.x1xnnf8n.xx6bls6.x106a9eq > div.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x6s0dn4 > div.x1evy7pa.x1anpbxc > span > div");
  let name = nameElem ? nameElem.textContent : '';
  let nameFound = !!(nameElem && name);
  return { name, number, nameFound };
}

function addAddContactClickHandler() {
  const addContactIcon = document.getElementById('sidebar-icon-addContact');
  if (addContactIcon) {
    addContactIcon.onclick = function() {
      const pane = document.getElementById('wa-crm-add-contact-pane');
      if (pane && pane.style.display !== 'none') {
        pane.style.display = 'none';
        return;
      }
      openAddContactPane();
    };
  }
}

function addRefreshClickHandler() {
  const refreshIcon = document.getElementById('sidebar-icon-refresh');
  if (refreshIcon) {
    refreshIcon.onclick = function() {
      location.reload();
    };
  }
}

// Automatically open pane for unsaved contacts
const unsavedContactObserver = new MutationObserver(() => {
  // Always fetch latest info
  const { name, number } = getWhatsAppContactInfo();
  if (name && number && /^\d{7,}$/.test(number.replace(/\D/g, ''))) {
    openAddContactPane();
  }
});

const mainChat = document.getElementById('main');
if (mainChat) {
  unsavedContactObserver.observe(mainChat, { childList: true, subtree: true });
}

addPngIconsToSidebar();
addAddContactClickHandler();
addRefreshClickHandler();