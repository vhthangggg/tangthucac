// --- START OF FILE script.js ---

// --- DOM Elements ---
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mainNavigationNew = document.querySelector('.main-navigation-new');
const primaryMenu = document.querySelector('.primary-menu-new');
const submenuToggles = document.querySelectorAll('.has-submenu-new > a');
const themeToggleButton = document.getElementById('theme-toggle-button');
const mainContent = document.getElementById('main-content');
const simpleNotification = document.getElementById('simple-notification');
const scrollToTopButton = document.getElementById('scrollToTop');
const currentYearSpan = document.getElementById('current-year');

const loginButtonNav = document.getElementById('login-button-nav');
const logoutButtonNav = document.getElementById('logout-button-nav');
const userDropdown = document.getElementById('user-dropdown-new');
const userAvatarButton = document.getElementById('user-avatar-button');
const userInfoDisplay = document.getElementById('user-info-new');

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMeCheckbox = document.getElementById("remember-me");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const bookDetailsSection = document.getElementById('book-details');

const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-button");
const searchSuggestions = document.getElementById("search-suggestions");

const paymentPopupOverlay = document.getElementById("payment-popup-overlay");
const paymentContentTemplate = document.getElementById("payment-content-template");
const readerGmailInput = document.getElementById("reader-gmail");
const copyPaymentButton = document.getElementById("copy-payment-content-button");
const closePaymentPopupButton = document.getElementById("close-payment-popup");
const paymentPopupCloseIcon = document.getElementById("payment-popup-close-icon");

const veChungToiPopupOverlay = document.getElementById("ve-chung-toi-popup-overlay");
const closeVeChungToiPopupButton = document.getElementById("close-ve-chung-toi-popup");
const xemThemVeChungToiFooterLink = document.getElementById("xem-them-ve-chung-toi-footer");

const newsletterPopupOverlay = document.getElementById('newsletter-notification-popup-overlay');
const closeNewsletterPopupButton = document.getElementById('close-newsletter-popup-button');
const closeNewsletterPopupIcon = document.getElementById('close-newsletter-popup-icon');

// --- Global State ---
let books = [];
let isLoggedIn = false;
let user = {
    username: "",
    vanXu: 0,
    favorites: [],
    purchaseHistory: [],
    rank: "Học Giả"
};
let currentPage = 1;
let booksPerPage = 10;
let currentCategory = "Tất cả";
let filteredBooks = [];
let previousPageForDetails = 1;
let previouslyActiveSectionId = 'trang-chu';
let previouslyActiveCategory = null;

// --- Helper Functions ---
function showCustomNotification(message, type = 'info', duration = 3000) {
    if (!simpleNotification) return;
    simpleNotification.textContent = message;
    simpleNotification.className = 'simple-notification';
    if (type) simpleNotification.classList.add(type);
    simpleNotification.classList.add('show');
    setTimeout(() => {
        simpleNotification.classList.remove('show');
    }, duration);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase());
}

function showLoading() {
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (loadingOverlay) loadingOverlay.classList.add("active");
}

function hideLoading() {
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (loadingOverlay) loadingOverlay.classList.remove("active");
}

function initializeFloatingLabels() {
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        const label = input.closest('.input-group')?.querySelector('.input-label');
        if (label) {
            const updateLabel = () => {
                if (input.value) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            };
            input.addEventListener('focus', () => label.classList.add('active'));
            input.addEventListener('blur', updateLabel);
            updateLabel();
        }
    });
}

