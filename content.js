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
    // Remove default alert for all top bar buttons
    // Only custom handlers will be added elsewhere
    // Attach Unread handler here
    const unreadBtn = document.getElementById('wa-crm-tickets-btn');
    if (unreadBtn) {
      unreadBtn.onclick = function() {
        const unreadFilter = document.querySelector('#unread-filter');
        if (unreadFilter) {
          unreadFilter.click();
        }
      };
    }
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
  // Only open if the contact is unknown (number is present, name is not found)
  if (!nameFound && number) {
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
            <input id="wa-crm-contact-name-input" type="text" value="${name || ''}" style="width: calc(100% - 30px); margin: 0 auto 16px auto; display: block; padding: 8px 10px; border-radius: 6px; border: 1px solid #222; background: #f6f6f6; font-size: 15px;" placeholder="Enter name" />
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
        alert('Contact added successfully!');
        pane.style.display = 'none';
      };
    } else {
      // Always update info if pane already exists
      pane.querySelector('#wa-crm-pane-name').textContent = name || '';
      pane.querySelector('#wa-crm-pane-number').textContent = number || '';
      const nameInput = pane.querySelector('#wa-crm-contact-name-input');
      nameInput.value = name || '';
      nameInput.placeholder = 'Enter name';
      pane.style.display = 'block';
    }
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
      const { nameFound, number } = getWhatsAppContactInfo();
      // Only open if the contact is unknown (number is present, name is not found)
      if (!nameFound && number) {
        const pane = document.getElementById('wa-crm-add-contact-pane');
        if (pane && pane.style.display !== 'none') {
          pane.style.display = 'none';
          return;
        }
        openAddContactPane();
      }
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

function addAllTopBarHandler() {
  const allBtn = document.getElementById('wa-crm-dashboard-btn');
  if (allBtn) {
    allBtn.onclick = function() {
      const allFilter = document.querySelector('#all-filter');
      if (allFilter) {
        allFilter.click();
      }
    };
  }
}

function addGroupsTopBarHandler() {
  const groupsBtn = document.getElementById('wa-crm-groups-btn');
  if (groupsBtn) {
    groupsBtn.onclick = function() {
      const groupFilter = document.querySelector('#group-filter');
      if (groupFilter) {
        groupFilter.click();
      }
    };
  }
}

function addHomeClickHandler() {
  const homeIcon = document.getElementById('sidebar-icon-home');
  if (homeIcon) {
    homeIcon.onclick = function() {
      const allFilter = document.querySelector('#all-filter');
      if (allFilter) {
        allFilter.click();
      }
    };
  }
}

