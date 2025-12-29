
const carouselData = [
    {
        image: 'Image/carousel/The Wandering Earth Ⅲ.webp',
        title: '流浪地球3',
        description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。'
    },
    {
        image: 'Image/carousel/Zootopia 2.webp',
        title: '疯狂动物城2',
        description: '一个神秘爬行动物的到来，把温馨的动物城搅动得天翻地覆。'
    },
    {
        image: 'Image/carousel/Now You See Me Now You Dont.webp',
        title: '惊天魔盗团3',
        description: '因神秘塔罗牌的指引，那群用魔术“替天行盗”的骑士们杀回来了！'
    },
 
    // {
    //     image: '',
    //     title: '',
    //     description: ''
    // },
]

// 影视数据管理器
const mediaDataManager = {    
    pageConfig: {
        initial: 12,    // 初始加载数量
        more: 8         // 每次加载更多数量
    },
    
    currentState: {
        movie: {
            loadedItems: 0,
            allItems: 0,
            lastItemId: null
        },
        tv_drama: {
            loadedItems: 0,
            allItems: 0,
            lastItemId: null
        },
        anime: {
            loadedItems: 0,
            allItems: 0,
            lastItemId: null
        }
    },
    
    async initPage(pageType) {
        const state = this.currentState[pageType];
        state.loadedItems = 0;
        state.allItems = 0;
        state.lastItemId = null;
        
        return await this.loadMoreItems(pageType, 'initial');
    },

    async loadMoreItems(pageType, loadType = 'more') {
        const state = this.currentState[pageType];
        const loadCount = loadType === 'initial' 
            ? this.pageConfig.initial 
            : this.pageConfig.more;
        
        if (state.loadedItems >= state.allItems && state.allItems > 0) {
            return [];
        }
        
        const start = state.loadedItems;
        
        try {
            const response = await fetch(`/api/movies?type=${pageType}&start=${start}&limit=${loadCount}`);
            const result = await response.json();
            
            if (result.data && result.data.length > 0) {
                // 转换为前端需要的格式
                const formattedData = result.data.map(movie => ({
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
                }));
                
                state.loadedItems += formattedData.length;
                state.allItems = result.total || 0;
                state.lastItemId = formattedData[formattedData.length - 1]?.id || null;
                
                return formattedData;
            }
        } catch (error) {
            console.error('加载数据失败:', error);
        }
        
        return [];
    },
    
    hasMoreItems(pageType) {
        const state = this.currentState[pageType];
        return state.loadedItems < state.allItems;
    },

    resetPage(pageType) {
        this.currentState[pageType].loadedItems = 0;
        this.currentState[pageType].lastItemId = null;
        this.currentState[pageType].allItems = 0;
    },
    
    getLoadingStatus(pageType) {
        const state = this.currentState[pageType];
        return {
            loaded: state.loadedItems,
            total: state.allItems,
            hasMore: this.hasMoreItems(pageType)
        };
    }
};