import { saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';

const MODULE = 'scroll_down_button';
const defaultSettings = { enabled: true };

function getSettings() {
    if (extension_settings[MODULE] === undefined) {
        extension_settings[MODULE] = structuredClone(defaultSettings);
    }
    return extension_settings[MODULE];
}

function setupCheckbox() {
    const checkbox = document.getElementById('scroll_down_button_enabled');
    if (!checkbox) return;

    const settings = getSettings();
    checkbox.checked = settings.enabled;

    // Слідкуємо за натисканням галочки в меню
    checkbox.removeEventListener('change', handleToggle);
    checkbox.addEventListener('change', handleToggle);
}

function handleToggle(e) {
    const settings = getSettings();
    settings.enabled = e.target.checked;
    
    const btn = document.getElementById('manual-scroll-btn');
    if (btn) btn.style.display = settings.enabled ? 'flex' : 'none';
    
    saveSettingsDebounced();
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

// Запуск плагіна
(function () {
    // Налаштовуємо інтерфейс та малюємо кнопку
    setupCheckbox();
    createScrollButton();

    // Постійно перевіряємо кнопку (щоб не зникала при зміні чатів)
    setInterval(() => {
        setupCheckbox();
        createScrollButton();
    }, 1000);
})();
