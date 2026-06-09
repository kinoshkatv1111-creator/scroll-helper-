const MODULE = 'scroll_down_button';

function getSettings() {
    // Використовуємо глобальні налаштування розширень Таверни
    if (window.extension_settings === undefined) {
        window.extension_settings = {};
    }
    if (window.extension_settings[MODULE] === undefined) {
        window.extension_settings[MODULE] = { enabled: true };
    }
    return window.extension_settings[MODULE];
}

function injectSettingsMenu() {
    const settingsContainer = document.getElementById('extensions_settings');
    if (!settingsContainer || document.getElementById('scroll_extension_drawer')) return;

    const settings = getSettings();

    const inlineDrawer = document.createElement('div');
    inlineDrawer.id = 'scroll_extension_drawer';
    inlineDrawer.classList.add('inline-drawer');

    const inlineDrawerToggle = document.createElement('div');
    inlineDrawerToggle.classList.add('inline-drawer-toggle', 'inline-drawer-header');
    
    const extensionName = document.createElement('b');
    extensionName.textContent = 'Scroll Down Button';
    
    const inlineDrawerIcon = document.createElement('div');
    inlineDrawerIcon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down', 'down');
    
    inlineDrawerToggle.append(extensionName, inlineDrawerIcon);

    const inlineDrawerContent = document.createElement('div');
    inlineDrawerContent.classList.add('inline-drawer-content');

    const enabledCheckboxLabel = document.createElement('label');
    enabledCheckboxLabel.classList.add('checkbox_label');
    
    const enabledCheckbox = document.createElement('input');
    enabledCheckbox.type = 'checkbox';
    enabledCheckbox.checked = settings.enabled;
    
    enabledCheckbox.addEventListener('change', (e) => {
        settings.enabled = e.target.checked;
        const btn = document.getElementById('manual-scroll-btn');
        if (btn) btn.style.display = settings.enabled ? 'flex' : 'none';
        
        // Викликаємо функцію збереження Таверни, якщо вона доступна
        if (typeof window.saveSettingsDebounced === 'function') {
            window.saveSettingsDebounced();
        }
    });
    
    const enabledCheckboxText = document.createElement('span');
    enabledCheckboxText.textContent = ' Enabled';
    
    enabledCheckboxLabel.append(enabledCheckbox, enabledCheckboxText);
    inlineDrawerContent.append(enabledCheckboxLabel);
    
    inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);
    settingsContainer.append(inlineDrawer);
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
    btn.className = 'custom-scroll-down-button';
    btn.innerHTML = '🔽';

    btn.addEventListener('click', () => {
        const chatContainer = document.getElementById('chat');
        if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
    });

    document.body.appendChild(btn);
}

// Запуск без прив'язки до життєвого циклу модулів
function initScrollHelper() {
    injectSettingsMenu();
    createScrollButton();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollHelper);
} else {
    initScrollHelper();
}

// Повторюємо перевірку кожну секунду для надійності
setInterval(initScrollHelper, 1000);
