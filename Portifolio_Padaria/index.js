document.addEventListener('DOMContentLoaded', () => {

    // --- Throttle Function for Performance Optimization ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }


    // --- Header Transparency Logic ---
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        // Função para lidar com a mudança de cor do header ao rolar
        const handleScroll = () => {
            if (window.scrollY > 50) { // Adiciona a classe após rolar 50px
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        // Adiciona o evento de scroll com otimização (throttle)
        window.addEventListener('scroll', throttle(handleScroll, 100));
    }

    // Reusable Carousel Logic
    function initializeCarousel(carouselElement, intervalTime = 7000) {
        const carouselInner = carouselElement.querySelector('.carousel-inner');
        const items = carouselElement.querySelectorAll('.carousel-item');
        const prevButton = carouselElement.querySelector('.carousel-control.prev');
        const nextButton = carouselElement.querySelector('.carousel-control.next');
        let currentIndex = 0;
        const totalItems = items.length;
        let autoPlayInterval;

        function showSlide(index) {
            items.forEach(item => item.classList.remove('active'));
            items[index].classList.add('active');
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalItems;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            showSlide(currentIndex);
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, intervalTime);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // Initialize the carousel
        showSlide(currentIndex);
        startAutoPlay();

        return {
            reset: () => {
                currentIndex = 0;
                showSlide(currentIndex);
                resetAutoPlay();
            },
            stop: stopAutoPlay,
            start: startAutoPlay
        };
    }

    // Initialize Hero Carousel
    const heroCarouselElement = document.querySelector('#hero .carousel');
    let heroCarousel;
    if (heroCarouselElement) {
        heroCarousel = initializeCarousel(heroCarouselElement);
    }

    // --- Theme Toggle (Dark/Light Mode) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = document.getElementById('theme-toggle-sun');
    const moonIcon = document.getElementById('theme-toggle-moon');

    // Função para aplicar o tema
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            if (sunIcon && moonIcon) {
                sunIcon.style.display = 'block'; // No modo escuro, mostre o sol (para voltar ao claro)
                moonIcon.style.display = 'none';
            }
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            if (sunIcon && moonIcon) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block'; // No modo claro, mostre a lua (para ir para o escuro)
            }
        }
    };

    // Verifica o tema salvo no localStorage ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Aplica o tema inicial
    applyTheme(initialTheme);
    // Garante que os ícones corretos sejam exibidos na carga inicial
    if (initialTheme === 'dark') {
        if (sunIcon && moonIcon) { sunIcon.style.display = 'none'; moonIcon.style.display = 'block'; }
    } else {
        if (sunIcon && moonIcon) { sunIcon.style.display = 'block'; moonIcon.style.display = 'none'; }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Alterna o tema atual
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
            // Salva a nova preferência no localStorage
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Modal Logic ---
    const modal = document.getElementById('hero-modal');
    const openModalBtn = document.querySelector('.btn-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const modalCarouselElement = document.querySelector('#hero-modal .carousel');
    let modalCarousel;

    if (modal && openModalBtn && closeModalBtn && modalCarouselElement) {
        modalCarousel = initializeCarousel(modalCarouselElement, 5000); // Shorter interval for modal carousel

        // Function to open the modal
        const openModal = () => {
            modal.style.display = 'block';
            if (modalCarousel) {
                modalCarousel.reset(); // Reset and start modal carousel when opened
                modalCarousel.start();
            }
            if (heroCarousel) {
                heroCarousel.stop(); // Stop hero carousel when modal is open
            }
        };

        // Function to close the modal
        const closeModal = () => {
            modal.style.display = 'none';
            if (modalCarousel) {
                modalCarousel.stop(); // Stop modal carousel when closed
            }
            if (heroCarousel) {
                heroCarousel.start(); // Resume hero carousel when modal is closed
            }
        };

        // Event listeners
        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);

        // Close modal if user clicks outside of the modal content
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});
