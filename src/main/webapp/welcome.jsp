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
    <title>Welcome</title>
    <style></style>

    <link rel="stylesheet" href="CSS/globalVar.css">
    <link rel="stylesheet" href="CSS/welcome.css">
    
    <script src="JS/Welcome.js"></script>
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
                <div class="user-info hidden" id="userInfo">
                    <img src="Image/welcome/default-user.svg" alt="" class="user-avatar" id="userAvatar">
                    <span class="username" id="username">unKnown</span>
                </div>
            </div>
            <form action="" class="login-form" id="loginForm">
                <h2>登录您的账户</h2>
                <strong class="login-prompt" id="loginPrompt">请输入邮箱和密码</strong>
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
                <h2>创建您的账户</h2>
                <strong class="register-prompt" id="registerPrompt">请输入邮箱、昵称和密码</strong>
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
</body>
</html>