function openSettingsPane() {
  let pane = document.getElementById('wa-crm-settings-pane');
  if (!pane) {
    pane = document.createElement('div');
    pane.id = 'wa-crm-settings-pane';
    pane.style.position = 'fixed';
    pane.style.top = '52px';
    pane.style.right = '64px';
    pane.style.width = '370px';
    pane.style.height = '100vh';
    pane.style.background = '#fff';
    pane.style.boxShadow = '-2px 0 8px rgba(0,0,0,0.08)';
    pane.style.zIndex = '9999';
    pane.style.fontFamily = 'sans-serif';
    pane.innerHTML = `
      <div style=\"padding: 16px 18px 0 18px; position: relative; height: calc(100vh - 52px); display: flex; flex-direction: column;\">
        <div style=\"position:absolute;top:10px;right:10px;z-index:2;\">
          <button id=\"wa-crm-close-settings-pane\" style=\"background: #eee; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 16px; cursor: pointer;\">&times;</button>
        </div>
        <div style=\"font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #000;\">Utilities</div>
        <div style=\"height: 1px; background: #e6e6e6; margin-bottom: 18px;\"></div>
        <div class=\"wa-crm-settings-row\">
          <span class=\"wa-crm-settings-label\">Hide Chat List Data</span>
          <label class=\"wa-crm-switch\">
            <input type=\"checkbox\" id=\"wa-crm-toggle-hide-chat-list\">
            <span class=\"wa-crm-slider\"></span>
          </label>
        </div>
        <div class=\"wa-crm-settings-row\">
          <span class=\"wa-crm-settings-label\">Hide Top Bar</span>
          <label class=\"wa-crm-switch\">
            <input type=\"checkbox\" id=\"wa-crm-toggle-hide-top-bar\">
            <span class=\"wa-crm-slider\"></span>
          </label>
        </div>
        <div style=\"flex:1\"></div>
      </div>
      <style>
        #wa-crm-settings-pane { min-width: 320px; }
        .wa-crm-settings-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 0 18px 0;
          font-size: 18px;
          color: #4a4a4a;
        }
        .wa-crm-settings-label {
          font-size: 18px;
          color: #4a4a4a;
          font-weight: 400;
        }
        .wa-crm-switch { position: relative; display: inline-block; width: 46px; height: 26px; vertical-align: middle; }
        .wa-crm-switch input { opacity: 0; width: 0; height: 0; }
        .wa-crm-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #e6e6e6; border-radius: 26px; transition: .3s; }
        .wa-crm-slider:before { position: absolute; content: \"\"; height: 20px; width: 20px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: .3s; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .wa-crm-switch input:checked + .wa-crm-slider { background: #2a4bff; }
        .wa-crm-switch input:checked + .wa-crm-slider:before { transform: translateX(20px); background: #fff; }
        .wa-crm-slider {
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
      </style>
    `;
    document.body.appendChild(pane);
    // Add close button handler
    document.getElementById('wa-crm-close-settings-pane').onclick = () => {
      pane.style.display = 'none';
    };
    // Hide Top Bar toggle logic
    const hideTopBarToggle = document.getElementById('wa-crm-toggle-hide-top-bar');
    hideTopBarToggle.onchange = function() {
      const topBar = document.getElementById('wa-crm-top-bar');
      if (this.checked) {
        if (topBar) topBar.style.display = 'none';
      } else {
        if (topBar) topBar.style.display = '';
      }
    };
    // Hide Chat List Data toggle logic
    const hideChatListToggle = document.getElementById('wa-crm-toggle-hide-chat-list');
    hideChatListToggle.onchange = function() {
      let chatList = document.querySelector('.two');
      if (!chatList) {
        chatList = document.querySelector('[role="region"] [tabindex="-1"]');
      }
      if (chatList) {
        chatList.style.filter = this.checked ? 'blur(6px)' : '';
      }
    };
  } else {
    pane.style.display = 'block';
  }
}

