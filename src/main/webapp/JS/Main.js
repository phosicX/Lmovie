document.addEventListener('DOMContentLoaded', function() {
    // 工具函数
    const utils = {
        $(selector) { return document.querySelector(selector); },
        $$(selector) { return document.querySelectorAll(selector); },
        storage: {
            get(key) { return localStorage.getItem(key); },
            set(key, value) { localStorage.setItem(key, value); },
            remove(key) { localStorage.removeItem(key); }
        }
    };

    // 主题管理模块
    const themeManagerModule = {
        init() {
            this.elements = {
                toggleSwitch: utils.$('#theme-checkbox'),
                themeSwitch: utils.$('.theme-switch')
            };

            if (!this.elements.toggleSwitch || !this.elements.themeSwitch) {
                console.error('未找到主题切换开关');
                return;
            }

            this.bindEvents();
            this.initTheme();
            this.watchSystemTheme();
        },

        bindEvents() {
            this.elements.toggleSwitch.addEventListener('change', (e) => this.switchTheme(e));
        },

        updateThemeState(isDark) {
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            this.elements.toggleSwitch.checked = isDark;
            
            const targetTheme = isDark ? '浅色' : '深色';
            this.elements.themeSwitch.title = `点击切换至${targetTheme}模式`;
            this.elements.themeSwitch.ariaLabel = `切换到${targetTheme}模式`;
            
            console.log(`切换到${isDark ? '深色' : '浅色'}模式`);
        },

        switchTheme(e) {
            const isDark = e.target.checked;
            this.updateThemeState(isDark);
        },

        initTheme() {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            console.log(`使用系统主题: ${systemPrefersDark ? '深色' : '浅色'}模式`);
            
            this.updateThemeState(systemPrefersDark);
        },

        watchSystemTheme() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                this.updateThemeState(e.matches);
                console.log(`系统主题已切换为${e.matches ? '深色' : '浅色'}模式，网页已跟随变化`);
            });
        }
    };

    // 页面导航模块
    const pageNavigationModule = {
        pages: {},
        navButtons: {},
        navItems: [],
        currentPage: 'home',
        indicator: null,
        navContainer: null,

        init() {
            this.pages = {
                home: utils.$('#homePage'),
                movie: utils.$('#moviePage'),
                tvDrama: utils.$('#tvDramaPage'),
                animat: utils.$('#animatPage'),
                rank: utils.$('#rankPage')
            };

            this.navButtons = {
                home: utils.$('#homeBtn'),
                movie: utils.$('#movieBtn'),
                tvDrama: utils.$('#tvDrama'),
                animat: utils.$('#animatBtn'),
                rank: utils.$('#rankBtn')
            };

            this.indicator = utils.$('.nav-indicator');
            this.navContainer = utils.$('.nav-container');
            this.navItems = Array.from(document.querySelectorAll('.nav-bar ul li'));

            this.bindNavigationEvents();
            this.bindResizeEvent(); 
            this.showPage(this.currentPage);
            this.updateIndicator();
        },     

        bindResizeEvent() {
            window.addEventListener('resize', () => {
                this.handleResize();
            });
        },
        
        bindNavigationEvents() {
            Object.keys(this.navButtons).forEach(pageKey => {
                if (this.navButtons[pageKey]) {
                    this.navButtons[pageKey].addEventListener('click', () => {
                        this.showPage(pageKey);
                    });
                }
            });
        },
        
        showPage(pageKey) {
            Object.values(this.pages).forEach(page => {
                if (page) {
                    page.classList.remove('selected');
                }
            });

            this.navItems.forEach(item => {
                item.classList.remove('active');
            });

            if (this.pages[pageKey]) {
                this.pages[pageKey].classList.add('selected');
                if (this.navButtons[pageKey]) {
                    this.navButtons[pageKey].classList.add('active');
                }
                
                this.currentPage = pageKey;
                this.updateIndicator();
                window.scrollTo(0, 0);
            }
        },
        
        updateIndicator() {
            const activeItem = this.navButtons[this.currentPage];
            if (!activeItem || !this.indicator) return;

            const itemRect = activeItem.getBoundingClientRect();
            const containerRect = this.navContainer.getBoundingClientRect();
            
            let left, width;
            
            if (window.innerWidth < 768) {
                const iconWidth = 30; // 图标固定宽度
                width = iconWidth;
                left = itemRect.left - containerRect.left + (itemRect.width - iconWidth) / 2;
            } else {
                width = itemRect.width;
                left = itemRect.left - containerRect.left;
            }
            
            this.indicator.style.left = `${left}px`;
            this.indicator.style.width = `${width}px`;
            this.indicator.classList.add('active');
        },
        
        handleResize() {
            this.updateIndicator();
        }
    };

    // 动态内容加载模块
    const dynamicContentModule = {
        elements: {
            movieContainer: null,
            tvDramaContainer: null,
            animatContainer: null,
            loadMoreBtns: null
        },

        currentPageType: null,

        init() {
            this.elements.movieContainer = utils.$('#moviePage .card-container');
            this.elements.tvDramaContainer = utils.$('#tvDramaPage .card-container');
            this.elements.animatContainer = utils.$('#animatPage .card-container');
            this.elements.loadMoreBtns = document.querySelectorAll('.load-more');

            if (!this.elements.movieContainer || 
                !this.elements.tvDramaContainer || 
                !this.elements.animatContainer) {
                console.error('未找到卡片容器');
                return;
            }

            this.elements.loadMoreBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.loadMore();
                });
            });

            this.bindPageChangeListener();

            console.log('动态内容模块初始化完成');
        },

        bindPageChangeListener() {
            const originalShowPage = pageNavigationModule.showPage.bind(pageNavigationModule);

            pageNavigationModule.showPage = (pageKey) => {
                originalShowPage(pageKey);

                setTimeout(() => {
                    this.onPageChange(pageKey);
                }, 100);
            };
        },

        async onPageChange(pageKey) {
            const pageMap = {
                home: null,
                movie: 'movie',
                tvDrama: 'tv_drama',
                animat: 'anime',    
                rank: null
            };

            this.currentPageType = pageMap[pageKey];

            if (this.currentPageType) {
                await this.loadInitialContent(this.currentPageType);
            }

            this.updateLoadMoreButton();
        },

        async loadInitialContent(pageType) {
            const container = this.getContainer(pageType);
            if (!container) return;

            container.innerHTML = '';

            if (typeof mediaDataManager !== 'undefined') {
                mediaDataManager.resetPage(pageType);
            }

            await this.loadMore('initial');
        },

        async loadMore(loadType = 'more') {
            if (!this.currentPageType) return;

            if (typeof mediaDataManager !== 'undefined') {
                const items = await mediaDataManager.loadMoreItems(this.currentPageType, loadType);
                this.renderItems(items, this.currentPageType);
                this.updateLoadMoreButton();
            }
        },

        renderItems(items, pageType) {
            if (!items || items.length === 0) return;

            const container = this.getContainer(pageType);
            if (!container) return;

            items.forEach(item => {
                const card = this.createCardElement(item);
                container.appendChild(card);
            });
        },

        createCardElement(item) {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.movieId = item.id;

            const poster = document.createElement('div');
            poster.className = 'poster';

            const img = document.createElement('img');
            img.src = item.poster || '';
            img.alt = item.titles?.zh || '';
            img.loading = 'lazy';

            const brief = document.createElement('div');
            brief.className = 'brief-info';

            const score = document.createElement('div');
            score.className = 'score';

            const douban = document.createElement('span');
            douban.className = 'douban';
            douban.textContent = item.scores?.douban?.value || 'N/A';

            const imdb = document.createElement('span');
            imdb.className = 'imdb';
            imdb.textContent = item.scores?.imdb?.value || 'N/A';

            score.append(douban, imdb);

            const type = document.createElement('span');
            type.textContent = this.formatTypeText(item);

            brief.append(score, type);
            poster.append(img, brief);

            const title = document.createElement('h4');
            title.textContent = item.titles?.zh || '未知标题';

            poster.addEventListener('click', async (e) => {
                await movieModalModule.handleMovieDetailTrigger(e, item.id, 'poster');
            });

            card.append(poster, title);
            return card;
        },

        formatTypeText(item) {
            if (!item.info?.genres) {
                return item.year ? `剧情/${item.year}` : '剧情';
            }

            const separators = [' / ', '/', '、'];
            let genres = [];

            for (const sep of separators) {
                if (item.info.genres.includes(sep)) {
                    genres = item.info.genres.split(sep).map(g => g.trim());
                    break;
                }
            }

            if (!genres.length) genres = [item.info.genres.trim()];

            const display = genres.slice(0, 2).join('/');
            return item.year ? `${display}/${item.year}` : display;
        },

        getContainer(pageType) {
            switch (pageType) {
                case 'movie': return this.elements.movieContainer;
                case 'tv_drama': return this.elements.tvDramaContainer;
                case 'anime': return this.elements.animatContainer;
                default: return null;
            }
        },

        updateLoadMoreButton() {
            if (!this.currentPageType) return;

            const pageSelectorMap = {
                movie: '#moviePage',
                tvDrama: '#tvDramaPage',
                animat: '#animatPage'
            };

            const selector = pageSelectorMap[this.currentPageType];
            const btn = document.querySelector(`${selector} .load-more`);
            if (!btn) return;

            const hasMore = mediaDataManager?.hasMoreItems(this.currentPageType);
            btn.classList.toggle('hidden', !hasMore);
        }
    };

    // 电影详情模态框模块
    const movieModalModule = {
        elements: {
            modal: null,
            modalContent: null,
            closeBtn: null,
            detailPoster: null,
            movieName: null,
            movieInfo: null,
            movieScore: null,
            movieIntro: null
        },

        init() {
            this.elements.modal = document.querySelector('#movieModal');
            if (!this.elements.modal) return;

            this.elements.modalContent = this.elements.modal.querySelector('.modal-content');
            this.elements.closeBtn = document.querySelector('#closeModal');
            this.elements.detailPoster = document.querySelector('#detailPoster');
            this.elements.movieName = document.querySelector('#movieName');
            this.elements.movieInfo = document.querySelector('#movieInfo');
            this.elements.movieScore = document.querySelector('#movieScore');
            this.elements.movieIntro = document.querySelector('#movieIntro');

            this.bindModalEvents();
            this.bindPosterEvents();
            this.bindDetailButtonEvents();
        },

        bindModalEvents() {
            this.elements.closeBtn?.addEventListener('click', () => this.hideModal());

            this.elements.modal?.addEventListener('click', (e) => {
                if (e.target === this.elements.modal) {
                    this.hideModal();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.elements.modal.classList.contains('active')) {
                    this.hideModal();
                }
            });
        },

        bindPosterEvents() {
            document.querySelectorAll('.poster').forEach(poster => {
                poster.addEventListener('click', (e) => {
                    const card = e.target.closest('[data-movie-id]');
                    if (!card) return;

                    const movieId = card.getAttribute('data-movie-id');
                    this.handleMovieDetailTrigger(e, movieId, 'poster');
                });
            });
        },

        bindDetailButtonEvents() {
            document.querySelectorAll('.detail-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const banner = e.target.closest('.banner');
                    if (!banner) return;

                    const movieId = banner.getAttribute('data-movie-id');
                    this.handleMovieDetailTrigger(e, movieId, 'button');
                });
            });
        },

        async handleMovieDetailTrigger(e, movieId, triggerType = 'poster') {
            const movie = await this.fetchMovieDetail(movieId);
            if (!movie) return;

            this.updateMovieDetail(movie);

            if (triggerType === 'poster') {
                this.animateModalOpenFromPoster(e);
            } else {
                this.showModal();
            }
        },

        async fetchMovieDetail(movieId) {
            try {
                const response = await fetch(`/api/movies?action=detail&id=${movieId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const movie = await response.json();
                
                // 转换为前端需要的格式
                return {
                    id: movie.id,
                    poster: movie.posterUrl,
                    titles: {
                        zh: movie.titleZh,
                        intl: movie.titleIntl
                    },
                    year: movie.year,
                    info: {
                        director: movie.director,
                        writers: movie.writers,
                        actors: movie.actors,
                        genres: movie.genres,
                        country: movie.country,
                        language: movie.language,
                        release: movie.releaseDate,
                        duration: movie.duration
                    },
                    scores: {
                        douban: { 
                            value: movie.doubanScore,
                            url: movie.doubanUrl
                        },
                        imdb: { 
                            value: movie.imdbScore,
                            url: movie.imdbUrl
                        }
                    },
                    intro: movie.intro
                };
            } catch (error) {
                console.error('获取电影详情失败:', error);
                return null;
            }
        },

        async showMovieDetail(movieId) {
            const movie = await this.fetchMovieDetail(movieId);
            if (!movie) return;
            
            this.updateMovieDetail(movie);
            this.showModal();
        },

        updateMovieDetail(movie) {
            if (!movie) return;

            this.elements.detailPoster.src = movie.poster || '';
            this.elements.detailPoster.alt = movie.titles?.zh || '';

            const titleZh = this.elements.movieName.querySelector('.title-zh');
            const titleEn = this.elements.movieName.querySelector('.title-intl');
            const movieYear = this.elements.movieName.querySelector('.movie-year');

            titleZh && (titleZh.textContent = movie.titles?.zh || '');
            titleEn && (titleEn.textContent = movie.titles?.intl || '');
            movieYear && (movieYear.textContent = movie.year ? `(${movie.year})` : '');

            this.elements.movieInfo?.querySelectorAll('[data-key]').forEach(item => {
                const key = item.dataset.key;
                const valueEl = item.querySelector('.value');
                if (valueEl && movie.info?.[key]) {
                    valueEl.textContent = movie.info[key];
                }
            });

            const doubanScore = this.elements.movieScore?.querySelector('.douban .score-value');
            const imdbScore = this.elements.movieScore?.querySelector('.imdb .score-value');
            const doubanLink = this.elements.movieScore?.querySelector('.douban');
            const imdbLink = this.elements.movieScore?.querySelector('.imdb');

            if (doubanScore) doubanScore.textContent = movie.scores?.douban?.value || '';
            if (imdbScore) imdbScore.textContent = movie.scores?.imdb?.value || '';
            if (doubanLink && movie.scores?.douban?.url) doubanLink.href = movie.scores.douban.url;
            if (imdbLink && movie.scores?.imdb?.url) imdbLink.href = movie.scores.imdb.url;

            this.elements.movieIntro && (this.elements.movieIntro.textContent = movie.intro || '');
        },

        animateModalOpenFromPoster(e) {
            const poster = e.target.closest('.poster');
            if (!poster || !this.elements.modalContent) return;

            // 记录来源
            this.lastTriggerPoster = poster;
            this.lastPosterRect = poster.getBoundingClientRect();

            const modalRect = this.elements.modalContent.getBoundingClientRect();

            const posterCenterX = this.lastPosterRect.left + this.lastPosterRect.width / 2;
            const posterCenterY = this.lastPosterRect.top + this.lastPosterRect.height / 2;

            const modalCenterX = window.innerWidth / 2;
            const modalCenterY = window.innerHeight / 2;

            const offsetX = posterCenterX - modalCenterX;
            const offsetY = posterCenterY - modalCenterY;

            const scaleX = this.lastPosterRect.width / modalRect.width;
            const scaleY = this.lastPosterRect.height / modalRect.height;
            const initialScale = Math.min(scaleX, scaleY) * 0.8;

            this.elements.modalContent.style.transition = 'none';
            this.elements.modalContent.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${initialScale})`;
            this.elements.modalContent.style.opacity = '0.5';

            this.elements.modal.classList.add('active');
            this.elements.modalContent.classList.add('active');
            document.body.style.overflow = 'hidden';

            this.elements.modalContent.offsetHeight;

            requestAnimationFrame(() => {
                this.elements.modalContent.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
                this.elements.modalContent.style.transform = 'translate(0, 0) scale(1)';
                this.elements.modalContent.style.opacity = '1';
            });
        },

        animateModalCloseToPoster() {
            if (!this.lastPosterRect || !this.elements.modalContent) {
                this.forceClose();
                return;
            }

            const modalRect = this.elements.modalContent.getBoundingClientRect();

            const posterCenterX = this.lastPosterRect.left + this.lastPosterRect.width / 2;
            const posterCenterY = this.lastPosterRect.top + this.lastPosterRect.height / 2;

            const modalCenterX = window.innerWidth / 2;
            const modalCenterY = window.innerHeight / 2;

            const offsetX = posterCenterX - modalCenterX;
            const offsetY = posterCenterY - modalCenterY;

            const scaleX = this.lastPosterRect.width / modalRect.width;
            const scaleY = this.lastPosterRect.height / modalRect.height;
            const targetScale = Math.min(scaleX, scaleY) * 0.8;

            this.elements.modalContent.style.transition = 'all 0.25s cubic-bezier(0.4,0,0.2,1)';
            this.elements.modalContent.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${targetScale})`;
            this.elements.modalContent.style.opacity = '0';

            setTimeout(() => {
                this.forceClose();
            }, 250);
        },

        hideModal() {
            if (this.lastPosterRect) {
                this.animateModalCloseToPoster();
            } else {
                this.forceClose();
            }
        },

        forceClose() {
            this.elements.modal.classList.remove('active');
            this.elements.modalContent.classList.remove('active');
            document.body.style.overflow = 'auto';

            this.elements.modalContent.style.transition = '';
            this.elements.modalContent.style.transform = '';
            this.elements.modalContent.style.opacity = '';

            this.lastPosterRect = null;
            this.lastTriggerPoster = null;
        },

        showModal() {
            this.lastPosterRect = null;
            this.lastTriggerPoster = null;

            this.elements.modal.classList.add('active');
            this.elements.modalContent.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // 轮播图模块
    const carouselModule = {
        currentIndex: 0,
        intervalId: null,
        slideInterval: 5000,
        
        elements: {
            carouselInner: null,
            carouselIndicators: null,
            prevBtn: null,
            nextBtn: null
        },

        init(carouselData) {
            this.elements.carouselInner = utils.$('.carousel-inner');
            this.elements.carouselIndicators = utils.$('.carousel-indicators');
            this.elements.prevBtn = utils.$('.prev');
            this.elements.nextBtn = utils.$('.next');

            if (!this.elements.carouselInner || !carouselData) return;

            this.createCarouselItems(carouselData);
            this.bindEvents();
            this.startAutoPlay();
        },

        createCarouselItems(carouselData) {
            this.elements.carouselInner.innerHTML = '';
            this.elements.carouselIndicators.innerHTML = '';

            carouselData.forEach((item, index) => {
                // 创建轮播项
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item';
                carouselItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="carousel-caption">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `;
                this.elements.carouselInner.appendChild(carouselItem);

                // 创建指示器
                const indicator = document.createElement('div');
                indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
                indicator.dataset.index = index;
                indicator.addEventListener('click', () => this.goToSlide(index));
                this.elements.carouselIndicators.appendChild(indicator);
            });
        },

        bindEvents() {
            if (this.elements.prevBtn) {
                this.elements.prevBtn.addEventListener('click', () => {
                    this.prevSlide();
                    this.resetAutoPlay();
                });
            }

            if (this.elements.nextBtn) {
                this.elements.nextBtn.addEventListener('click', () => {
                    this.nextSlide();
                    this.resetAutoPlay();
                });
            }

            if (this.elements.carouselInner) {
                this.elements.carouselInner.addEventListener('mouseenter', () => {
                    clearInterval(this.intervalId);
                });

                this.elements.carouselInner.addEventListener('mouseleave', () => {
                    this.startAutoPlay();
                });
            }
        },

        startAutoPlay() {
            this.intervalId = setInterval(() => {
                this.nextSlide();
            }, this.slideInterval);
        },

        nextSlide() {
            if (!this.elements.carouselInner) return;
            this.currentIndex = (this.currentIndex + 1) % (this.elements.carouselInner.children.length || 1);
            this.updateCarousel();
        },

        prevSlide() {
            if (!this.elements.carouselInner) return;
            this.currentIndex = (this.currentIndex - 1 + (this.elements.carouselInner.children.length || 1)) % (this.elements.carouselInner.children.length || 1);
            this.updateCarousel();
        },

        goToSlide(index) {
            if (!this.elements.carouselInner) return;
            this.currentIndex = index;
            this.updateCarousel();
        },

        updateCarousel() {
            if (!this.elements.carouselInner) return;
            
            this.elements.carouselInner.style.transform = `translateX(-${this.currentIndex * 100}%)`;

            const indicators = utils.$$('.indicator');
            indicators.forEach((indicator, index) => {
                if (index === this.currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        },

        resetAutoPlay() {
            clearInterval(this.intervalId);
            this.startAutoPlay();
        }
    };

    // 近期内容滑动模块
    const recentSliderModule = {
        init() {
            const scrollAmount = 300;
            const recentContainers = utils.$$('.recent-hot, .recent-new');
            
            recentContainers.forEach(container => {
                const recentContainer = container.querySelector('.recent-container');
                const prevBtn = container.querySelector('.recent-prev');
                const nextBtn = container.querySelector('.recent-next');
                
                if (!recentContainer || !prevBtn || !nextBtn) return;
                
                recentContainer.style.scrollBehavior = 'smooth';
                
                prevBtn.addEventListener('click', () => {
                    recentContainer.scrollLeft -= scrollAmount;
                });
                
                nextBtn.addEventListener('click', () => {
                    recentContainer.scrollLeft += scrollAmount;
                });
            });
        }
    };

    // 搜索功能模块
    const searchModule = {
        elements: {
            searchInput: null,
            searchOut: null,
            searchLabel: null
        },
        searchTimer: null,
        searchDelay: 300,
        minSearchLength: 1,
        maxResults: 8,

        init() {
            this.elements.searchInput = utils.$('#searchInput');
            this.elements.searchOut = utils.$('.search-out');
            this.elements.searchLabel = utils.$('label[for="searchInput"] img');

            if (!this.elements.searchInput || !this.elements.searchOut) {
                console.warn('搜索功能所需的DOM元素未找到');
                return;
            }

            this.bindEvents();
        },

        bindEvents() {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e);
            });

            if (this.elements.searchLabel) {
                this.elements.searchLabel.addEventListener('click', () => {
                    const searchTerm = this.elements.searchInput.value.trim();
                    if (searchTerm) {
                        this.performSearch(searchTerm);
                    } else {
                        this.toggleSearchResults();
                    }
                });
            }

            this.elements.searchInput.addEventListener('focus', (e) => {
                const searchTerm = this.elements.searchInput.value.trim();
                if (searchTerm) {
                    this.performSearch(searchTerm);
                }
                this.showSearchResults();
            });

            this.elements.searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    this.hideSearchResults();
                }, 200);
            });

            this.elements.searchOut.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search')) {
                    this.hideSearchResults();
                }
            });

            this.elements.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(this.elements.searchInput.value.trim());
                } else if (e.key === 'Escape') {
                    this.hideSearchResults();
                    this.elements.searchInput.blur();
                }
            });
        },

        handleSearchInput(e) {
            const searchTerm = e.target.value.trim();
            
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
            }

            if (searchTerm.length < this.minSearchLength) {
                this.hideSearchResults();
                return;
            }

            this.searchTimer = setTimeout(() => {
                this.performSearch(searchTerm);
            }, this.searchDelay);
        },

        async performSearch(searchTerm) {
            if (!searchTerm || searchTerm.length < this.minSearchLength) {
                this.showNoResults();
                return;
            }
            
            const results = await this.searchByName(searchTerm);
            
            if (results.length === 0) {
                this.showNoResults();
            } else {
                this.displayResults(results);
            }
        },

        async searchByName(searchTerm) {
            try {
                const response = await fetch(`/api/movies?action=search&keyword=${encodeURIComponent(searchTerm)}&limit=${this.maxResults}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const movies = await response.json();
                
                return movies.map(movie => ({
                    id: movie.id,
                    movie: {
                        id: movie.id,
                        poster: movie.posterUrl,
                        titles: {
                            zh: movie.titleZh,
                            intl: movie.titleIntl
                        },
                        year: movie.year,
                        scores: {
                            douban: {
                                value: movie.doubanScore,
                                url: movie.doubanUrl
                            },
                            imdb: {
                                value: movie.imdbScore,
                                url: movie.imdbUrl
                            }
                        },
                        info: {
                            director: movie.director,
                            writers: movie.writers,
                            actors: movie.actors,
                            genres: movie.genres,
                            country: movie.country,
                            language: movie.language,
                            release: movie.releaseDate,
                            duration: movie.duration
                        },
                        intro: movie.intro
                    },
                    score: 100
                }));
            } catch (error) {
                console.error('搜索失败:', error);
                return [];
            }
        },

        displayResults(results) {
            this.clearResults();

            results.forEach(result => {
                const resultItem = this.createResultItem(result);
                this.elements.searchOut.appendChild(resultItem);
            });

            this.showSearchResults();
        },

        createResultItem(result) {
            const movie = result.movie;
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.dataset.movieId = result.id;
            item.title = `点击查看详情 - ${movie.titles?.zh || ''}`;

            const posterImg = document.createElement('img');
            posterImg.className = 'poster-thumb';
            posterImg.src = movie.poster || '';
            posterImg.alt = movie.titles?.zh || '';
            posterImg.loading = 'lazy';
            posterImg.onerror = function() {
                this.src = '';
            };

            const infoDiv = document.createElement('div');
            infoDiv.className = 'search-result-info';

            const titleDiv = document.createElement('strong');
            titleDiv.className = 'search-result-title';
            titleDiv.textContent = movie.titles?.zh || '未知标题';

            const enTitleDiv = document.createElement('strong');
            enTitleDiv.className = 'search-result-title';
            enTitleDiv.textContent = movie.titles?.intl || '';

            infoDiv.appendChild(titleDiv);
            infoDiv.appendChild(enTitleDiv);
            
            item.appendChild(posterImg);
            item.appendChild(infoDiv);

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleResultClick(result.id);
            });

            return item;
        },

        handleResultClick(movieId) {
            this.elements.searchInput.value = '';
            
            if (movieModalModule) {
                movieModalModule.showMovieDetail(movieId);
            }
            
            this.hideSearchResults();
            
            setTimeout(() => {
                this.elements.searchInput.focus();
            }, 100);
        },

        showNoResults() {
            this.clearResults();
            
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'search-no-results';
            noResultsDiv.textContent = '暂未收录此影视';
            
            this.elements.searchOut.appendChild(noResultsDiv);
            this.showSearchResults();
        },

        clearResults() {
            this.elements.searchOut.innerHTML = '';
        },

        showSearchResults() {
            this.elements.searchOut.classList.add('active');
        },

        hideSearchResults() {
            this.elements.searchOut.classList.remove('active');
        },

        toggleSearchResults() {
            if (this.elements.searchOut.classList.contains('active')) {
                this.hideSearchResults();
            } else {
                this.showSearchResults();
            }
        },

        triggerSearch(searchTerm) {
            this.elements.searchInput.value = searchTerm;
            this.performSearch(searchTerm);
        }
    };

    // 卡片悬停效果模块
    const cardHoverModule = {
        init() {
            this.bindCardHoverEffects();
        },

        bindCardHoverEffects() {
            utils.$$('.banner .poster').forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    const cardRect = this.getBoundingClientRect();
                            
                    // 计算鼠标在卡片中的相对位置 (0到1之间)
                    const x = (e.clientX - cardRect.left) / cardRect.width;
                    const y = (e.clientY - cardRect.top) / cardRect.height;
                            
                    // 计算旋转角度，基于鼠标位置
                    const rotateY = (x - 0.5) * 20; // -10到10度
                    const rotateX = (0.5 - y) * 20; // -10到10度
                            
                    // 计算阴影偏移，基于鼠标位置
                    const shadowX = (x - 0.5) * 20;
                    const shadowY = (y - 0.5) * 20;
                            
                    // 应用变换
                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                    this.style.boxShadow = `${shadowX}px ${shadowY}px 20px var(--shadow-color)`;
                });

                card.addEventListener('mouseleave', function() {
                    // 鼠标离开时重置变换
                    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                    this.style.boxShadow = 'var(--shadow-sm) var(--shadow-color)';
                });
            });
        }
    };

    // 返回顶部功能模块
    const backToTopModule = {
        backToTopBtn: null,

        init() {
            this.backToTopBtn = utils.$('#backToTop');
            if (!this.backToTopBtn) return;

            this.bindEvents();
        },

        bindEvents() {
            this.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    this.backToTopBtn.classList.add('show');
                } else {
                    this.backToTopBtn.classList.remove('show');
                }
            });
        }
    };

    // 额外内容模块
    const footerAdditionalModule = {
        additionalElement: null,

        init() {
            this.additionalElement = utils.$('#additional');
            
            if (!this.additionalElement) {
                console.warn('未找到additional元素');
                return;
            }
            
            this.bindPageChangeListener();
        },
        
        bindPageChangeListener() {
            const originalShowPage = pageNavigationModule.showPage.bind(pageNavigationModule);
            
            pageNavigationModule.showPage = (pageKey) => {
                originalShowPage(pageKey);
                
                setTimeout(() => {
                    this.onPageChange(pageKey);
                }, 50);
            };
        },
        
        onPageChange(pageKey) {
            if (!this.additionalElement) return;
            
            if (pageKey === 'home') {
                this.showAdditional();
            } else {
                this.hideAdditional();
            }
        },
        
        showAdditional() {
            this.additionalElement.classList.remove('hidden');
        },
        
        hideAdditional() {
            this.additionalElement.classList.add('hidden');
        },
        
        checkInitialState() {
            if (this.additionalElement) {
                // 检查当前激活的页面
                const activePage = Array.from(utils.$$('section')).find(section => 
                    section.classList.contains('selected')
                );
                
                if (!activePage || activePage.id === 'homePage') {
                    this.showAdditional();
                } else {
                    this.hideAdditional();
                }
            }
        }
    };

    // 用户认证模块
    const authModule = {
        elements: {
            userConsole: null,
            loginPrompt: null,
            logoutBtn: null
        },

        init() {
            this.elements.userConsole = document.getElementById('userConsole');
            this.elements.loginPrompt = document.getElementById('loginPrompt');
            this.elements.logoutBtn = document.getElementById('logout');

            if (!this.elements.userConsole || !this.elements.loginPrompt) {
                console.warn('用户认证相关的DOM元素未找到');
                return;
            }

            this.bindEvents();
            this.checkLoginStatus();
            this.bindPageChangeListener();
        },

        bindEvents() {
            if (this.elements.logoutBtn) {
                this.elements.logoutBtn.addEventListener('click', () => {
                    this.logout();
                });
            }
        },

        bindPageChangeListener() {
            const originalShowPage = pageNavigationModule.showPage.bind(pageNavigationModule);
            
            pageNavigationModule.showPage = function(pageKey) {
                originalShowPage(pageKey);
                
                setTimeout(() => {
                    authModule.checkLoginStatus();
                }, 100);
            };
        },

        async checkLoginStatus() {
            try {
                const response = await fetch('/api/auth/check');
                const result = await response.json();
                
                if (result.isLoggedIn) {
                    if (this.elements.userConsole) this.elements.userConsole.classList.remove('hidden');
                    if (this.elements.loginPrompt) this.elements.loginPrompt.classList.add('hidden');
                    
                    console.log('用户已登录:', result.user);
                    
                    if (result.user && result.user.avatar) {
                        const avatarImg = this.elements.userConsole.querySelector('.user-avatar');
                        if (avatarImg) {
                            avatarImg.src = result.user.avatar;
                        }
                    }
                } else {
                    if (this.elements.userConsole) this.elements.userConsole.classList.add('hidden');
                    if (this.elements.loginPrompt) this.elements.loginPrompt.classList.remove('hidden');
                    
                    if (!window.location.href.includes('welcome')) {
                        setTimeout(() => {
                            window.location.href = 'welcome.jsp';
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error('检查登录状态失败:', error);
                if (this.elements.userConsole) this.elements.userConsole.classList.add('hidden');
                if (this.elements.loginPrompt) this.elements.loginPrompt.classList.remove('hidden');
            }
        },

        async logout() {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    window.location.href = result.redirect;
                } else {
                    alert('退出登录失败: ' + (result.message || '未知错误'));
                }
            } catch (error) {
                console.error('退出登录失败:', error);
                alert('退出登录失败，请重试');
            }
        }
    };

    // 初始化所有模块
    console.log('初始化Lmovie模块...');

    themeManagerModule.init();
    pageNavigationModule.init();
    dynamicContentModule.init();
    recentSliderModule.init();
    cardHoverModule.init();
    backToTopModule.init();
    footerAdditionalModule.init();

    if (typeof carouselData !== 'undefined') {
        carouselModule.init(carouselData);
    }

    movieModalModule.init(); 
    searchModule.init();
    authModule.init();

    console.log('所有模块初始化完成！');

    window.addEventListener('load', function() {
        if (pageNavigationModule.currentPage === 'movie' || 
            pageNavigationModule.currentPage === 'tvDrama' || 
            pageNavigationModule.currentPage === 'animat') {
            setTimeout(() => {
                dynamicContentModule.onPageChange(pageNavigationModule.currentPage);
            }, 500);
        }
    })
});