// --- Navigation Logic ---
if (mobileNavToggle && mainNavigationNew) {
    mobileNavToggle.addEventListener('click', () => {
        const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true' || false;
        mobileNavToggle.setAttribute('aria-expanded', String(!isExpanded));
        mainNavigationNew.classList.toggle('open');
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        if (!mainNavigationNew.classList.contains('open')) {
            document.querySelectorAll('.has-submenu-new.open').forEach(openSubmenu => {
                openSubmenu.classList.remove('open');
                const anchor = openSubmenu.querySelector('a');
                if (anchor) anchor.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function(event) {
        const parentLi = this.parentElement;
        if (parentLi && parentLi.classList.contains('has-submenu-new')) {
            if (window.innerWidth <= 992 || this.getAttribute('href') === '#the-loai') {
                 event.preventDefault();
            }
            const isSubmenuOpen = parentLi.classList.toggle('open');
            this.setAttribute('aria-expanded', String(isSubmenuOpen));
        }
    });
});

document.addEventListener('click', function(event) {
    if (mainNavigationNew && mainNavigationNew.classList.contains('open') &&
        !mainNavigationNew.contains(event.target) &&
        mobileNavToggle && !mobileNavToggle.contains(event.target)) {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mainNavigationNew.classList.remove('open');
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        document.querySelectorAll('.has-submenu-new.open').forEach(openSubmenu => {
            openSubmenu.classList.remove('open');
            const anchor = openSubmenu.querySelector('a');
            if (anchor) anchor.setAttribute('aria-expanded', 'false');
        });
    }
});

// --- Theme Toggle Logic ---
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');
    if (themeToggleButton) {
        const icon = themeToggleButton.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }
    localStorage.setItem('theme', theme);
    if (theme === 'dark' && typeof initStarfield === 'function') initStarfield();
    else if (theme === 'light' && typeof removeStarfield === 'function') removeStarfield();
}

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') ||
                             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

// --- Authentication Mockup & UI Update ---
function updateAuthUI() {
    const userRankText = document.querySelector('#user-rank .rank-text');
    const userVanXuValue = document.querySelector('#user-van-xu .van-xu-value');

    if (isLoggedIn) {
        if (loginButtonNav) loginButtonNav.style.display = 'none';
        if (userDropdown) userDropdown.style.display = 'block';
        if (userInfoDisplay) userInfoDisplay.style.display = 'flex';

        if (userRankText) userRankText.textContent = user.rank || 'Học Giả';
        if (userVanXuValue) userVanXuValue.textContent = (user.vanXu || 0).toLocaleString();

        const rankElement = document.getElementById('user-rank');
        if (rankElement) {
            rankElement.className = 'rank-hoc-gia-to-mo';
            if (user.rank === "Thư Sinh") rankElement.classList.add('rank-thu-sinh');
        }
    } else {
        if (loginButtonNav) loginButtonNav.style.display = 'flex';
        if (userDropdown) userDropdown.style.display = 'none';
        if (userInfoDisplay) userInfoDisplay.style.display = 'none';
    }
    updateFavoriteCount();
}

if (userAvatarButton && userDropdown) {
    userAvatarButton.addEventListener('click', (event) => {
        event.stopPropagation();
        userDropdown.classList.toggle('open');
        userAvatarButton.setAttribute('aria-expanded', String(userDropdown.classList.contains('open')));
    });
    document.addEventListener('click', (event) => {
        if (userDropdown.classList.contains('open') &&
            !userDropdown.contains(event.target) &&
            !userAvatarButton.contains(event.target)) {
            userDropdown.classList.remove('open');
            userAvatarButton.setAttribute('aria-expanded', 'false');
        }
    });
}

// --- Login Form Logic ---
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let formValid = true;

        if (!emailInput || !emailInput.value || !isValidEmail(emailInput.value)) {
            showCustomNotification('Email không hợp lệ.', 'error');
            if (emailInput) emailInput.closest('.input-group')?.classList.add('error');
            if (emailError) emailError.textContent = "Email không hợp lệ.";
            formValid = false;
        } else {
            if (emailInput) emailInput.closest('.input-group')?.classList.remove('error');
            if (emailError) emailError.textContent = "";
        }

        if (!passwordInput || passwordInput.value.length < 6) {
            showCustomNotification('Mật khẩu phải có ít nhất 6 ký tự.', 'error');
            if (passwordInput) passwordInput.closest('.input-group')?.classList.add('error');
            if (passwordError) passwordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
            formValid = false;
        } else {
            if (passwordInput) passwordInput.closest('.input-group')?.classList.remove('error');
            if (passwordError) passwordError.textContent = "";
        }

        if (!formValid) return;

        showLoading();
        setTimeout(() => {
            hideLoading();
            isLoggedIn = true;
            user = {
                username: emailInput.value,
                vanXu: Math.floor(Math.random() * 100000) + 5000,
                rank: "Thư Sinh",
                favorites: [],
                purchaseHistory: []
            };
            updateUserRank(user.vanXu);
            updateAuthUI();
            navigateToSection('trang-chu');
            showCustomNotification('Đăng nhập thành công!', 'success');
            if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                localStorage.setItem('rememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            loginForm.reset();
            initializeFloatingLabels();
        }, 1000);
    });

    const loginPasswordToggleButton = loginForm.querySelector(".password-toggle-button");
    const loginPasswordInput = loginForm.querySelector("#password");
    if (loginPasswordToggleButton && loginPasswordInput) {
        loginPasswordToggleButton.addEventListener('click', () => {
            const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPasswordInput.setAttribute('type', type);
            const icon = loginPasswordToggleButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }
}


if (logoutButtonNav) {
    logoutButtonNav.addEventListener('click', () => {
        isLoggedIn = false;
        user = { username: "", vanXu: 0, favorites: [], purchaseHistory: [], rank: "Học Giả" };
        updateAuthUI();
        navigateToSection('trang-chu');
        showCustomNotification('Đăng xuất thành công.', 'info');
        if (userDropdown && userDropdown.classList.contains('open')) {
            userDropdown.classList.remove('open');
            if (userAvatarButton) userAvatarButton.setAttribute('aria-expanded', 'false');
        }
    });
}

// --- Section Navigation ---
function navigateToSection(sectionId, categoryId = null, page = 1) {
    showLoading();
    if (mainNavigationNew && mainNavigationNew.classList.contains('open')) {
        if (mobileNavToggle) mobileNavToggle.click();
    }

    setTimeout(() => {
        document.querySelectorAll('.content-section.active').forEach(s => s.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            if (!(sectionId === 'trang-chu' && !document.querySelector('.primary-menu-new .nav-link.active[data-section="trang-chu"]'))) {
                 targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            document.querySelectorAll('.primary-menu-new .nav-link.active').forEach(l => l.classList.remove('active'));
            let activeNavLink = document.querySelector(`.primary-menu-new .nav-link[data-section="${sectionId}"]`);
            if (categoryId) {
                activeNavLink = document.querySelector(`.primary-menu-new .nav-link[data-category="${categoryId}"]`) || activeNavLink;
            }
            if (activeNavLink) {
                activeNavLink.classList.add('active');
                const parentLi = activeNavLink.closest('.has-submenu-new');
                if (parentLi) {
                    const mainCategoryLink = parentLi.querySelector('a[data-section="the-loai"]');
                    if(mainCategoryLink) mainCategoryLink.classList.add('active');
                }
            }
        }

        if (sectionId === 'the-loai' && categoryId) {
            document.querySelectorAll('.category-section').forEach(cs => {
                cs.classList.remove('active');
                cs.style.display = 'none';
            });
            const catSection = document.getElementById(categoryId);
            if (catSection) {
                catSection.classList.add('active');
                catSection.style.display = 'block';
            }
            const categoryTitleElement = document.getElementById('category-title');
            if (categoryTitleElement) {
                const categoryLink = document.querySelector(`.submenu-new a[data-category="${categoryId}"]`);
                categoryTitleElement.textContent = categoryLink ? categoryLink.textContent.replace(/\(\d+\)$/, '').trim() : "Thể Loại";
            }
            displayBooks(categoryId, page);
        } else if (sectionId === 'trang-chu') {
            displayBooks("Tất cả", page);
        } else if (sectionId === 'yeu-thich') {
            displayFavoriteBooks();
        } else if (sectionId === 'lich-su-mua-hang') {
            displayPurchaseHistory();
        }
        if (sectionId === 'login-form-section' || sectionId === 'register-form-section') {
            initializeFloatingLabels();
        }
        hideLoading();
    }, 300);
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
        const sectionId = this.dataset.section;
        const categoryId = this.dataset.category;

        if (this.parentElement.classList.contains('has-submenu-new') && !categoryId && window.innerWidth <= 992 && this.getAttribute('href') === '#the-loai') {
            return;
        }
        event.preventDefault();

        if (categoryId && mainNavigationNew && mainNavigationNew.classList.contains('open')) {
            if (mobileNavToggle) mobileNavToggle.click();
        }
        const parentSubmenuLi = this.closest('.has-submenu-new');
        if (parentSubmenuLi && parentSubmenuLi.classList.contains('open') && !this.parentElement.classList.contains('has-submenu-new')) {
            parentSubmenuLi.classList.remove('open');
            const mainAnchor = parentSubmenuLi.querySelector('a');
            if (mainAnchor) mainAnchor.setAttribute('aria-expanded', 'false');
        }

        if (sectionId) {
            navigateToSection(sectionId, categoryId);
        } else if (categoryId) {
            navigateToSection('the-loai', categoryId);
        }
    });
});


