document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('categoryDropdown');
    const dropdownToggle = document.getElementById('dropdownToggle');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.getElementById('productsGrid');
    const productsTitle = document.getElementById('productsTitle');
    const showAllBtn = document.getElementById('showAllBtn');
    const contactForm = document.getElementById('contactForm');
    const productModal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');

    const brandNames = {
        'milwaukee': 'MILWAUKEE БАГАЖ',
        'senergy': 'SENERGY САМБАР',
        'ujin': 'U-JIN КАБЕЛЬ',
        'schneider': 'SCHNEIDER УНТРААЛГА, РОЗЕТКА',
        'jinko': 'JINKO SOLAR НАРНЫ ХАВТАН',
        'eaton': 'EATON B-LINE КАБЕЛЬ ТАВИУР',
        'midea': 'MIDEA ГЭРЭЛ',
        'chint': 'CHINT АВТОМАТ',
        'schneider-breaker': 'SCHNEIDER АВТОМАТ',
        'burndy': 'BURNDY ГАЗАРДУУЛГА'
    };

    const categoryMap = {
        'senergy': ['senergy'],
        'jinko': ['jinko'],
        'ujin': ['ujin'],
        'milwaukee': ['milwaukee'],
        'midea': ['midea'],
        'schneider': ['schneider'],
        'chint': ['chint'],
        'eaton': ['eaton'],
        'schneider-breaker': ['schneider-breaker'],
        'burndy': ['burndy'],
        'sale': []
    };

    // Dropdown toggle
    dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
        dropdown.classList.remove('open');
    });

    dropdown.querySelector('.dropdown-menu').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Dropdown links
    dropdown.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            const text = link.textContent.trim();
            if (category === 'sale') {
                filterBySale();
            } else if (category && categoryMap[category]) {
                filterByBrand(category, text);
            }
            dropdown.classList.remove('open');
        });
    });

    // Brand card click
    document.querySelectorAll('.brand-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const brand = card.dataset.brand;
            const brandTitle = brandNames[brand] || brand.toUpperCase();
            filterByBrand(brand, brandTitle);
        });
    });

    // Show all products
    showAllBtn.addEventListener('click', () => {
        showAllProducts();
    });

    function filterByBrand(brand, title) {
        const cards = productsGrid.querySelectorAll('.product-card');
        let count = 0;
        cards.forEach(card => {
            if (card.dataset.brand === brand) {
                card.style.display = '';
                card.style.animation = 'fadeInUp 0.4s ease forwards';
                count++;
            } else {
                card.style.display = 'none';
            }
        });
        productsTitle.textContent = title || brandNames[brand] || 'БҮТЭЭГДЭХҮҮН';
        showAllBtn.style.display = 'inline-flex';
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        showToast(`${count} бүтээгдэхүүн харагдаж байна`);
    }

    function filterBySale() {
        const cards = productsGrid.querySelectorAll('.product-card');
        let count = 0;
        cards.forEach(card => {
            const badge = card.querySelector('.badge');
            if (badge && badge.textContent.includes('%')) {
                card.style.display = '';
                card.style.animation = 'fadeInUp 0.4s ease forwards';
                count++;
            } else {
                card.style.display = 'none';
            }
        });
        productsTitle.textContent = 'ХЯМДРАЛТАЙ БҮТЭЭГДЭХҮҮН';
        showAllBtn.style.display = 'inline-flex';
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        showToast(`${count} хямдралтыг бүтээгдэхүүн харагдаж байна`);
    }

    function showAllProducts() {
        const cards = productsGrid.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.display = '';
            card.style.animation = `fadeInUp 0.4s ease ${index * 0.02}s forwards`;
        });
        productsTitle.textContent = 'БҮХ БҮТЭЭГДЭХҮҮН';
        showAllBtn.style.display = 'none';
    }

    // Search
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const term = searchInput.value.trim().toLowerCase();
        if (!term) {
            showAllProducts();
            return;
        }

        const cards = productsGrid.querySelectorAll('.product-card');
        let found = 0;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(term)) {
                card.style.display = '';
                card.style.animation = 'fadeInUp 0.4s ease forwards';
                found++;
            } else {
                card.style.display = 'none';
            }
        });

        if (found === 0) {
            showToast('Хайлтад тохирох бараа олдсонгүй');
            showAllProducts();
        } else {
            productsTitle.textContent = `ХАЙЛТЫН ҮР ДҮН: "${searchInput.value}"`;
            showAllBtn.style.display = 'inline-flex';
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    });

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            showAllProducts();
        }
    });

    // Add to cart
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const name = card.dataset.name;
            showToast(`${name} сагсанд нэмэгдлээ`);
        });
    });

    // Product detail buttons
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            openModal(card);
        });
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function openModal(card) {
        const brand = card.dataset.brand;
        const name = card.dataset.name;
        const price = card.querySelector('.price').textContent;
        const oldPrice = card.querySelector('.old-price').textContent;
        const sku = card.querySelector('.sku').textContent;
        const desc = card.querySelector('.product-desc').textContent;
        const stock = card.querySelector('.stock').textContent;
        const bg = card.querySelector('.product-img').style.background;

        document.getElementById('modalBrand').textContent = brandNames[brand] || brand;
        document.getElementById('modalTitle').textContent = name;
        document.getElementById('modalSku').textContent = sku;
        document.getElementById('modalDesc').textContent = desc;
        document.getElementById('modalPrice').textContent = price;
        document.getElementById('modalOldPrice').textContent = oldPrice;
        document.getElementById('modalStock').textContent = stock;
        document.getElementById('modalImg').style.background = bg;

        const specs = generateSpecs(name, brand);
        const specsList = document.getElementById('modalSpecs');
        specsList.innerHTML = specs.map(spec => `<li>${spec}</li>`).join('');

        const modalAddCart = document.getElementById('modalAddCart');
        modalAddCart.onclick = () => {
            showToast(`${name} сагсанд нэмэгдлээ`);
            closeModal();
        };

        productModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        productModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    function generateSpecs(name, brand) {
        const common = ['Чанарын баталгаа: 12 сар', 'Монгол улсад бүртгэлтэй', 'Барилгын стандарт MNS-д нийцсэн'];
        const brandSpecs = {
            'milwaukee': ['POWERSTATE бүрхүүлгүй мотор', 'REDLITHIUM батерей технологи', 'REDLINK PLUS электроник', '5 жилийн баталгаа'],
            'senergy': ['IEC 61439 стандартад нийцсэн', 'IP40/IP65 хамгаалалт', 'Галд тэсвэртэй материал', 'Busbar бүрэн угсарсан'],
            'ujin': ['IEC 60502 стандарт', 'Зэс дамжуулагч', 'Хөндийлөхгүй бүрээс', '-40°C хүртэл тэсвэртэй'],
            'schneider': ['IEC/EN 60898 стандарт', '6кА таслах чадал', 'DIN rail суурьлуулалт', '2 жилийн баталгаа'],
            'jinko': ['IEC 61215 / IEC 61730', '25 жилийн хүчин чадлын баталгаа', 'PID тэсвэртэй', '540-600W хүртэл'],
            'eaton': ['NEMA VE 1 / IEC 61537', 'Ган цайрдсан / хуванцар бүрээстэй', '3м стандарт урт', 'Бүрэн дагалдах хэрэгсэл'],
            'midea': ['50000 цаг ашиглалтын хугацаа', 'Ra>80 өнгө дамжуулалт', 'IP20/IP65 хувилбар', '3 жилийн баталгаа'],
            'chint': ['GB 10963 / IEC 60898', '6кА таслах чадал', 'C/D характеристик', 'Эдийн засгийн үнэ'],
            'schneider-breaker': ['IEC 60947-2 стандарт', 'Masterpact / Compact NSX сери', '50кА хүртэл таслах', 'Micrologic удирдлага'],
            'burndy': ['IEEE 837 / UL 467', 'Зэс/бронз материал', 'Exothermic гагнуур', 'Мөнх бат холболт']
        };
        return [...(brandSpecs[brand] || []), ...common];
    }

    // Auth modal
    const authModal = document.getElementById('authModal');
    const authToggle = document.getElementById('authToggle');
    const authModalClose = document.getElementById('authModalClose');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    function openAuthModal(tab = 'login') {
        switchAuthTab(tab);
        authModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeAuthModal() {
        authModal.classList.remove('open');
        document.body.style.overflow = '';
        loginForm.reset();
        registerForm.reset();
    }

    function switchAuthTab(tab) {
        authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        authForms.forEach(f => f.classList.toggle('active', f.dataset.form === tab));
    }

    authToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('mmsUser') || 'null');
        if (currentUser) {
            if (confirm(`${currentUser.name} та гарчих уу?`)) {
                localStorage.removeItem('mmsUser');
                updateAuthUI();
                showToast('Системээс гарлаа');
            }
        } else {
            openAuthModal('login');
        }
    });

    authModalClose.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
    });

    document.querySelectorAll('.switch-tab').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthTab(link.dataset.tab);
        });
    });

    function getUsers() {
        return JSON.parse(localStorage.getItem('mmsUsers') || '[]');
    }

    function saveUsers(users) {
        localStorage.setItem('mmsUsers', JSON.stringify(users));
    }

    function updateAuthUI() {
        const user = JSON.parse(localStorage.getItem('mmsUser') || 'null');
        if (user) {
            authToggle.textContent = user.name;
            authToggle.classList.add('user-name');
        } else {
            authToggle.textContent = 'Нэвтрэх';
            authToggle.classList.remove('user-name');
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('mmsUser', JSON.stringify(user));
            updateAuthUI();
            closeAuthModal();
            showToast(`Тавтай морил, ${user.name}`);
        } else {
            showToast('И-мэйл эсвэл нууц үг буруу байна');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerConfirm').value;

        if (password !== confirm) {
            showToast('Нууц үг таарахгүй байна');
            return;
        }

        const users = getUsers();
        if (users.some(u => u.email === email)) {
            showToast('Энэ и-мэйлээр бүртгэл байна');
            return;
        }

        const newUser = { name, email, phone, password };
        users.push(newUser);
        saveUsers(users);
        localStorage.setItem('mmsUser', JSON.stringify(newUser));
        updateAuthUI();
        closeAuthModal();
        showToast('Амжилттай бүртгэгдлээ');
    });

    updateAuthUI();

    // Topbar links / cart placeholder
    document.querySelectorAll('.topbar a:not(#authToggle)').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || !href) {
                e.preventDefault();
                const label = link.textContent.trim() || 'Энэ хэсэг';
                showToast(`${label} удахгүй нээгдэнэ`);
            }
        });
    });

    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Мессеж илгээгдлээ. Баярлалаа!');
        contactForm.reset();
    });

    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
