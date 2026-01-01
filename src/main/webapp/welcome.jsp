<%--
  Created by IntelliJ IDEA.
  User: 31814
  Date: 2025/12/31
  Time: 14:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <style>
        body {
            display: grid;
            place-items: center;
            min-height: 100vh;
        }

        .container {
            position: relative;
            width: 750px;
            height: 450px;
            overflow: hidden;
            box-shadow: var(--shadow-lg) var(--shadow-color);
        }

        .login-page, .register-page {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            text-align: center;
            backdrop-filter: blur(5px);
            background: rgba(0, 0, 0, 0.05);
            transition: var(--transition);
        }

        .login-welcome, .register-welcome {
            width: 250px;
            box-shadow: var(--shadow-sm) var(--shadow-color);
            padding: 40px 0;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            background: var(--bg-color);
            z-index: 1;
        }

        .register-welcome { transform: translateX(0);}
        .login-welcome { transform: translateX(500px);}

        .register-welcome.selected {
            transition: var(--transition);
            transform: translateX(500px);
        }

        .login-welcome.selected {
            transition: var(--transition);
            transform: translateX(0);
        }

        .user-info {
            position: absolute;
            top: 40%;
            transform: translateY(-40%);
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: center;
            align-items: center;
        }

        .user-avatar {
            width: 128px;
            height: 128px;
            border-radius: 50%;
        }

        .username {
            display: block;
            font-weight: bold;
            font-size: 24px;
        }

        .no-account, .has-account { margin-bottom: 20px;}

        .no-account strong, .has-account strong { font-size: 16px;}

        .login-form, .register-form {
            padding: 40px 0;
            width: 500px;
            transition: var(--transition-slow);
        }

        .login-form { transform: translateX(-250px);}
        .register-form { transform: translateX(0);}

        .login-form.selected { transform: translateX(0);}
        .register-form.selected { transform: translateX(-250px);}

        .login-prompt, .register-prompt {
            display: block;
            margin: 30px 0 70px;
        }

        .register-prompt { margin: 30px 0 40px;}

        .form-group {
            width: 300px;
            position: relative;
            margin: 15px auto;
        }

        .form-group label {
            position: absolute;
            top: 50%;
            left: 10px;
            font-size: 14px;
            transform: translateY(-50%);
            transition: var(--transition);
        }

        .form-group label::after {
            content: '';
            position: absolute;
            top: 50%;
            bottom: 35%;
            left: -10%;
            right: -10%;
            background: var(--bg-color);
            z-index: -1;
        }

        .form-input {
            width: 100%;
            padding: 6px 10px;
            border: 2px solid var(--border-color);
            background: var(--bg-color);
            color: var(--text-color);
            font-size: 16px;
            transition: var(--transition);
            outline: none;
        }

        .form-input:focus + .input-label,
        .form-input.filled + .input-label {
            transform: translateY(-150%);
            font-size: 13px;
        }

        .option-group {
            width: 300px;
            margin: 20px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
        }

        .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        .remember-me input { cursor: pointer;}

        .login-btn, .register-btn {
            margin-top: 10px;
            font-size: 16px;
            padding: 5px 0;
            width: 240px;
            border: 2px solid var(--btn-border);
            background: var(--btn-color);
        }

        .poster-exhibit {
            position: absolute;
            top: -25%;
            left: -20%;
            right: -20%;
            bottom: -20%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
            padding: 10px;
            transform: rotateZ(-20deg);
            z-index: -1;
            animation: rollingPoster 60s linear infinite;
            opacity: 0.25;
        }

        .poster {
            width: 100px;
            height: 150px;
        }

        .poster img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .loading {
            opacity: 0.7;
            pointer-events: none;
        }

        .loading::after {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 10px;
        }

        @keyframes rollingPoster {
            0%, 100% { transform: translateX(0px) rotateZ(-20deg);}
            25% { transform: translateX(-50px) rotateZ(-20deg);}
            75% { transform: translateX(50px) rotateZ(-20deg);}
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

    </style>

    <link rel="stylesheet" href="CSS/globalVar.css">
    <script src="JS/Main.js"></script>
</head>
<body>
    <main class="container">
        <!-- 登录 -->
        <section class="login-page" id="loginPage">
            <div class="login-welcome">
                <h2>欢迎回来!</h2>
                <span class="no-account">还没有账户？
                        <button id="toRegisterPage" type="button"><strong>立即注册</strong></button>
                    </span>
                <!-- <div class="user-info">
                    <img src="Image/welcome/default-user.svg" alt="" class="user-avatar">
                    <span class="username">phosicX</span>
                </div> -->
            </div>
            <form action="" class="login-form" id="loginForm">
                <h2>登录您的账户</h2>
                <span class="login-prompt" id="loginPrompt">请输入邮箱和密码</span>
                <div class="form-group">
                    <input type="email" id="email-login" class="form-input" required>
                    <label for="email-login" class="input-label">邮箱</label>
                </div>
                <div class="form-group">
                    <input type="password" id="pwd-login" class="form-input" required>
                    <label for="pwd-login" class="input-label">密码</label>
                </div>
                <div class="option-group">
                    <label class="remember-me">
                        <input type="checkbox" class="checkbox" id="rememberMe">
                        <span>记住我</span>
                    </label>
                    <a href="" class="forgot-pwd">忘记密码？</a>
                </div>
                <button class="login-btn" type="submit" id="loginSubmitBtn">登录</button>
            </form>
        </section>
        <!-- 注册 -->
        <section class="register-page" id="registerPage">
            <div class="register-welcome">
                <h2>欢迎加入!</h2>
                <span class="has-account">已有账户？
                        <button id="toLoginPage"><strong>立即登录</strong></button>
                    </span>
            </div>
            <form action="" class="register-form" id="registerForm">
                <h2>请创建您的账户</h2>
                <span class="register-prompt" id="registerPrompt">请输入邮箱、昵称和密码</span>
                <div class="form-group">
                    <input type="email" id="email-register" class="form-input" required>
                    <label for="email-register" class="input-label">邮箱: </label>
                </div>
                <div class="form-group">
                    <input type="text" id="nickname" class="form-input">
                    <label for="nickname" class="input-label">昵称: </label>
                </div>
                <div class="form-group">
                    <input type="password" id="pwd-register" class="form-input" required>
                    <label for="pwd-register" class="input-label">密码: </label>
                </div>
                <div class="form-group">
                    <input type="password" id="pwd-register-confirm" class="form-input" required>
                    <label for="pwd-register-confirm" class="input-label">确认密码: </label>
                </div>
                <button class="register-btn" type="submit" id="registerSubmitBtn">注册</button>
            </form>
        </section>
        <div class="poster-exhibit">
            <div class="poster"> <img src="Image/poster/movie/Bugonia.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Dead To Rights.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Diamanti.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Farewell My Concubine.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Flipped.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Forrest Gump.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Gezhi Town.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Inception.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Interstellar.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/La leggenda del pianista sulloceano.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/La misteriosa mirada del flamenco.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Leon.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Life Is Beautifu.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Ne Zha 2.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/No Other Choice.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Now You See Me Now You Dont.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Seediq Bale The Rainbow Warriors.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Sirat.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Spirited Away.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/The Lost Daughter.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/The Pursuit of Happyness.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/The Shadows Edge.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/The Shawshank Redemption.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/The Sun Rises on Us All.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/The Truman Show.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Thirteen Lives.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Titanic.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Wake Up Dead Man.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/WALLE.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Witness for the Prosecution.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Zootopia 2.webp" alt=""></div>
            <div class="poster"> <img src="Image/poster/movie/Thumbs.db" alt=""></div>
        </div>
    </main>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const floatingInputs = document.querySelectorAll('.form-input');

            floatingInputs.forEach(input => {
                if (input.value) {
                    input.classList.add('filled');
                }

                input.addEventListener('input', function() {
                    if (this.value) {
                        this.classList.add('filled');
                    } else {
                        this.classList.remove('filled');
                    }
                });

                input.addEventListener('focus', function() {
                    this.classList.add('focused');
                });

                input.addEventListener('blur', function() {
                    this.classList.remove('focused');
                    if (!this.value) {
                        this.classList.remove('filled');
                    }
                });
            });

            const loginPage = document.getElementById('loginPage');
            const registerPage = document.getElementById('registerPage')
            const loginPageBtn = document.getElementById('toLoginPage');
            const registerPageBtn = document.getElementById('toRegisterPage');
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm')

            const loginWelcome = document.querySelector('.login-welcome');
            const registerWelcome = document.querySelector('.register-welcome');

            loginPageBtn.addEventListener('click', function() {
                loginWelcome.classList.add('selected');
                loginForm.classList.add('selected');
                registerWelcome.classList.remove('selected');
                registerForm.classList.remove('selected');

                loginPage.style.opacity = '1';
                loginPage.style.visibility = 'visible';
                registerPage.style.opacity = '0';
                registerPage.style.visibility = 'hidden';
            })

            registerPageBtn.addEventListener('click', function() {
                registerWelcome.classList.add('selected');
                registerForm.classList.add('selected');
                loginWelcome.classList.remove('selected');
                loginForm.classList.remove('selected');

                registerPage.style.opacity = '1';
                registerPage.style.visibility = 'visible';
                loginPage.style.opacity = '0';
                loginPage.style.visibility = 'hidden';
            })

            function initWelcomePage() {
                loginWelcome.classList.add('selected');
                loginForm.classList.add('selected');
                registerWelcome.classList.remove('selected');
                registerForm.classList.remove('selected');

                loginPage.style.opacity = '1';
                loginPage.style.visibility = 'visible';
                registerPage.style.opacity = '0';
                registerPage.style.visibility = 'hidden';
            }

            initWelcomePage();

            const loginSubmitBtn = document.getElementById('loginSubmitBtn');
            const loginPrompt = document.getElementById('loginPrompt');

            loginForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const email = document.getElementById('email-login').value.trim();
                const password = document.getElementById('pwd-login').value.trim();

                if (!email || !password) {
                    showLoginError('邮箱和密码不能为空!');
                    return;
                }

                setLoading(loginSubmitBtn, true);

                try {
                    const response = await fetch('/api/auth/login', {
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
                        showLoginError('', true);
                        window.location.href = result.redirect;
                    } else {
                        showLoginError(result.message || '登录失败!');
                    }
                } catch (error) {
                    console.error('登录错误:', error);
                    showLoginError('网络错误，请稍后重试');
                } finally {
                    setLoading(loginSubmitBtn, false);
                }
            })

            const registerSubmitBtn = document.getElementById('registerSubmitBtn');
            const registerPrompt = document.getElementById('registerPrompt');

            registerForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const email = document.getElementById('email-register').value.trim();
                const nickname = document.getElementById('nickname').value.trim();
                const password = document.getElementById('pwd-register').value.trim();
                const confirmPassword = document.getElementById('pwd-register-confirm').value.trim();

                if (!email || !password || !confirmPassword) {
                    showRegisterError('邮箱和密码不能为空!');
                    return;
                }

                if (password !== confirmPassword) {
                    showRegisterError('两次输入的密码不一致!');
                    return;
                }

                if (password.length < 6) {
                    showRegisterError('密码长度至少6位!');
                    return;
                }

                setLoading(registerSubmitBtn, true);

                try {
                    const response = await fetch('/api/auth/register', {
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
                        showRegisterError('');
                        showRegisterSuccess('注册成功!');

                        // 注册成功后自动切换到登录页面
                        setTimeout(() => {
                            document.getElementById('toLoginPage').click();
                            document.getElementById('email-login').value = email;
                            registerForm.reset();
                            showRegisterSuccess('');
                        }, 1500);
                    } else {
                        showRegisterError(result.message || '注册失败!');
                    }
                } catch (error) {
                    console.error('注册错误:', error);
                    showRegisterError('网络错误，请稍后重试');
                } finally {
                    setLoading(registerSubmitBtn, false);
                }
            })

            function showLoginError(message, isSuccess = false) {
                if (isSuccess) {
                    loginPrompt.textContent = '';
                    loginPrompt.style.color = 'var(--success-color)';
                } else {
                    loginPrompt.textContent = message || '';
                    loginPrompt.style.color = 'var(--error-color)';
                }
            }

            function showRegisterError(message) {
                registerPrompt.textContent = message || '';
                registerPrompt.style.color = 'var(--error-color)';
            }

            function showRegisterSuccess(message) {
                registerPrompt.textContent = message || '';
                registerPrompt.style.color = 'var(--success-color)';
            }

            function setLoading(button, isLoading) {
                if (isLoading) {
                    button.classList.add('loading');
                    button.disabled = true;
                    button.textContent = '处理中...';
                } else {
                    button.classList.remove('loading');
                    button.disabled = false;
                    button.textContent = button.id === 'loginSubmitBtn' ? '登录' : '注册';
                }
            }
        })
    </script>
</body>
</html>
