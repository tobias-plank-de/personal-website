// Portfolio Website - JavaScript für Interaktivität
// Tobias - System Administrator & Politician

// State Management
let currentMode = 'work';
let currentLang = 'de';
let currentTheme = 'auto';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Load saved preferences from localStorage
    loadPreferences();

    // Initialize event listeners
    initEventListeners();

    // Apply initial state
    updateMode(currentMode);
    updateLanguage(currentLang);
    updateTheme(currentTheme);

    // Load initial content from markdown files
    await loadAllContent();

    // Load profile images with format detection
    await loadProfileImages();
});

// Load preferences from localStorage
function loadPreferences() {
    const savedMode = localStorage.getItem('portfolio-mode');
    const savedLang = localStorage.getItem('portfolio-lang');
    const savedTheme = localStorage.getItem('portfolio-theme');

    if (savedMode) currentMode = savedMode;
    if (savedLang) currentLang = savedLang;
    if (savedTheme) currentTheme = savedTheme;

    // Set UI elements to match saved preferences
    const themeSlider = document.getElementById('themeSlider');
    if (themeSlider) themeSlider.value = getThemeValue(currentTheme);

    // Set language dropdown text
    const langSelect = document.getElementById('customLangSelect');
    if (langSelect) {
        const selectedText = langSelect.querySelector('.select-selected');
        if (selectedText) {
            selectedText.textContent = currentLang === 'de' ? 'Deutsch' : 'English';
        }
    }
}

// Save preferences to localStorage
function savePreferences() {
    localStorage.setItem('portfolio-mode', currentMode);
    localStorage.setItem('portfolio-lang', currentLang);
    localStorage.setItem('portfolio-theme', currentTheme);
}

// Initialize all event listeners
function initEventListeners() {
    // Initialize custom dropdowns
    initCustomSelect();
    initCustomLangSelect();

    // Settings Button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleSettingsMenu();
        });
    }

    // Close settings menu when clicking outside
    document.addEventListener('click', (e) => {
        const settingsMenu = document.getElementById('settingsMenu');
        const settingsBtnElement = document.getElementById('settingsBtn');

        if (settingsMenu && settingsBtnElement &&
            !settingsMenu.contains(e.target) &&
            !settingsBtnElement.contains(e.target)) {
            settingsMenu.classList.add('hidden');
        }
    });

    // Theme Slider
    const themeSlider = document.getElementById('themeSlider');
    if (themeSlider) {
        themeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            currentTheme = getThemeName(value);
            updateTheme(currentTheme);
            savePreferences();
        });
    }

    // Logo Click - Go to home
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => {
            showHome();
        });
    }

    // Imprint Link
    const imprintLink = document.getElementById('imprintLink');
    if (imprintLink) {
        imprintLink.addEventListener('click', (e) => {
            e.preventDefault();
            showImprint();
        });
    }

    // Search Bar (placeholder for future functionality)
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            // Search functionality can be implemented here later
            console.log('Search:', e.target.value);
        });
    }

    // Profile Image Click - Open Modal
    attachProfileImageListeners();

    // Close modal button
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.stopPropagation();
            closeImageModal();
        });
    }

    // Close modal when clicking outside the image
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

// Attach profile image event listeners
function attachProfileImageListeners() {
    const profileImage = document.getElementById('profileImage');
    const profileImagePolitics = document.getElementById('profileImagePolitics');
    const profileImagePersonal = document.getElementById('profileImagePersonal');

    if (profileImage) {
        // Remove old listener by cloning
        const newProfileImage = profileImage.cloneNode(true);
        profileImage.parentNode.replaceChild(newProfileImage, profileImage);

        newProfileImage.addEventListener('click', () => {
            openImageModal(newProfileImage.src);
        });
    }

    if (profileImagePolitics) {
        // Remove old listener by cloning
        const newProfileImagePolitics = profileImagePolitics.cloneNode(true);
        profileImagePolitics.parentNode.replaceChild(newProfileImagePolitics, profileImagePolitics);

        newProfileImagePolitics.addEventListener('click', () => {
            openImageModal(newProfileImagePolitics.src);
        });
    }

    if (profileImagePersonal) {
        // Remove old listener by cloning
        const newProfileImagePersonal = profileImagePersonal.cloneNode(true);
        profileImagePersonal.parentNode.replaceChild(newProfileImagePersonal, profileImagePersonal);

        newProfileImagePersonal.addEventListener('click', () => {
            openImageModal(newProfileImagePersonal.src);
        });
    }
}

