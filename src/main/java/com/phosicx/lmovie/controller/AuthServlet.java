package com.phosicx.lmovie.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import com.google.gson.Gson;
import com.phosicx.lmovie.util.PasswordUtil;
import com.phosicx.lmovie.model.User;
import com.phosicx.lmovie.dao.UserDAO;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(name = "AuthServlet", urlPatterns = "/api/auth/*")
public class AuthServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();

    // 邮箱验证正则
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO: 在这里添加GET请求处理逻辑

        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String pathInfo = request.getPathInfo();
        PrintWriter out = response.getWriter();
        Map<String, Object> result = new HashMap<>();

        if ("/check".equals(pathInfo)) {
            // 检查用户是否已登录
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("userId") != null) {
                try {
                    int userId = (int) session.getAttribute("userId");
                    User user = userDAO.getUserById(userId);

                    result.put("isLoggedIn", true);
                    result.put("user", user);
                } catch (SQLException e) {
                    e.printStackTrace();
                    result.put("isLoggedIn", false);
                    result.put("message", "数据库查询失败");
                }
            } else {
                result.put("isLoggedIn", false);
            }
        } else {
            result.put("success", false);
            result.put("message", "无效的请求路径");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }

        out.write(gson.toJson(result));
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String pathInfo = request.getPathInfo();
        PrintWriter out = response.getWriter();
        Map<String, Object> result = new HashMap<>();

        System.out.println("POST请求路径: " + pathInfo); // 添加日志

        try {
            if (pathInfo == null) {
                result.put("success", false);
                result.put("message", "请求路径为空");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.write(gson.toJson(result));
                return;
            }

            if ("/login".equals(pathInfo)) {
                handleLogin(request, response, out, result);
            } else if ("/register".equals(pathInfo)) {
                handleRegister(request, response, out, result);
            } else if ("/logout".equals(pathInfo)) {
                handleLogout(request, response, out, result);
            } else {
                result.put("success", false);
                result.put("message", "无效的请求路径: " + pathInfo);
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }

            out.write(gson.toJson(result));
            out.flush();

        } catch (SQLException e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "数据库错误: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write(gson.toJson(result));
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "服务器错误: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write(gson.toJson(result));
            out.flush();
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response,
                             PrintWriter out, Map<String, Object> result)
            throws SQLException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // 验证输入
        if (email == null || email.trim().isEmpty() ||
                password == null || password.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "邮箱和密码不能为空");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            result.put("success", false);
            result.put("message", "邮箱格式不正确");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 登录验证
        User user = userDAO.getUserByEmail(email);

        if (user != null && PasswordUtil.checkPassword(password, user.getPassword_hash())) {
            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userNickname", user.getNickname());

            session.setMaxInactiveInterval(30 * 60);

            User safeUser = new User();
            safeUser.setId(user.getId());
            safeUser.setEmail(user.getEmail());
            safeUser.setNickname(user.getNickname());
            safeUser.setAvatar_url(user.getAvatar_url());

            result.put("success", true);
            result.put("message", "登录成功");
            result.put("user", safeUser);
            result.put("redirect", "lmovie.html");
        } else {
            result.put("success", false);
            result.put("message", "邮箱或密码错误");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    private void handleRegister(HttpServletRequest request, HttpServletResponse response,
                                PrintWriter out, Map<String, Object> result)
            throws SQLException, IOException {


        String email = request.getParameter("email");
        String nickname = request.getParameter("nickname");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        // 验证输入
        if (email == null || email.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "邮箱不能为空");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (nickname == null || nickname.trim().isEmpty()) {
            // 如果没有提供昵称，使用邮箱前缀作为昵称
            nickname = email.split("@")[0];
        }

        if (password == null || password.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "密码不能为空");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            result.put("success", false);
            result.put("message", "邮箱格式不正确");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (confirmPassword != null && !password.equals(confirmPassword)) {
            result.put("success", false);
            result.put("message", "两次输入的密码不一致");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (password.length() < 6) {
            result.put("success", false);
            result.put("message", "密码长度至少6位");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 检查邮箱是否已存在
        if (userDAO.isEmailExists(email)) {
            result.put("success", false);
            result.put("message", "该邮箱已被注册");
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            return;
        }

        // 创建用户
        User user = new User();
        user.setEmail(email);
        user.setNickname(nickname);

        String hashedPassword = PasswordUtil.hashPassword(password);
        user.setPassword_hash(hashedPassword);

        boolean success = userDAO.registerUser(user);

        if (success) {
            result.put("success", true);
            result.put("message", "注册成功，请登录");
            result.put("redirect", "welcome.jsp");
        } else {
            result.put("success", false);
            result.put("message", "注册失败");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void handleLogout(HttpServletRequest request, HttpServletResponse response,
                              PrintWriter out, Map<String, Object> result) {

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        result.put("success", true);
        result.put("message", "退出登录成功");
        result.put("redirect", "welcome.jsp");
    }
}