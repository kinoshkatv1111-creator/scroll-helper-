import { saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';

const MODULE = 'scroll_down_button';

const defaultSettings = {
    enabled: true,
};

function getSettings() {
    if (extension_settings[MODULE] === undefined) {
        extension_settings[MODULE] = structuredClone(defaultSettings);
    }
    return extension_settings[MODULE];
}

function toggleButtonVisibility(enabled) {
    const existingBtn = document.getElementById('manual-scroll-btn');
    if (enabled) {
        if (existingBtn) {
            existingBtn.style.display = 'flex';
        }
    } else {
        if (existingBtn) {
            existingBtn.style.display = 'none';
        }
    }
}

function addExtensionSettings(settings) {
    const settingsContainer = document.getElementById('extensions_settings');
    if (!settingsContainer) return;

    // Перевіряємо, чи меню вже додано, щоб не дублювати
    if (document.getElementById('scroll_extension_drawer')) return;

    const inlineDrawer = document.createElement('div');
    inlineDrawer.id = 'scroll_extension_drawer';
    inlineDrawer.classList.add('inline-drawer');
    settingsContainer.append(inlineDrawer);

    const inlineDrawerToggle = document.createElement('div');
    inlineDrawerToggle.classList.add('inline-drawer-toggle', 'inline-drawer-header');

    const extensionName = document.createElement('b');
    extensionName.textContent = 'Scroll Down Button';

    const inlineDrawerIcon = document.createElement('div');
    inlineDrawerIcon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down', 'down');

    inlineDrawerToggle.append(extensionName, inlineDrawerIcon);

    const inlineDrawerContent = document.createElement('div');
    inlineDrawerContent.classList.add('inline-drawer-content');

    inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);

    const enabledCheckboxLabel = document.createElement('label');
    enabledCheckboxLabel.classList.add('checkbox_label');
    
    const enabledCheckbox = document.createElement('input');
    enabledCheckbox.type = 'checkbox';
    enabledCheckbox.checked = settings.enabled;
    enabledCheckbox.addEventListener('change', () => {
        settings.enabled = enabledCheckbox.checked;
        toggleButtonVisibility(settings.enabled);
        saveSettingsDebounced();
    });
    
    const enabledCheckboxText = document.createElement('span');
    enabledCheckboxText.textContent = ' Enabled';
    
    enabledCheckboxLabel.append(enabledCheckbox, enabledCheckboxText);
    inlineDrawerContent.append(enabledCheckboxLabel);
}

function createScrollButton() {
    const settings = getSettings();
    const existingBtn = document.getElementById('manual-scroll-btn');
    
    // Якщо вимкнено в налаштуваннях — видаляємо або ховаємо кнопку
    if (!settings.enabled) {
        if (existingBtn) existingBtn.remove();
        return;
    }
    
    // Якщо увімкнено і кнопка вже є — нічого не робимо
    if (existingBtn) return;
    
    const btn = document.createElement('div');
    btn.id = 'manual-scroll-btn';
    btn.innerHTML = '🔽';
    btn.style.position = 'fixed';
    btn.style.right = '20px';
    btn.style.bottom = '90px';
    btn.style.width = '45px';
    btn.style.height = '45px';
    btn.style.background = '#2a2a2a';
    btn.style.color = '#ffffff';
    btn.style.border = '2px solid #ff4500'; // Яскравий помаранчевий обідок, щоб точно помітити її
    btn.style.borderRadius = '50%';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.fontSize = '22px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '99999';
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';

    btn.addEventListener('click', () => {
        const chatContainer = document.getElementById('chat');
        if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
    });

    document.body.appendChild(btn);
}

(function () {
    const settings = getSettings();
    addExtensionSettings(settings);
    
    // Перевіряємо і малюємо кнопку кожну секунду, щоб вона не зникала при зміні чатів
    setInterval(createScrollButton, 1000);
})();