// Update mode (work/politics)
function updateMode(mode) {
    currentMode = mode;
    document.body.setAttribute('data-mode', mode);

    // Update mode content visibility
    const workContent = document.querySelectorAll('.work-content, .work-feed');
    const politicsContent = document.querySelectorAll('.politics-content, .politics-feed');
    const personalContent = document.querySelectorAll('.personal-content, .personal-feed');

    // Remove active from all
    workContent.forEach(el => el.classList.remove('active'));
    politicsContent.forEach(el => el.classList.remove('active'));
    personalContent.forEach(el => el.classList.remove('active'));

    // Add active to current mode
    if (mode === 'work') {
        workContent.forEach(el => el.classList.add('active'));
    } else if (mode === 'politics') {
        politicsContent.forEach(el => el.classList.add('active'));
    } else if (mode === 'personal') {
        personalContent.forEach(el => el.classList.add('active'));
    }

    // Update mode selector options text
    updateModeOptions();
}

// Update language
function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);

    // Update all elements with data-de and data-en attributes
    const translatable = document.querySelectorAll('[data-de][data-en]');
    translatable.forEach(el => {
        const translation = el.getAttribute(`data-${lang}`);
        if (translation) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        }
    });

    // Update mode selector options
    updateModeOptions();

    // Update search placeholder
    const searchBar = document.getElementById('searchBar');
    searchBar.placeholder = lang === 'de' ? 'Suchen...' : 'Search...';

    // Update markdown content
    updateContentDisplay();
    updateNewsDisplay();
    updateImprintDisplay();
}

// Update custom select language
function updateModeOptions() {
    const customSelect = document.getElementById('customModeSelect');
    if (!customSelect) return;

    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelectorAll('.select-items div');

    // Update displayed text
    selectItems.forEach(item => {
        const value = item.getAttribute('data-value');
        const translation = item.getAttribute(`data-${currentLang}`);
        if (translation) {
            item.textContent = translation;
            // Update selected text if this is the current mode
            if (value === currentMode && selectSelected) {
                selectSelected.textContent = translation;
            }
        }
    });
}

// Update theme (dark/auto/light)
function updateTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
}

// Toggle settings menu
function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.classList.toggle('hidden');
}

// Show home page
function showHome() {
    const mainContent = document.getElementById('mainContent');
    const intro = mainContent.querySelector('.island-intro');
    const feed = mainContent.querySelector('.island-feed');
    const imprint = mainContent.querySelector('.island-imprint');

    intro.classList.remove('hidden');
    feed.classList.remove('hidden');
    imprint.classList.add('hidden');
}

// Show imprint page
function showImprint() {
    const mainContent = document.getElementById('mainContent');
    const intro = mainContent.querySelector('.island-intro');
    const feed = mainContent.querySelector('.island-feed');
    const imprint = mainContent.querySelector('.island-imprint');

    intro.classList.add('hidden');
    feed.classList.add('hidden');
    imprint.classList.remove('hidden');
}

// Helper: Get theme value from name
function getThemeValue(themeName) {
    switch(themeName) {
        case 'dark': return 0;
        case 'auto': return 1;
        case 'light': return 2;
        default: return 1;
    }
}

// Helper: Get theme name from value
function getThemeName(value) {
    switch(value) {
        case 0: return 'dark';
        case 1: return 'auto';
        case 2: return 'light';
        default: return 'auto';
    }
}