// --- Book Loading and Display ---
async function loadBooks() {
    try {
        showLoading();
        const timestamp = new Date().getTime();
        const response = await fetch(`data/books.json?t=${timestamp}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        books = await response.json();
        if (!Array.isArray(books)) throw new Error("Books data is not an array.");
        const counts = calculateCategoryCounts();
        displayCategoryCounts(counts);
        initializePageContent();
    } catch (error) {
        console.error('Lỗi khi tải sách:', error);
        showCustomNotification('Lỗi tải dữ liệu sách: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function initializePageContent() {
    displayBooks("Tất cả", 1);
    if (typeof setupFeaturedCarousel === 'function') setupFeaturedCarousel();
    if (typeof setupNewBooksCarousel === 'function') setupNewBooksCarousel();

    const hash = window.location.hash.substring(1);
    let initialSection = 'trang-chu';
    let initialCategory = null;

    if (hash) {
        const el = document.getElementById(hash);
        if (el && el.classList.contains('content-section')) {
            initialSection = hash;
        } else if (el && el.classList.contains('category-section')) {
            initialSection = 'the-loai';
            initialCategory = hash;
        }
    }
    navigateToSection(initialSection, initialCategory);
}

function displayBooks(category = "Tất cả", page = 1) {
    currentCategory = category;
    currentPage = page;
    filteredBooks = (category === "Tất cả") ? books : books.filter(book => book.category === category);

    let targetContainerId = (category === "Tất cả") ? "book-container" : `${category}-container`;
    let paginationContainerSelector = (category === "Tất cả") ? "#all-books .pagination" : `#${category} .pagination`;

    const targetContainer = document.getElementById(targetContainerId);
    const paginationContainer = document.querySelector(paginationContainerSelector);

    if (!targetContainer) {
        console.error(`Target container #${targetContainerId} not found.`);
        return;
    }

    targetContainer.innerHTML = '';
    if(paginationContainer) paginationContainer.innerHTML = "";

    if (filteredBooks.length === 0) {
        targetContainer.innerHTML = `<p class="empty-list-message">Không có sách nào trong thể loại này.</p>`;
        return;
    }

    setBooksPerPage();
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const start = (page - 1) * booksPerPage;
    const end = Math.min(start + booksPerPage, filteredBooks.length);
    const booksToDisplay = filteredBooks.slice(start, end);

    booksToDisplay.forEach(book => {
        const bookElementHTML = createBookHTML(book);
        targetContainer.insertAdjacentHTML('beforeend', bookElementHTML);
    });

    if (paginationContainer && totalPages > 1) {
        renderPagination(totalPages, currentPage, category, paginationContainer);
    }
}

function setBooksPerPage() {
    if (window.innerWidth <= 480) booksPerPage = 4;
    else if (window.innerWidth <= 768) booksPerPage = 6;
    else if (window.innerWidth <= 992) booksPerPage = 8;
    else booksPerPage = 10;
}

function renderPagination(totalPages, currentPage, category, container) {
    container.innerHTML = '';

    const createButton = (text, pageNum, isDisabled = false, isActive = false) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = isDisabled;
        if (isActive) button.classList.add('active');
        button.addEventListener('click', () => {
            const targetSectionId = category === "Tất cả" ? "trang-chu" : "the-loai";
            const targetCategoryId = category === "Tất cả" ? null : category;
            navigateToSection(targetSectionId, targetCategoryId, pageNum);

            const sectionToScrollId = category === "Tất cả" ? "all-books" : category;
            const sectionToScroll = document.getElementById(sectionToScrollId);
            sectionToScroll?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return button;
    };

    if (currentPage > 1) {
        container.appendChild(createButton('Trước', currentPage - 1));
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        container.appendChild(createButton('1', 1));
        if (startPage > 2) container.insertAdjacentHTML('beforeend', `<span class="pagination-ellipsis">...</span>`);
    }

    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(createButton(String(i), i, false, i === currentPage));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) container.insertAdjacentHTML('beforeend', `<span class="pagination-ellipsis">...</span>`);
        container.appendChild(createButton(String(totalPages), totalPages));
    }

    if (currentPage < totalPages) {
        container.appendChild(createButton('Sau', currentPage + 1));
    }
}


// --- Stars, Favorite, Cart (Client-side Mockups) ---
function generateStars(rating, bookId) {
    if (typeof rating !== "number" || isNaN(rating)) return "";
    let starsHtml = "";
    const fullStars = Math.floor(rating);
    const decimalPart = rating - fullStars;
    for (let i = 1; i <= 5; i++) {
        let starClass = "";
        let iconClass = "far fa-star"; // Default empty
        if (i <= fullStars) {
            starClass = "active";
            iconClass = "fas fa-star"; // Full star
        } else if (i === fullStars + 1 && decimalPart > 0) {
            if (decimalPart >= 0.75) {
                starClass = "active";
                iconClass = "fas fa-star";
            } else if (decimalPart >= 0.25) {
                starClass = "half";
                iconClass = "fas fa-star-half-alt";
            }
        }
        starsHtml += `<span class="star ${starClass}" data-rating="${i}" data-book-id="${bookId}"><i class="${iconClass}"></i></span>`;
    }
    return starsHtml;
}

function handleRead(bookId) {
  const book = books.find((b) => String(b.id) === String(bookId));
  if (!book) {
    showCustomNotification("Không tìm thấy sách.", "error");
    return;
  }
  const readLink = book.readLink;
  if (readLink === "Đang khởi tạo") {
    showCustomNotification("Link đọc thử đang được khởi tạo. Vui lòng quay lại sau!", "info");
  } else if (readLink && readLink !== "#" && readLink.startsWith("http")) { // Basic URL check
    window.open(readLink, "_blank");
  } else {
    showCustomNotification("Link đọc thử không khả dụng.", "info");
  }
}


function toggleFavorite(bookId) {
    if (!isLoggedIn) {
        showCustomNotification("Bạn cần đăng nhập để yêu thích sách.", "info");
        navigateToSection('login-form-section');
        return;
    }
    const book = books.find(b => String(b.id) === String(bookId));
    if (!book) {
        showCustomNotification("Không tìm thấy sách.", "error"); return;
    }
    const bookIndexInFavorites = user.favorites.findIndex(fav => String(fav.bookId) === String(bookId));
    const isActiveNow = bookIndexInFavorites === -1;

    document.querySelectorAll(`.favorite-button[data-book-id="${bookId}"]`).forEach(btn => {
        btn.classList.toggle('active', isActiveNow);
    });

    if (isActiveNow) {
        user.favorites.push({ bookId: book.id, title: book.title, cover: book.cover, addedDate: new Date().toISOString().slice(0,10) });
        showCustomNotification(`Đã thêm "${book.title}" vào yêu thích!`, 'success');
    } else {
        user.favorites.splice(bookIndexInFavorites, 1);
        showCustomNotification(`Đã xóa "${book.title}" khỏi yêu thích.`, 'info');
    }
    updateFavoriteCount();
    if (document.getElementById('yeu-thich')?.classList.contains('active')) {
        displayFavoriteBooks();
    }
}

function updateFavoriteCount() {
    const favCountEl = document.getElementById('favorite-count');
    if (favCountEl) {
        favCountEl.textContent = user.favorites && user.favorites.length > 0 ? `(${user.favorites.length})` : '';
    }
}

function handleAddToCart(bookId) {
    const book = books.find(b => String(b.id) === String(bookId));
    if (!book) {
        showCustomNotification("Không tìm thấy sách.", "error"); return;
    }
    showCustomNotification(`Đã thêm "${book.title}" vào giỏ hàng (mock).`, 'success');
    console.log("Mock cart: Added", book.title);
}


// --- Book Details ---
function showBookDetails(bookId) {
    const book = books.find(b => String(b.id) === String(bookId));
    if (!book) {
        showCustomNotification("Không tìm thấy thông tin sách.", "error"); return;
    }
    const activeContentSection = document.querySelector('.content-section.active');
    if (activeContentSection) previouslyActiveSectionId = activeContentSection.id;

    if (previouslyActiveSectionId === 'the-loai') {
        const activeCatSect = document.querySelector('#the-loai .category-section.active');
        if (activeCatSect) previouslyActiveCategory = activeCatSect.id;
        previousPageForDetails = currentPage;
    } else if (previouslyActiveSectionId === 'trang-chu' && document.getElementById('all-books')?.style.display !== 'none' && document.getElementById('all-books')?.classList.contains('active')) {
        previousPageForDetails = currentPage;
    } else {
        previouslyActiveCategory = null;
        previousPageForDetails = 1;
    }

    const titleEl = document.getElementById("book-details-title");
    if (titleEl) { titleEl.textContent = book.title; titleEl.dataset.bookId = book.id; }
    const authorEl = document.getElementById("book-details-author");
    if (authorEl) authorEl.innerHTML = `<i class="fas fa-user-edit"></i> Tác giả: <span class="info-value">${book.author || "Khuyết Danh"}</span>`;
    const publisherEl = document.getElementById("book-details-publisher");
    if (publisherEl) publisherEl.innerHTML = `<i class="fas fa-building"></i> NXB: <span class="info-value">${book.publisher || "NXB Tàng Thư Các"}</span>`;
    const priceEl = document.getElementById("book-details-price");
    if (priceEl) {
        const priceText = typeof book.price === 'number' ? book.price.toLocaleString() + ' VNĐ' : book.price;
        priceEl.innerHTML = `<i class="fas fa-dollar-sign"></i> Giá: <span class="info-value">${priceText}</span>`;
    }

    const descEl = document.getElementById("book-details-description");
    if (descEl) descEl.innerHTML = book.description || "Chưa có mô tả.";

    const coverEl = document.getElementById("book-details-cover");
    if (coverEl) { coverEl.src = book.cover || 'img/placeholder.jpg'; coverEl.alt = book.title; }

    const pubDateEl = document.getElementById("book-details-publication-date");
    if (pubDateEl) pubDateEl.textContent = `Xuất bản: ${book.publicationDate || "Không rõ"}`;

    const detailsPurchaseBtn = document.querySelector("#book-details .purchase-button");
    if (detailsPurchaseBtn) detailsPurchaseBtn.dataset.bookId = book.id;
    const detailsReadBtn = document.querySelector("#book-details .read-button");
    if (detailsReadBtn) detailsReadBtn.dataset.bookId = book.id;
    const detailsCartBtn = document.querySelector("#book-details .add-to-cart-button");
    if (detailsCartBtn) detailsCartBtn.dataset.bookId = book.id;
    const detailsFavBtn = document.querySelector("#book-details .favorite-button");
    if (detailsFavBtn) {
        detailsFavBtn.dataset.bookId = book.id;
        detailsFavBtn.classList.toggle('active', isLoggedIn && user.favorites.some(fav => String(fav.bookId) === String(book.id)));
    }

    const ratingEl = document.getElementById("book-details-rating");
    if (ratingEl) ratingEl.innerHTML = generateStars(book.rating, book.id);

    const commentsList = document.getElementById("book-details-comments-list");
    if (commentsList) {
        commentsList.innerHTML = '';
        const comments = book.comments || [];
        if (comments.length > 0) {
            comments.forEach(commentText => {
                const p = document.createElement('p'); p.textContent = commentText; commentsList.appendChild(p);
            });
        } else {
            commentsList.innerHTML = '<p><em>Chưa có bình luận nào cho sách này.</em></p>';
        }
    }
    const commentSubmitBtn = document.getElementById('book-details-comment-submit');
    const commentBox = document.getElementById('book-details-comment-box');
    if (commentSubmitBtn && commentBox) {
        commentSubmitBtn.onclick = () => {
            const commentText = commentBox.value.trim();
            if (commentText) {
                showCustomNotification("Bình luận của bạn đã được gửi (mock).", "success");
                if(commentsList && !commentsList.querySelector('p em')) { // if not "Chưa có bình luận"
                     // MOCK: Add to UI if list exists and not empty message
                } else if (commentsList) {
                    commentsList.innerHTML = ''; // Clear "Chưa có..."
                }
                if(commentsList){ // Add comment regardless
                    const p = document.createElement('p'); p.textContent = commentText; commentsList.appendChild(p);
                }
                commentBox.value = '';
            } else {
                showCustomNotification("Vui lòng nhập nội dung bình luận.", "info");
            }
        };
    }

    document.querySelectorAll('.content-section.active').forEach(s => s.classList.remove('active'));
    if (bookDetailsSection) {
        bookDetailsSection.classList.add('active');
        bookDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.addEventListener('keydown', handleEscapeKeyForBookDetails);
}

function handleEscapeKeyForBookDetails(event) {
    if (event.key === "Escape" && bookDetailsSection && bookDetailsSection.classList.contains("active")) {
        closeBookDetails();
    }
}

function closeBookDetails() {
    if (bookDetailsSection) {
        bookDetailsSection.classList.remove('active');
        document.removeEventListener('keydown', handleEscapeKeyForBookDetails);
    }
    navigateToSection(previouslyActiveSectionId, previouslyActiveCategory, previousPageForDetails);
}
const closeBookDetailsBtn = document.getElementById("close-book-details-button");
if(closeBookDetailsBtn) closeBookDetailsBtn.addEventListener('click', closeBookDetails);


// --- Popups (Payment, About, Newsletter) ---
function openPopup(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);
    }
}
function closePopup(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 250);
    }
}

