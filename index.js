const MODULE = 'scroll_down_button';

function getSettings() {
    if (window.extensions_settings === undefined) {
        window.extensions_settings = {};
    }
    if (window.extensions_settings[MODULE] === undefined) {
        window.extensions_settings[MODULE] = { enabled: true };
    }
    return window.extensions_settings[MODULE];
}

function createScrollButton() {
    const settings = getSettings();
    const existingBtn = document.getElementById('manual-scroll-btn');
    
    if (!settings.enabled) {
        if (existingBtn) existingBtn.remove();
        return;
    }
    
    if (existingBtn) return;
    
    const btn = document.createElement('div');
    btn.id = 'manual-scroll-btn';
    btn.className = 'custom-scroll-down-button'; // Клас для стилів з style.css
    btn.innerHTML = '🔽';

    btn.addEventListener('click', () => {
        const chatContainer = document.getElementById('chat');
        if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });

    document.body.appendChild(btn);
}

function addExtensionSettings() {
    const settingsContainer = document.getElementById('extensions_settings');
    if (!settingsContainer || document.getElementById('scroll_extension_drawer')) return;

    const settings = getSettings();

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
        const existingBtn = document.getElementById('manual-scroll-btn');
        if (existingBtn) existingBtn.style.display = settings.enabled ? 'flex' : 'none';
        if (window.saveSettingsDebounced) window.saveSettingsDebounced();
    });
    
    const enabledCheckboxText = document.createElement('span');
    enabledCheckboxText.textContent = ' Enabled';
    
    enabledCheckboxLabel.append(enabledCheckbox, enabledCheckboxText);
    inlineDrawerContent.append(enabledCheckboxLabel);
}

(function () {
    // Чекаємо повного завантаження сторінки Таверни
    const init = () => {
        addExtensionSettings();
        createScrollButton();
        setInterval(createScrollButton, 1000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
