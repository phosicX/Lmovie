package com.phosicx.lmovie.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebFilter(filterName = "AuthFilter", urlPatterns = {"/lmovie.html", "/api/movies"})
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String requestURI = httpRequest.getRequestURI();

        // 排除登录相关的请求
        if (requestURI.contains("/api/auth/") ||
                requestURI.contains("welcome.jsp") ||
                requestURI.contains(".css") ||
                requestURI.contains(".js") ||
                requestURI.contains(".jpg") ||
                requestURI.contains(".png") ||
                requestURI.contains(".webp") ||
                requestURI.contains(".svg")) {
            chain.doFilter(request, response);
            return;
        }

        HttpSession session = httpRequest.getSession(false);
        boolean isLoggedIn = (session != null && session.getAttribute("userId") != null);

        if (!isLoggedIn && requestURI.endsWith("lmovie.html")) {
            // 未登录且访问主页面，重定向到登录页面
            httpResponse.sendRedirect(httpRequest.getContextPath() + "/welcome.jsp");
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // 清理
    }
}