// Open image modal
function openImageModal(imageSrc) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    if (imageModal && modalImage) {
        modalImage.src = imageSrc;
        imageModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

// Close image modal
function closeImageModal() {
    const imageModal = document.getElementById('imageModal');

    if (imageModal) {
        imageModal.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
}

// Load all content from markdown files
async function loadAllContent() {
    await loadModeContent();
    await loadNewsContent();
    await loadImprintContent();
}

// Load content for current mode and language
async function loadModeContent() {
    const workContentDE = await loadContent('work', 'de');
    const workContentEN = await loadContent('work', 'en');
    const politicsContentDE = await loadContent('politics', 'de');
    const politicsContentEN = await loadContent('politics', 'en');
    const personalContentDE = await loadContent('personal', 'de');
    const personalContentEN = await loadContent('personal', 'en');

    // Store content for language switching
    window.contentCache = {
        work: { de: workContentDE, en: workContentEN },
        politics: { de: politicsContentDE, en: politicsContentEN },
        personal: { de: personalContentDE, en: personalContentEN }
    };

    // Display current content
    updateContentDisplay();
}

// Load news content
async function loadNewsContent() {
    const workNewsDE = await loadNews('work', 'de');
    const workNewsEN = await loadNews('work', 'en');
    const politicsNewsDE = await loadNews('politics', 'de');
    const politicsNewsEN = await loadNews('politics', 'en');
    const personalNewsDE = await loadNews('personal', 'de');
    const personalNewsEN = await loadNews('personal', 'en');

    window.newsCache = {
        work: { de: workNewsDE, en: workNewsEN },
        politics: { de: politicsNewsDE, en: politicsNewsEN },
        personal: { de: personalNewsDE, en: personalNewsEN }
    };

    updateNewsDisplay();
}

// Load imprint content
async function loadImprintContent() {
    const imprintDE = await loadImprint('de');
    const imprintEN = await loadImprint('en');

    window.imprintCache = {
        de: imprintDE,
        en: imprintEN
    };

    updateImprintDisplay();
}

// Update content display based on current mode and language
function updateContentDisplay() {
    if (!window.contentCache) return;

    const workContent = document.getElementById('workContent');
    const politicsContent = document.getElementById('politicsContent');
    const personalContent = document.getElementById('personalContent');

    if (workContent && window.contentCache.work) {
        workContent.innerHTML = window.contentCache.work[currentLang];
    }

    if (politicsContent && window.contentCache.politics) {
        politicsContent.innerHTML = window.contentCache.politics[currentLang];
    }

    if (personalContent && window.contentCache.personal) {
        personalContent.innerHTML = window.contentCache.personal[currentLang];
    }

    // Re-attach profile image event listeners after content update
    attachProfileImageListeners();
}

// Update imprint display
function updateImprintDisplay() {
    if (!window.imprintCache) return;

    const imprintContent = document.querySelector('.island-imprint .imprint-content');
    if (imprintContent) {
        imprintContent.innerHTML = window.imprintCache[currentLang];
    }
}

// Update news display
function updateNewsDisplay() {
    if (!window.newsCache) return;

    const workFeed = document.querySelector('.work-feed');
    const politicsFeed = document.querySelector('.politics-feed');
    const personalFeed = document.querySelector('.personal-feed');

    if (workFeed && window.newsCache.work) {
        workFeed.innerHTML = window.newsCache.work[currentLang];
    }

    if (politicsFeed && window.newsCache.politics) {
        politicsFeed.innerHTML = window.newsCache.politics[currentLang];
    }

    if (personalFeed && window.newsCache.personal) {
        personalFeed.innerHTML = window.newsCache.personal[currentLang];
    }
}

// Initialize custom select dropdown
function initCustomSelect() {
    const customSelect = document.getElementById('customModeSelect');
    if (!customSelect) return;

    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');

    if (!selectSelected || !selectItems) return;

    // Toggle dropdown on click
    selectSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllSelect(selectSelected);
        selectItems.classList.toggle('hidden');
        selectSelected.classList.toggle('select-arrow-active');
    });

    // Handle option selection
    const items = selectItems.querySelectorAll('div');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = item.getAttribute('data-value');
            const text = item.textContent;

            // Update selected text
            selectSelected.textContent = text;

            // Update mode
            currentMode = value;
            updateMode(currentMode);
            savePreferences();

            // Close dropdown
            selectItems.classList.add('hidden');
            selectSelected.classList.remove('select-arrow-active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            selectItems.classList.add('hidden');
            selectSelected.classList.remove('select-arrow-active');
        }
    });
}

// Initialize custom language select dropdown
function initCustomLangSelect() {
    const customSelect = document.getElementById('customLangSelect');
    if (!customSelect) return;

    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');

    if (!selectSelected || !selectItems) return;

    // Toggle dropdown on click
    selectSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllSelect(selectSelected);
        selectItems.classList.toggle('hidden');
        selectSelected.classList.toggle('select-arrow-active');
    });

    // Handle option selection
    const items = selectItems.querySelectorAll('div');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = item.getAttribute('data-value');
            const text = item.textContent;

            // Update selected text
            selectSelected.textContent = text;

            // Update language
            currentLang = value;
            updateLanguage(currentLang);
            savePreferences();

            // Close dropdown
            selectItems.classList.add('hidden');
            selectSelected.classList.remove('select-arrow-active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            selectItems.classList.add('hidden');
            selectSelected.classList.remove('select-arrow-active');
        }
    });
}

// Close all select boxes except the current one
function closeAllSelect(element) {
    const selectItems = document.querySelectorAll('.select-items');
    const selectSelected = document.querySelectorAll('.select-selected');

    selectItems.forEach(item => {
        if (element && element.nextElementSibling === item) return;
        item.classList.add('hidden');
    });

    selectSelected.forEach(selected => {
        if (element === selected) return;
        selected.classList.remove('select-arrow-active');
    });
}

// Load profile images with automatic format detection
async function loadProfileImages() {
    const images = [
        { id: 'profileImage', name: 'work_pp' },
        { id: 'profileImagePolitics', name: 'politics_pp' },
        { id: 'profileImagePersonal', name: 'personal_pp' }
    ];

    const formats = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

    for (const image of images) {
        const imgElement = document.getElementById(image.id);
        if (!imgElement) continue;

        // Try each format until one works
        let foundFormat = false;
        for (const format of formats) {
            const imagePath = `media/${image.name}.${format}`;

            try {
                const response = await fetch(imagePath, { method: 'HEAD' });
                if (response.ok) {
                    imgElement.src = imagePath;
                    foundFormat = true;
                    break;
                }
            } catch (error) {
                // Continue to next format
                continue;
            }
        }

        // If no format found, keep placeholder
        if (!foundFormat) {
            console.log(`No image found for ${image.name}, keeping placeholder`);
        }
    }
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