// Payment Popup
if (paymentPopupOverlay && mainContent) { // Check mainContent for event delegation
    mainContent.addEventListener('click', function(event) {
        const purchaseBtn = event.target.closest('.purchase-button');
        if (purchaseBtn) {
            event.stopPropagation();
            const bookId = purchaseBtn.dataset.bookId;
            if (bookId) {
                if (!isLoggedIn) {
                    showCustomNotification("Bạn cần đăng nhập để thỉnh thư.", "info");
                    navigateToSection('login-form-section'); return;
                }
                if (paymentContentTemplate) paymentContentTemplate.textContent = `{BooksID:${bookId}} [your-gmail]`;
                if (readerGmailInput) readerGmailInput.value = user.username || '';
                openPopup('payment-popup-overlay');
            }
        }
    });
    copyPaymentButton?.addEventListener("click", function () {
        if(!paymentContentTemplate || !readerGmailInput) return;
        const bookIdMatch = paymentContentTemplate.textContent.match(/\{BooksID:(\d+)\}/);
        if (!bookIdMatch) { showCustomNotification("Lỗi: Không tìm thấy ID sách.", "error"); return; }
        const bookId = bookIdMatch[1];
        const readerGmailVal = readerGmailInput.value.trim();
        if (!readerGmailVal || !isValidEmail(readerGmailVal)) {
            showCustomNotification("Vui lòng nhập địa chỉ Gmail hợp lệ.", "error");
            readerGmailInput.focus(); return;
        }
        const paymentContent = `{BooksID:${bookId}} ${readerGmailVal}`;
        navigator.clipboard.writeText(paymentContent)
            .then(() => showCustomNotification("Đã sao chép nội dung thanh toán!", "success"))
            .catch(() => showCustomNotification("Lỗi sao chép. Vui lòng sao chép thủ công.", "error"));
    });
    closePaymentPopupButton?.addEventListener("click", () => closePopup('payment-popup-overlay'));
    paymentPopupCloseIcon?.addEventListener("click", () => closePopup('payment-popup-overlay'));
    paymentPopupOverlay.addEventListener('click', (event) => {
        if (event.target === paymentPopupOverlay) closePopup('payment-popup-overlay');
    });
}