function addSettingsClickHandler() {
  const settingsIcon = document.getElementById('sidebar-icon-settings');
  if (settingsIcon) {
    settingsIcon.onclick = function() {
      const pane = document.getElementById('wa-crm-settings-pane');
      if (pane && pane.style.display !== 'none') {
        pane.style.display = 'none';
        return;
      }
      openSettingsPane();
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
addAdminPanelClickHandler();
addAddContactClickHandler();
addRefreshClickHandler();
addAllTopBarHandler();
addGroupsTopBarHandler();
addHomeClickHandler();
addSettingsClickHandler();

function openDashboardPane() {
  let pane = document.getElementById('wa-crm-dashboard-pane');
  if (!pane) {
    pane = document.createElement('div');
    pane.id = 'wa-crm-dashboard-pane';
    pane.style.position = 'fixed';
    pane.style.top = '52px';
    pane.style.right = '64px';
    pane.style.width = '520px';
    pane.style.height = '100vh';
    pane.style.background = '#fff';
    pane.style.boxShadow = '-2px 0 8px rgba(0,0,0,0.10)';
    pane.style.zIndex = '9999';
    pane.style.fontFamily = 'sans-serif';
    pane.style.display = 'flex';
    pane.style.flexDirection = 'column';
    pane.innerHTML = `
      <div style="padding: 18px 12px 0 12px; position: relative; flex: 1; display: flex; flex-direction: column; min-height: 0;">
        <div style="position:absolute;top:10px;right:10px;z-index:2;display:flex;gap:8px;">
          <button id="wa-crm-dashboard-reset" title="Reset" style="background: #eee; color: #e74c3c; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 18px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;">&#8635;</button>
          <button id="wa-crm-close-dashboard-pane" style="background: #eee; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 16px; cursor: pointer;">&times;</button>
        </div>
        <div style="font-size: 26px; font-weight: 700; margin-bottom: 8px; color: #2a4bff;">Admin Dashboard</div>
        <div style="height: 1px; background: #e6e6e6; margin-bottom: 18px;"></div>
        <div style='display:flex;gap:22px;margin-bottom:18px;justify-content:center;'>
          <div style='background:#f6f8ff;border-radius:22px;padding:18px 16px;display:flex;gap:18px;box-shadow:0 2px 8px rgba(0,0,0,0.04);align-items:center;'>
            <div style='display:flex;flex-direction:column;align-items:center;'>
              <canvas id="wa-crm-dashboard-pie-paid" width="90" height="90"></canvas>
              <span style='margin-top:6px;font-size:14px;color:#00bfae;font-weight:600;'>Paid</span>
            </div>
            <div style='display:flex;flex-direction:column;align-items:center;'>
              <canvas id="wa-crm-dashboard-pie-unpaid" width="90" height="90"></canvas>
              <span style='margin-top:6px;font-size:14px;color:#e74c3c;font-weight:600;'>Unpaid</span>
            </div>
          </div>
          <div style='background:#fff7e6;border-radius:22px;padding:18px 16px;display:flex;gap:18px;box-shadow:0 2px 8px rgba(0,0,0,0.04);align-items:center;'>
            <div style='display:flex;flex-direction:column;align-items:center;'>
              <canvas id="wa-crm-dashboard-pie-product1" width="90" height="90"></canvas>
              <span style='margin-top:6px;font-size:14px;color:#673ab7;font-weight:600;'>Product 1</span>
            </div>
            <div style='display:flex;flex-direction:column;align-items:center;'>
              <canvas id="wa-crm-dashboard-pie-product2" width="90" height="90"></canvas>
              <span style='margin-top:6px;font-size:14px;color:#f44336;font-weight:600;'>Product 2</span>
            </div>
          </div>
        </div>
        <form id="wa-crm-dashboard-form" style="display: flex; gap: 10px; margin-bottom: 18px; align-items: flex-end; flex-wrap: wrap;">
          <div style="display: flex; flex-direction: column;">
            <label style="font-size: 13px; color: #444; margin-bottom: 4px;">Rate</label>
            <input id="wa-crm-dashboard-rate" type="number" min="0" step="0.01" style="width: 90px; padding: 7px 8px; border-radius: 6px; border: 1px solid #bbb; background: #f6f6f6; font-size: 15px;" required />
          </div>
          <div style="display: flex; flex-direction: column;">
            <label style="font-size: 13px; color: #444; margin-bottom: 4px;">Quantity</label>
            <input id="wa-crm-dashboard-qty" type="number" min="1" step="1" style="width: 90px; padding: 7px 8px; border-radius: 6px; border: 1px solid #bbb; background: #f6f6f6; font-size: 15px;" required />
          </div>
          <div style="display: flex; flex-direction: column;">
            <label style="font-size: 13px; color: #444; margin-bottom: 4px;">Product</label>
            <select id="wa-crm-dashboard-product" style="width: 110px; padding: 7px 8px; border-radius: 6px; border: 1px solid #bbb; background: #f6f6f6; font-size: 15px; color: #000;">
              <option value="" disabled selected style="color:#000;">Select Product</option>
              <option value="Product 1" style="color:#000;">Product 1</option>
              <option value="Product 2" style="color:#000;">Product 2</option>
            </select>
          </div>
          <div style="display: flex; flex-direction: column;">
            <label style="font-size: 13px; color: #444; margin-bottom: 4px;">Payment Received</label>
            <input id="wa-crm-dashboard-paid" type="checkbox" style="width: 18px; height: 18px; margin-top: 7px;" />
          </div>
          <button type="submit" style="background: #2a4bff; color: #fff; border: none; border-radius: 6px; padding: 8px 18px; font-size: 15px; font-weight: 600; cursor: pointer;">Add</button>
        </form>
        <div style="font-size: 18px; font-weight: 600; color: #222; margin-bottom: 8px;">Transaction History</div>
        <div id="wa-crm-dashboard-history" style="flex:1; overflow-y: auto; max-height: 320px; border: 1px solid #eee; border-radius: 8px; background: #f4f7fa; padding: 10px 0 10px 0;"></div>
      </div>
      <style>
        #wa-crm-dashboard-pane { min-width: 320px; }
        .wa-crm-dashboard-stat {
          background: #f6f8ff;
          border-radius: 8px;
          padding: 16px 18px;
          min-width: 120px;
          flex: 1 1 120px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .wa-crm-dashboard-stat-label {
          font-size: 13px;
          color: #888;
          margin-bottom: 4px;
        }
        .wa-crm-dashboard-stat-value {
          font-size: 22px;
          font-weight: 700;
          color: #2a4bff;
        }
        .wa-crm-dashboard-history-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 18px;
          border-bottom: 1px solid #e0e6ed;
          font-size: 15px;
          background: #eaf1fb;
          border-radius: 6px;
          margin: 6px 10px;
          color: #1a2330;
        }
        .wa-crm-dashboard-history-row:last-child {
          border-bottom: none;
        }
        .wa-crm-dashboard-paid {
          background: #e6f9f5;
          color: #00bfae;
          font-weight: 700;
          border-radius: 10px;
          padding: 2px 10px;
          font-size: 13px;
          display: inline-block;
        }
        .wa-crm-dashboard-unpaid {
          background: #ffeaea;
          color: #e74c3c;
          font-weight: 700;
          border-radius: 10px;
          padding: 2px 10px;
          font-size: 13px;
          display: inline-block;
        }
        #wa-crm-dashboard-history::-webkit-scrollbar {
          width: 8px;
        }
        #wa-crm-dashboard-history::-webkit-scrollbar-thumb {
          background: #dbe6f3;
          border-radius: 8px;
        }
      </style>
    `;
    document.body.appendChild(pane);
    document.getElementById('wa-crm-close-dashboard-pane').onclick = () => {
      pane.style.display = 'none';
    };
    document.getElementById('wa-crm-dashboard-reset').onclick = function() {
      if (confirm('Reset all dashboard data?')) {
        localStorage.removeItem('waCrmDashboardTransactions');
        renderDashboardStats();
        renderDashboardHistory();
        renderDashboardPieCharts();
      }
    };
    // Form logic
    document.getElementById('wa-crm-dashboard-form').onsubmit = function(e) {
      e.preventDefault();
      const rate = parseFloat(document.getElementById('wa-crm-dashboard-rate').value);
      const qty = parseInt(document.getElementById('wa-crm-dashboard-qty').value);
      const paid = document.getElementById('wa-crm-dashboard-paid').checked;
      const product = document.getElementById('wa-crm-dashboard-product').value;
      if (!isNaN(rate) && !isNaN(qty) && rate > 0 && qty > 0 && product) {
        addDashboardTransaction(rate, qty, paid, product);
        document.getElementById('wa-crm-dashboard-rate').value = '';
        document.getElementById('wa-crm-dashboard-qty').value = '';
        document.getElementById('wa-crm-dashboard-paid').checked = false;
        document.getElementById('wa-crm-dashboard-product').selectedIndex = 0;
      }
    };
  } else {
    pane.style.display = 'block';
  }
  renderDashboardStats();
  renderDashboardHistory();
  renderDashboardPieCharts();
}

function getDashboardTransactions() {
  try {
    return JSON.parse(localStorage.getItem('waCrmDashboardTransactions')) || [];
  } catch {
    return [];
  }
}

function setDashboardTransactions(transactions) {
  localStorage.setItem('waCrmDashboardTransactions', JSON.stringify(transactions));
}

function addDashboardTransaction(rate, qty, paid, product) {
  const transactions = getDashboardTransactions();
  const now = new Date();
  // Fetch chat name
  let name = '';
  const nameElem = document.querySelector("#main > header > div.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xeuugli.xtnn1bt.x9v5kkp.xmw7ebm.xrdum7p > div > div > div > div > span");
  if (nameElem) name = nameElem.textContent.trim();
  transactions.unshift({ rate, qty, total: rate * qty, paid, product, name, date: now.toISOString() });
  setDashboardTransactions(transactions);
  renderDashboardStats();
  renderDashboardHistory();
  renderDashboardPieCharts();
}

function renderDashboardStats() {
  const statsDiv = document.getElementById('wa-crm-dashboard-stats');
  if (!statsDiv) return;
  const transactions = getDashboardTransactions();
  // Only count paid transactions
  const paidTx = transactions.filter(tx => tx.paid);
  let totalSales = 0, monthlySales = 0, numTx = paidTx.length, avgSale = 0;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  paidTx.forEach(tx => {
    totalSales += tx.total;
    const txDate = new Date(tx.date);
    if (txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear) {
      monthlySales += tx.total;
    }
  });
  avgSale = numTx ? (totalSales / numTx) : 0;
  statsDiv.innerHTML = `
    <div class="wa-crm-dashboard-stat">
      <div class="wa-crm-dashboard-stat-label">Total Sales</div>
      <div class="wa-crm-dashboard-stat-value">₹${totalSales.toFixed(2)}</div>
    </div>
    <div class="wa-crm-dashboard-stat">
      <div class="wa-crm-dashboard-stat-label">Monthly Sales</div>
      <div class="wa-crm-dashboard-stat-value">₹${monthlySales.toFixed(2)}</div>
    </div>
    <div class="wa-crm-dashboard-stat">
      <div class="wa-crm-dashboard-stat-label">Transactions</div>
      <div class="wa-crm-dashboard-stat-value">${numTx}</div>
    </div>
    <div class="wa-crm-dashboard-stat">
      <div class="wa-crm-dashboard-stat-label">Avg. Sale Value</div>
      <div class="wa-crm-dashboard-stat-value">₹${avgSale.toFixed(2)}</div>
    </div>
  `;
}

function renderDashboardHistory() {
  const historyDiv = document.getElementById('wa-crm-dashboard-history');
  if (!historyDiv) return;
  const transactions = getDashboardTransactions();
  if (transactions.length === 0) {
    historyDiv.innerHTML = '<div style="color:#888; text-align:center; padding: 24px 0;">No transactions yet.</div>';
    return;
  }
  historyDiv.innerHTML = transactions.map((tx, idx) => {
    const d = new Date(tx.date);
    let paidStatus = `<span class="${tx.paid ? 'wa-crm-dashboard-paid' : 'wa-crm-dashboard-unpaid'}">${tx.paid ? 'Payment Received' : 'Unpaid'}</span>`;
    let markPaid = '';
    if (!tx.paid) {
      markPaid = `<label style='margin-left:8px;'><input type='checkbox' class='wa-crm-mark-paid' data-idx='${idx}' /> Mark as Paid</label>`;
    }
    return `<div class="wa-crm-dashboard-history-row">
      <div><b>Name:</b> ${tx.name || '-'}</div>
      <div><b>Product:</b> ${tx.product || '-'}</div>
      <div><b>Date:</b> ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div><b>Amount:</b> ₹${tx.rate} × ${tx.qty} = <b>₹${tx.total}</b></div>
      <div><b>Status:</b> ${paidStatus} ${markPaid}</div>
    </div>`;
  }).join('');
  // Add event listeners for mark as paid checkboxes
  document.querySelectorAll('.wa-crm-mark-paid').forEach(cb => {
    cb.addEventListener('change', function() {
      if (this.checked) {
        const idx = parseInt(this.getAttribute('data-idx'));
        const txs = getDashboardTransactions();
        if (txs[idx] && !txs[idx].paid) {
          txs[idx].paid = true;
          setDashboardTransactions(txs);
          renderDashboardStats();
          renderDashboardHistory();
          renderDashboardPieCharts();
        }
      }
    });
  });
}

function renderDashboardPieCharts() {
  // Paid chart
  const canvasPaid = document.getElementById('wa-crm-dashboard-pie-paid');
  const canvasUnpaid = document.getElementById('wa-crm-dashboard-pie-unpaid');
  const canvasProduct1 = document.getElementById('wa-crm-dashboard-pie-product1');
  const canvasProduct2 = document.getElementById('wa-crm-dashboard-pie-product2');
  if (!canvasPaid || !canvasUnpaid || !canvasProduct1 || !canvasProduct2) return;
  const ctxPaid = canvasPaid.getContext('2d');
  const ctxUnpaid = canvasUnpaid.getContext('2d');
  const ctxProduct1 = canvasProduct1.getContext('2d');
  const ctxProduct2 = canvasProduct2.getContext('2d');
  const transactions = getDashboardTransactions();
  const paid = transactions.filter(t => t.paid).length;
  const unpaid = transactions.length - paid;
  const product1 = transactions.filter(t => t.product === 'Product 1').length;
  const product2 = transactions.filter(t => t.product === 'Product 2').length;
  const total = paid + unpaid;
  // Chart settings
  const cx = 45, cy = 45, r = 36, thickness = 8;
  function drawDonut(ctx, value, total, gradientColors, pointerColor) {
    ctx.clearRect(0, 0, 90, 90);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.stroke();
    if (total > 0 && value > 0) {
      const startAngle = -0.5 * Math.PI;
      const endAngle = startAngle + (value / total) * 2 * Math.PI;
      const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      grad.addColorStop(0, gradientColors[0]);
      grad.addColorStop(1, gradientColors[1]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = grad;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.stroke();
      const px = cx + r * Math.cos(endAngle);
      const py = cy + r * Math.sin(endAngle);
      ctx.beginPath();
      ctx.arc(px, py, thickness / 2 + 1, 0, 2 * Math.PI);
      ctx.fillStyle = pointerColor;
      ctx.shadowColor = pointerColor;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  drawDonut(ctxPaid, paid, total, ['#00e6d0', '#0099ff'], '#00bfae');
  ctxPaid.font = '16px sans-serif';
  ctxPaid.fillStyle = '#00bfae';
  ctxPaid.textAlign = 'center';
  ctxPaid.textBaseline = 'middle';
  ctxPaid.fillText(`${paid}`, cx, cy);
  drawDonut(ctxUnpaid, unpaid, total, ['#ffb199', '#ff0844'], '#e74c3c');
  ctxUnpaid.font = '16px sans-serif';
  ctxUnpaid.fillStyle = '#e74c3c';
  ctxUnpaid.textAlign = 'center';
  ctxUnpaid.textBaseline = 'middle';
  ctxUnpaid.fillText(`${unpaid}`, cx, cy);
  // Use more visible, high-contrast colors for product donuts
  drawDonut(ctxProduct1, product1, product1 + product2, ['#673ab7', '#00bcd4'], '#673ab7');
  ctxProduct1.font = '16px sans-serif';
  ctxProduct1.fillStyle = '#673ab7';
  ctxProduct1.textAlign = 'center';
  ctxProduct1.textBaseline = 'middle';
  ctxProduct1.fillText(`${product1}`, cx, cy);
  drawDonut(ctxProduct2, product2, product1 + product2, ['#f44336', '#ffeb3b'], '#f44336');
  ctxProduct2.font = '16px sans-serif';
  ctxProduct2.fillStyle = '#f44336';
  ctxProduct2.textAlign = 'center';
  ctxProduct2.textBaseline = 'middle';
  ctxProduct2.fillText(`${product2}`, cx, cy);
}

function addAdminPanelClickHandler() {
  const adminIcon = document.getElementById('sidebar-icon-adminPanel');
  if (adminIcon) {
    adminIcon.onclick = function() {
      const pane = document.getElementById('wa-crm-dashboard-pane');
      if (pane && pane.style.display !== 'none') {
        pane.style.display = 'none';
        return;
      }
      openDashboardPane();
    };
  }
}

