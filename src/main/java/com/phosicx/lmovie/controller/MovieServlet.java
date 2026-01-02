package com.phosicx.lmovie.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.phosicx.lmovie.model.Movie;
import com.phosicx.lmovie.dao.MovieDAO;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(name = "MovieServlet", urlPatterns = "/api/movies")
public class MovieServlet extends HttpServlet {
    private MovieDAO movieDAO = new MovieDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO: 在这里添加GET请求处理逻辑
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String action = request.getParameter("action");
        String type = request.getParameter("type");
        String id = request.getParameter("id");
        String keyword = request.getParameter("keyword");
        String startStr = request.getParameter("start");
        String limitStr = request.getParameter("limit");

        System.out.println("收到请求 - action: " + action + ", type: " + type + ", id: " + id + ", keyword: " + keyword);

        try {
            if ("detail".equals(action) && id != null) {
                // 获取单个影视详情
                Movie movie = movieDAO.getMovieById(id);
                if (movie != null) {
                    response.getWriter().write(gson.toJson(movie));
                } else {
                    response.getWriter().write("{\"error\":\"Movie not found\"}");
                }

            } else if ("search".equals(action) && keyword != null) {
                // 搜索影视
                int limit = getIntParam(limitStr, 10);
                List<Movie> results = movieDAO.searchMovies(keyword, limit);
                response.getWriter().write(gson.toJson(results));

            } else if (type != null) {
                // 按类型获取列表（支持分页）
                int start = getIntParam(startStr, 0);
                int limit = getIntParam(limitStr, 12);

                List<Movie> movies;
                switch (type.toLowerCase()) {
                    case "movie":
                        movies = movieDAO.getAllMovies(start, limit);
                        break;
                    case "tv_drama":
                        movies = movieDAO.getTvDramas(start, limit);
                        break;
                    case "anime":
                        movies = movieDAO.getAnimat(start, limit);
                        break;
                    default:
                        movies = new ArrayList<>();
                }

                // 构建响应，包含总数信息
                Map<String, Object> result = new HashMap<>();
                result.put("data", movies);
                result.put("total", movieDAO.getTotalCount(type));
                result.put("hasMore", movies.size() == limit);

                response.getWriter().write(gson.toJson(result));

            } else {
                response.getWriter().write("{\"error\":\"Invalid request\"}");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("数据库错误: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Database error: " + e.getMessage() + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("服务器错误: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Server error: " + e.getMessage() + "\"}");
        }
    }

    private int getIntParam(String param, int defaultValue) {
        if (param != null && !param.trim().isEmpty()) {
            try {
                return Integer.parseInt(param);
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }
}