// "Về Chúng Tôi" Popup
xemThemVeChungToiFooterLink?.addEventListener("click", (event) => {
    event.preventDefault(); openPopup('ve-chung-toi-popup-overlay');
});
closeVeChungToiPopupButton?.addEventListener("click", () => closePopup('ve-chung-toi-popup-overlay'));
veChungToiPopupOverlay?.addEventListener('click', (event) => {
    if (event.target === veChungToiPopupOverlay) closePopup('ve-chung-toi-popup-overlay');
});

// Newsletter Popup
const newsletterFormFooter = document.querySelector('.site-footer-new #newsletter-form');
newsletterFormFooter?.addEventListener('submit', function(event) {
    event.preventDefault();
    const emailField = this.querySelector('input[type="email"]');
    if (emailField && isValidEmail(emailField.value)) {
        openPopup('newsletter-notification-popup-overlay');
        emailField.value = ''; // Clear after "submission"
    } else {
        showCustomNotification("Vui lòng nhập email hợp lệ để đăng ký.", "error");
    }
});
closeNewsletterPopupButton?.addEventListener('click', () => closePopup('newsletter-notification-popup-overlay'));
closeNewsletterPopupIcon?.addEventListener('click', () => closePopup('newsletter-notification-popup-overlay'));
newsletterPopupOverlay?.addEventListener('click', (event) => {
    if (event.target === newsletterPopupOverlay) closePopup('newsletter-notification-popup-overlay');
});

