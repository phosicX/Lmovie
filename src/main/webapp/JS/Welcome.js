document.addEventListener("DOMContentLoaded", function() {
    // 缓存 DOM 元素
    const DOM = {
        loginPage: document.getElementById('loginPage'),
        registerPage: document.getElementById('registerPage'),
        toLoginPageBtn: document.getElementById('toLoginPage'),
        toRegisterPageBtn: document.getElementById('toRegisterPage'),
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        loginWelcome: document.querySelector('.login-welcome'),
        registerWelcome: document.querySelector('.register-welcome'),
        loginSubmitBtn: document.getElementById('loginSubmitBtn'),
        registerSubmitBtn: document.getElementById('registerSubmitBtn'),
        loginPrompt: document.getElementById('loginPrompt'),
        registerPrompt: document.getElementById('registerPrompt'),
        emailLogin: document.getElementById('email-login'),
        pwdLogin: document.getElementById('pwd-login'),
        emailRegister: document.getElementById('email-register'),
        nickname: document.getElementById('nickname'),
        pwdRegister: document.getElementById('pwd-register'),
        pwdRegisterConfirm: document.getElementById('pwd-register-confirm')
    };

    // API 路径常量
    const API = {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register'
    };

    // 主题管理
    const themeManager = {
        init() {
            this.initTheme();
            this.watchSystemTheme();
        },

        updateThemeState(isDark) {
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            console.log(`切换到${isDark ? '深色' : '浅色'}模式'`);
        },

        initTheme() {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.updateThemeState(systemPrefersDark);
        },

        watchSystemTheme() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                this.updateThemeState(e.matches);
                console.log(`系统主题已切换为${e.matches ? '深色' : '浅色'}模式，已跟随系统变化`);
            });
        }
    };

    // 初始化浮动标签效果
    function initFloatingLabels() {
        const inputs = document.querySelectorAll('.form-input');

        inputs.forEach(input => {
            // 初始状态
            if (input.value.trim()) {
                input.classList.add('filled');
            }

            // 输入事件
            input.addEventListener('input', function() {
                this.classList.toggle('filled', !!this.value.trim());
            });

            // 焦点事件
            input.addEventListener('focus', function() {
                this.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.classList.remove('focused');
                if (!this.value.trim()) {
                    this.classList.remove('filled');
                }
            });
        });
    }

    // 页面切换功能
    function switchPage(toLogin = true) {
        if (toLogin) {
            DOM.loginWelcome.classList.add('selected');
            DOM.loginForm.classList.add('selected');
            DOM.registerWelcome.classList.remove('selected');
            DOM.registerForm.classList.remove('selected');

            DOM.loginPage.style.opacity = '1';
            DOM.loginPage.style.visibility = 'visible';
            DOM.registerPage.style.opacity = '0';
            DOM.registerPage.style.visibility = 'hidden';
        } else {
            DOM.registerWelcome.classList.add('selected');
            DOM.registerForm.classList.add('selected');
            DOM.loginWelcome.classList.remove('selected');
            DOM.loginForm.classList.remove('selected');

            DOM.registerPage.style.opacity = '1';
            DOM.registerPage.style.visibility = 'visible';
            DOM.loginPage.style.opacity = '0';
            DOM.loginPage.style.visibility = 'hidden';
        }
    }

    // 显示提示信息
    function showPrompt(element, message, type = 'error') {
        element.textContent = message || '';
        element.style.color = type === 'success'
            ? 'var(--success-color)'
            : 'var(--error-color)';
    }

    // 设置加载状态
    function setLoading(button, isLoading, defaultText) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.textContent = '处理中...';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.textContent = defaultText;
        }
    }

    // 验证邮箱格式
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 登录处理
    async function handleLogin(e) {
        e.preventDefault();

        const email = DOM.emailLogin.value.trim();
        const password = DOM.pwdLogin.value.trim();

        // 基础验证
        if (!email || !password) {
            showPrompt(DOM.loginPrompt, '邮箱和密码不能为空!');
            return;
        }

        if (!validateEmail(email)) {
            showPrompt(DOM.loginPrompt, '请输入有效的邮箱地址!');
            return;
        }

        setLoading(DOM.loginSubmitBtn, true, '登录');

        try {
            const response = await fetch(API.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email: email,
                    password: password
                })
            });

            const result = await response.json();

            if (result.success) {
                showPrompt(DOM.loginPrompt, '登录成功!', 'success');
                setTimeout(() => {
                    window.location.href = result.redirect || '/';
                }, 500);
            } else {
                showPrompt(DOM.loginPrompt, result.message || '登录失败，请检查邮箱和密码');
            }
        } catch (error) {
            console.error('登录错误:', error);
            showPrompt(DOM.loginPrompt, '网络错误，请稍后重试');
        } finally {
            setLoading(DOM.loginSubmitBtn, false, '登录');
        }
    }

    // 注册处理
    async function handleRegister(e) {
        e.preventDefault();

        const email = DOM.emailRegister.value.trim();
        const nickname = DOM.nickname.value.trim();
        const password = DOM.pwdRegister.value.trim();
        const confirmPassword = DOM.pwdRegisterConfirm.value.trim();

        // 基础验证
        if (!email || !password || !confirmPassword) {
            showPrompt(DOM.registerPrompt, '邮箱和密码不能为空!');
            return;
        }

        if (!validateEmail(email)) {
            showPrompt(DOM.registerPrompt, '请输入有效的邮箱地址!');
            return;
        }

        if (password !== confirmPassword) {
            showPrompt(DOM.registerPrompt, '两次输入的密码不一致!');
            return;
        }

        if (password.length < 6) {
            showPrompt(DOM.registerPrompt, '密码长度至少6位!');
            return;
        }

        setLoading(DOM.registerSubmitBtn, true, '注册');

        try {
            const response = await fetch(API.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email: email,
                    nickname: nickname,
                    password: password,
                    confirmPassword: confirmPassword
                })
            });

            const result = await response.json();

            if (result.success) {
                showPrompt(DOM.registerPrompt, '注册成功! 即将跳转到登录页面...', 'success');

                // 保存邮箱到登录表单
                DOM.emailLogin.value = email;

                // 清空注册表单
                DOM.registerForm.reset();

                // 切换回登录页面
                setTimeout(() => {
                    switchPage(true);
                    showPrompt(DOM.registerPrompt, '');
                }, 1500);
            } else {
                showPrompt(DOM.registerPrompt, result.message || '注册失败，请稍后重试');
            }
        } catch (error) {
            console.error('注册错误:', error);
            showPrompt(DOM.registerPrompt, '网络错误，请稍后重试');
        } finally {
            setLoading(DOM.registerSubmitBtn, false, '注册');
        }
    }

    // 事件监听器绑定
    function bindEvents() {
        // 页面切换按钮
        DOM.toLoginPageBtn.addEventListener('click', () => switchPage(true));
        DOM.toRegisterPageBtn.addEventListener('click', () => switchPage(false));

        // 表单提交
        DOM.loginForm.addEventListener('submit', handleLogin);
        DOM.registerForm.addEventListener('submit', handleRegister);

        // 输入框回车键提交
        [DOM.emailLogin, DOM.pwdLogin].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    DOM.loginForm.dispatchEvent(new Event('submit'));
                }
            });
        });

        [DOM.emailRegister, DOM.nickname, DOM.pwdRegister, DOM.pwdRegisterConfirm].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    DOM.registerForm.dispatchEvent(new Event('submit'));
                }
            });
        });
    }

    // 初始化
    function init() {
        themeManager.init();
        initFloatingLabels();
        bindEvents();
        switchPage(true); // 默认显示登录页面

        // 检查是否有记住的邮箱
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            DOM.emailLogin.value = rememberedEmail;
            document.querySelector('.form-input.filled')?.classList.add('filled');
        }
    }

    init();
});