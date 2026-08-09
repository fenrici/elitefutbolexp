// Elite Futbol Experience - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if(this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if(targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Update active nav link based on scroll position
    function highlightNav() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if(scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    function headerScroll() {
        if (!header) return;
        // Navbar visual is driven by CSS classes (see navbar-scroll.js + styles.css)
    }
    
    // Apply the functions on scroll
    window.addEventListener('scroll', () => {
        highlightNav();
        headerScroll();
    });
    
    // Form validation and submission with Formspree
    const applicationForm = document.getElementById('application-form');
    
    if(applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            // No preventDefault here, so form will actually submit if valid
            
            // Basic form validation
            let isValid = true;
            const requiredFields = applicationForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if(!field.value.trim()) {
                    e.preventDefault(); // Prevent form submission if invalid
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    let errorMsg = field.parentElement.querySelector('.error-message');
                    if(!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'Este campo es obligatorio';
                        field.parentElement.appendChild(errorMsg);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.parentElement.querySelector('.error-message');
                    if(errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if(emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailPattern.test(emailField.value)) {
                    e.preventDefault(); // Prevent form submission if invalid
                    isValid = false;
                    emailField.classList.add('error');
                    
                    let errorMsg = emailField.parentElement.querySelector('.error-message');
                    if(!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'Por favor, introduce una dirección de email válida';
                        emailField.parentElement.appendChild(errorMsg);
                    } else {
                        errorMsg.textContent = 'Por favor, introduce una dirección de email válida';
                    }
                }
            }
            
            // If form is valid, show loading state
            if(isValid) {
                const submitButton = applicationForm.querySelector('button[type="submit"]');
                if(submitButton) {
                    // Save original text
                    const originalText = submitButton.textContent;
                    
                    // Show loading state
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                    
                    // Restore button after form redirects (user may cancel or go back)
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    }, 10000);
                    
                    // If Formspree redirects, we won't get here, but if something
                    // goes wrong and we stay on the page, show our error message
                    setTimeout(() => {
                        // If we're still on the page after 5 seconds, show error
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                        showErrorNotification();
                    }, 5000);
                }
            }
        });
        
        // Remove error styling when fields are being edited
        const formFields = applicationForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if(errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    }
    
    // Function to show success notification (used when we return from Formspree)
    function showSuccessNotification() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <p>¡Tu solicitud ha sido enviada con éxito! Nuestro equipo se pondrá en contacto contigo pronto.</p>
                <p class="notification-detail">La información ha sido enviada a francoenrici06@gmail.com</p>
                <button class="close-btn">&times;</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Add closing functionality to the notification
        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        // Automatically remove the notification after 8 seconds
        setTimeout(() => {
            notification.remove();
        }, 8000);
    }
    
    // Function to show error notification
    function showErrorNotification() {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <p>Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo o contacta directamente por teléfono.</p>
                <button class="close-btn">&times;</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Add closing functionality to the notification
        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        // Automatically remove the notification after 8 seconds
        setTimeout(() => {
            notification.remove();
        }, 8000);
    }
    
    // Check if we're returning from Formspree submission (for success message)
    if (window.location.search.includes('submitted=true')) {
        showSuccessNotification();
        
        // Clear URL parameters to prevent showing notification on refresh
        if (window.history && window.history.replaceState) {
            const cleanUrl = window.location.href.split('?')[0];
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }
    
    // Add CSS for form error and notification
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #d63031;
        }
        
        .error-message {
            color: #d63031;
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        .success-notification,
        .error-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease-out;
        }
        
        .success-notification {
            background-color: #28a745;
        }
        
        .error-notification {
            background-color: #d63031;
        }
        
        .notification-detail {
            font-size: 0.85rem;
            opacity: 0.9;
            margin-top: 5px !important;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .notification-content {
            display: flex;
            flex-direction: column;
            padding: 15px 20px;
        }
        
        .notification-content i {
            font-size: 1.5rem;
            margin-bottom: 10px;
        }
        
        .notification-content p {
            margin: 0;
        }
        
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0 5px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .fa-spinner {
            animation: spin 1s linear infinite;
            margin-right: 5px;
        }
    `;
    document.head.appendChild(style);
    
    // Create folder for images - Nota: Esto normalmente se haría en el servidor
    function createImagesFolder() {
        console.log('La carpeta de imágenes se crearía en el lado del servidor');
    }
    
    createImagesFolder();
    
    // Menú fullscreen (mobile)
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        const menuClose = mobileMenu.querySelector('.mobile-menu__close');

        const openMenu = () => {
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.classList.add('menu-open');
            menuToggle.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        const toggleMenu = () => {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Accesibilidad: abrir con Enter/Espacio (el toggle es un div con role="button")
        menuToggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        if (menuClose) {
            menuClose.addEventListener('click', closeMenu);
        }

        // Cerrar al pulsar un enlace de navegación o el CTA (no al cambiar idioma)
        mobileMenu.querySelectorAll('.mobile-menu__nav a, .mobile-menu__cta').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Cerrar con Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // Toggle de idioma del header (mobile): muestra el idioma activo y alterna al otro
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        const currentLang = () => document.documentElement.lang || localStorage.getItem('language') || 'es';
        const syncLabel = () => { langToggle.textContent = currentLang().toUpperCase(); };

        syncLabel();

        // Mantener la etiqueta sincronizada ante cualquier cambio de idioma
        new MutationObserver(syncLabel).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang'],
        });

        langToggle.addEventListener('click', function () {
            const next = currentLang() === 'es' ? 'en' : 'es';
            if (typeof setLanguage === 'function') {
                setLanguage(next);
            }
        });
    }

    // Accordion de la sección Programas — solo mobile (≤768px), selección única.
    initProgramsAccordion();
});

function initProgramsAccordion() {
    const cards = Array.from(document.querySelectorAll('#programs .program-card'));
    if (!cards.length) return;

    const mq = window.matchMedia('(max-width: 768px)');

    cards.forEach(function (card, idx) {
        const content = card.querySelector('.program-content');
        if (!content) return;
        const srcTitle = content.querySelector('h3');
        const srcPrice = content.querySelector('.price');
        if (!content.id) content.id = 'program-panel-' + idx;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'program-toggle';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', content.id);

        const textWrap = document.createElement('span');
        textWrap.className = 'program-toggle__text';
        const titleSpan = document.createElement('span');
        titleSpan.className = 'program-toggle__title';
        const priceSpan = document.createElement('span');
        priceSpan.className = 'program-toggle__price';
        textWrap.appendChild(titleSpan);
        textWrap.appendChild(priceSpan);

        const icon = document.createElement('span');
        icon.className = 'program-toggle__icon';
        icon.setAttribute('aria-hidden', 'true');

        btn.appendChild(textWrap);
        btn.appendChild(icon);

        // Insertar el header justo antes del contenido (tras el featured-tag si existe)
        card.insertBefore(btn, content);

        card._efx = { btn: btn, content: content, titleSpan: titleSpan, priceSpan: priceSpan, srcTitle: srcTitle, srcPrice: srcPrice };
        btn.addEventListener('click', function () { toggleCard(card); });
    });

    function syncLabels() {
        cards.forEach(function (card) {
            const d = card._efx;
            if (!d) return;
            if (d.srcTitle) d.titleSpan.textContent = d.srcTitle.textContent.trim();
            if (d.srcPrice) d.priceSpan.textContent = d.srcPrice.textContent.trim();
        });
    }
    syncLabels();
    new MutationObserver(syncLabels).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang'],
    });

    function openCard(card) {
        const d = card._efx;
        card.classList.add('is-open');
        d.btn.setAttribute('aria-expanded', 'true');
        d.content.style.maxHeight = d.content.scrollHeight + 'px';

        // Al terminar la apertura, liberar el límite para no recortar el CTA
        const onEnd = function (e) {
            if (e.target !== d.content || e.propertyName !== 'max-height') return;
            d.content.removeEventListener('transitionend', onEnd);
            if (card.classList.contains('is-open')) {
                d.content.style.maxHeight = 'none';
            }
        };
        d.content.addEventListener('transitionend', onEnd);
    }

    function closeCard(card) {
        const d = card._efx;
        // Volver de 'none' a un valor concreto para poder animar el cierre
        d.content.style.maxHeight = d.content.scrollHeight + 'px';
        void d.content.offsetHeight; // reflow
        card.classList.remove('is-open');
        d.btn.setAttribute('aria-expanded', 'false');
        d.content.style.maxHeight = '0px';
    }

    function toggleCard(card) {
        if (card.classList.contains('is-open')) {
            closeCard(card);
            return;
        }
        cards.forEach(function (c) {
            if (c !== card && c.classList.contains('is-open')) closeCard(c);
        });
        openCard(card);
    }

    // Recalcular la altura del panel abierto al redimensionar
    window.addEventListener('resize', function () {
        if (!mq.matches) return;
        cards.forEach(function (card) {
            if (card.classList.contains('is-open')) {
                card._efx.content.style.maxHeight = card._efx.content.scrollHeight + 'px';
            }
        });
    });

    // Al salir de mobile, limpiar estados/estilos para no afectar desktop
    function handleViewportChange() {
        if (mq.matches) return;
        cards.forEach(function (card) {
            card.classList.remove('is-open');
            card._efx.btn.setAttribute('aria-expanded', 'false');
            card._efx.content.style.maxHeight = '';
        });
    }
    if (mq.addEventListener) {
        mq.addEventListener('change', handleViewportChange);
    } else if (mq.addListener) {
        mq.addListener(handleViewportChange);
    }
    handleViewportChange();
} 