// --- Scroll to Top ---
if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
        scrollToTopButton.style.display = (window.pageYOffset > 250) ? 'flex' : 'none';
    });
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Footer Current Year ---
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// --- Search Box Logic ---
function performSearch() {
    if (!searchBox || !searchSuggestions) return;
    const searchTerm = searchBox.value.trim().toLowerCase();
    if (!searchTerm) {
        searchSuggestions.style.display = 'none'; return;
    }
    const results = books.filter(book => book.title.toLowerCase().includes(searchTerm));
    searchSuggestions.innerHTML = '';
    if (results.length > 0) {
        results.slice(0, 5).forEach(book => {
            const li = document.createElement('li');
            li.textContent = book.title;
            li.tabIndex = 0;
            li.setAttribute('role', 'option');
            li.addEventListener('click', () => selectSearchSuggestion(book));
            li.addEventListener('keydown', (e) => { if (e.key === 'Enter') selectSearchSuggestion(book); });
            searchSuggestions.appendChild(li);
        });
        searchSuggestions.style.display = 'block';
    } else {
        const li = document.createElement('li');
        li.textContent = 'Không tìm thấy sách.';
        li.classList.add('no-results');
        searchSuggestions.appendChild(li);
        searchSuggestions.style.display = 'block';
    }
}
function selectSearchSuggestion(book) {
    if (searchBox) searchBox.value = book.title;
    if (searchSuggestions) searchSuggestions.style.display = 'none';
    showBookDetails(book.id);
}
searchBox?.addEventListener('input', performSearch);
searchButton?.addEventListener('click', () => {
    if (!searchBox) return;
    const searchTerm = searchBox.value.trim().toLowerCase();
    if (searchTerm) {
        const results = books.filter(book => book.title.toLowerCase().includes(searchTerm));
        if (results.length > 0) {
            showBookDetails(results[0].id);
            if (searchSuggestions) searchSuggestions.style.display = 'none';
        } else {
            showCustomNotification("Không tìm thấy sách nào khớp.", "info");
        }
    }
});
document.addEventListener('click', (event) => {
    if (searchBox && !searchBox.contains(event.target) &&
        searchSuggestions && !searchSuggestions.contains(event.target) &&
        searchButton && !searchButton.contains(event.target) ) {
        if (searchSuggestions) searchSuggestions.style.display = 'none';
    }
});

// --- Initial Load ---
document.addEventListener("DOMContentLoaded", () => {
    const storedTheme = localStorage.getItem('theme') ||
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(storedTheme);

    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }
    initializeFloatingLabels();

    loadBooks();
    updateAuthUI();

    setTimeout(adjustMainContentPadding, 200);
    window.addEventListener('resize', adjustMainContentPadding);
});

function adjustMainContentPadding() {
    const header = document.querySelector('.site-header-new');
    if (header && mainContent) {
        mainContent.style.paddingTop = `${header.offsetHeight}px`;
    }
}

// --- Mock/Placeholder Functions ---
function updateUserRank(vanXu) {
    let rankName = "Học Giả";
    let rankClass = "rank-hoc-gia-to-mo";
    if (vanXu >= 1000000) { rankName = "Thư Thánh"; rankClass = "rank-thu-thanh"; }
    else if (vanXu >= 50000) { rankName = "Thư Sinh"; rankClass = "rank-thu-sinh"; }
    user.rank = rankName;
    const rankElement = document.getElementById('user-rank');
    if (rankElement) {
        const rankTextElement = rankElement.querySelector('.rank-text');
        if (rankTextElement) rankTextElement.textContent = rankName;
        rankElement.className = '';
        rankElement.classList.add(rankClass);
    }
}

function displayFavoriteBooks() {
    const container = document.getElementById("yeu-thich-container");
    const emptyMsg = document.getElementById("empty-favorites");
    if (!container || !emptyMsg) return;
    container.innerHTML = "";
    if (!isLoggedIn) {
        container.innerHTML = "<p>Bạn cần đăng nhập để xem sách yêu thích.</p>";
        emptyMsg.style.display = "none"; return;
    }
    if (!user.favorites || user.favorites.length === 0) {
        emptyMsg.style.display = "block";
    } else {
        emptyMsg.style.display = "none";
        user.favorites.forEach(favBookInfo => {
            const bookDataForFav = books.find(b => String(b.id) === String(favBookInfo.bookId));
            if (bookDataForFav) {
                const bookHtml = createBookHTML(bookDataForFav);
                container.insertAdjacentHTML('beforeend', bookHtml);
            }
        });
    }
}

function displayPurchaseHistory() {
    const tbody = document.querySelector("#purchase-history-table tbody");
    const emptyMsg = document.getElementById("empty-purchase-history");
    if (!tbody || !emptyMsg) return;
    tbody.innerHTML = "";
    if (!isLoggedIn) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Bạn cần đăng nhập để xem lịch sử.</td></tr>';
        emptyMsg.style.display = "none"; return;
    }
    if (!user.purchaseHistory || user.purchaseHistory.length === 0) {
        emptyMsg.style.display = "block";
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Không có giao dịch nào.</td></tr>';
    } else {
        emptyMsg.style.display = "none";
        user.purchaseHistory.forEach((item, index) => {
            const bookData = books.find(b => String(b.id) === String(item.bookId));
            if (bookData) {
                const row = tbody.insertRow();
                row.insertCell().textContent = index + 1;
                row.insertCell().textContent = bookData.title;
                row.insertCell().textContent = item.purchaseDate;
                row.insertCell().textContent = bookData.price?.toLocaleString ? bookData.price.toLocaleString() + ' VNĐ' : bookData.price;
                row.insertCell().textContent = item.status;
            }
        });
    }
}

function calculateCategoryCounts() {
    const counts = {};
    if (!books || books.length === 0) return counts;
    books.forEach(book => {
        if (book.category) {
            counts[book.category] = (counts[book.category] || 0) + 1;
        }
    });
    return counts;
}
function displayCategoryCounts(counts) {
    const categoryLinks = document.querySelectorAll('.submenu-new a[data-category]');
    categoryLinks.forEach(link => {
        const category = link.dataset.category;
        const count = counts[category] || 0;
        let countSpan = link.querySelector('.category-count');
        if (!countSpan) {
            countSpan = document.createElement('span');
            countSpan.className = 'category-count';
            link.appendChild(document.createTextNode(' '));
            link.appendChild(countSpan);
        }
        countSpan.textContent = `(${count})`;
    });
}

function createBookHTML(book) {
  const isFavorite = isLoggedIn && user.favorites && user.favorites.some(fav => String(fav.bookId) === String(book.id));
  return `
    <div class="book" data-book-id="${book.id}">
      <img src="${book.cover || 'img/placeholder.jpg'}" alt="${book.title}" class="book-image" loading="lazy">
      <div class="book-title-container">
        <h3>${book.title || 'Không có tiêu đề'}</h3>
      </div>
      <p class="book-publication-date">${book.publicationDate || 'Không rõ'}</p>
      <div class="ratings" data-book-id="${book.id}">${generateStars(book.rating, book.id)}</div>
      <div class="button-group">
        <div class="button-row">
          <button class="btn btn-primary purchase-button" data-book-id="${book.id}"><i class="fas fa-book"></i> Thỉnh</button>
          <button class="btn btn-icon favorite-button ${isFavorite ? 'active' : ''}" data-book-id="${book.id}" aria-label="Yêu thích">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <div class="button-row">
          <button class="btn btn-secondary read-button" data-book-id="${book.id}"><i class="fas fa-eye"></i> Đọc thử</button>
          <button class="btn btn-icon add-to-cart-button" data-book-id="${book.id}" aria-label="Thêm vào giỏ">
            <i class="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
    </div>`;
}

function setupNewBooksCarousel() {
  const carouselInner = document.querySelector("#new-books .new-books-inner");
  if (!carouselInner || !books || books.length === 0) return;
  const newBooksData = books.slice(-Math.min(5, books.length)).reverse();
  carouselInner.innerHTML = "";
  if (newBooksData.length > 0) {
    newBooksData.forEach(book => {
      const item = document.createElement("div");
      item.classList.add("new-book-item");
      item.dataset.bookId = book.id;
      const coverImage = book.newCover || book.cover || "img/placeholder.jpg";
      item.innerHTML = `
        <img src="${coverImage}" alt="${book.title || 'Sách mới'}">
        <div class="new-book-overlay">
          <h3>${book.title || 'Đang cập nhật'}</h3>
          <p>${book.publicationDate || 'Chưa xác định'}</p>
        </div>`;
      item.addEventListener('click', () => showBookDetails(book.id)); // Add click listener
      carouselInner.appendChild(item);
    });
    if (newBooksData.length > 1) {
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % newBooksData.length;
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 4000);
    }
  } else {
    carouselInner.innerHTML = "<p>Không có sách mới để hiển thị.</p>";
  }
}

function setupFeaturedCarousel() {
  const carouselContainer = document.querySelector("#featured-books .carousel");
  if (!carouselContainer || !books || books.length === 0) return;
  const featuredBooksData = [...books].sort(() => 0.5 - Math.random()).slice(0, Math.min(10, books.length));
  carouselContainer.innerHTML = "";
  if (featuredBooksData.length > 0) {
    featuredBooksData.forEach(book => {
      const itemHTML = createBookHTML(book);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = itemHTML.trim();
      const bookElement = tempDiv.firstChild;
      if(bookElement) {
          bookElement.classList.add('carousel-item');
           // Add click listener to the book element itself, not just buttons inside
          bookElement.addEventListener('click', (event) => {
              // Prevent card click if a button inside was clicked (handled by delegation)
              if (event.target.closest('button')) return;
              showBookDetails(book.id);
          });
          carouselContainer.appendChild(bookElement);
      }
    });
  } else {
    carouselContainer.innerHTML = "<p>Không có sách nổi bật.</p>";
  }
}

function initStarfield() { /* Placeholder */ }
function removeStarfield() { /* Placeholder */ }

// --- END OF FILE script.js ---
