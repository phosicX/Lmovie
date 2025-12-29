package com.phosicx.lmovie;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MovieDAO {

    // 获取所有电影
    public List<Movie> getAllMovies(int start, int limit) throws SQLException {
        List<Movie> movies = new ArrayList<>();
        String sql = "SELECT * FROM movies WHERE is_active = TRUE AND type = 'movie' ORDER BY id LIMIT ?, ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, start);
            pstmt.setInt(2, limit);

            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                movies.add(resultSetToMovie(rs));
            }
        }
        return movies;
    }

    // 获取电视剧
    public List<Movie> getTvDramas(int start, int limit) throws SQLException {
        List<Movie> dramas = new ArrayList<>();
        String sql = "SELECT * FROM movies WHERE is_active = TRUE AND type = 'tv_drama' ORDER BY id LIMIT ?, ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, start);
            pstmt.setInt(2, limit);

            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                dramas.add(resultSetToMovie(rs));
            }
        }
        return dramas;
    }

    // 获取动漫
    public List<Movie> getAnimat(int start, int limit) throws SQLException {
        List<Movie> animats = new ArrayList<>();
        String sql = "SELECT * FROM movies WHERE is_active = TRUE AND type = 'anime' ORDER BY id LIMIT ?, ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, start);
            pstmt.setInt(2, limit);

            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                animats.add(resultSetToMovie(rs));
            }
        }
        return animats;
    }

    // 根据ID获取影视详情
    public Movie getMovieById(String id) throws SQLException {
        String sql = "SELECT * FROM movies WHERE id = ? AND is_active = TRUE";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return resultSetToMovie(rs);
            }
        }
        return null;
    }

    // 搜索影视
    public List<Movie> searchMovies(String keyword, int limit) throws SQLException {
        List<Movie> results = new ArrayList<>();
        String sql = "SELECT * FROM movies WHERE is_active = TRUE AND " +
                "(title_zh LIKE ? OR title_intl LIKE ?) " +
                "ORDER BY id LIMIT ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, "%" + keyword + "%");
            pstmt.setString(2, "%" + keyword + "%");
            pstmt.setInt(3, limit);

            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                results.add(resultSetToMovie(rs));
            }
        }
        return results;
    }

    // 获取总数
    public int getTotalCount(String type) throws SQLException {
        String sql = "SELECT COUNT(*) FROM movies WHERE is_active = TRUE AND type = ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, type);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }

    // ResultSet 转 Movie 对象
    private Movie resultSetToMovie(ResultSet rs) throws SQLException {
        Movie movie = new Movie();
        movie.setId(rs.getString("id"));
        movie.setTitleZh(rs.getString("title_zh"));
        movie.setTitleIntl(rs.getString("title_intl"));
        movie.setYear(rs.getInt("year"));
        movie.setPosterUrl(rs.getString("poster_url"));
        movie.setDirector(rs.getString("director"));
        movie.setWriters(rs.getString("writers"));
        movie.setActors(rs.getString("actors"));
        movie.setGenres(rs.getString("genres"));
        movie.setCountry(rs.getString("country"));
        movie.setLanguage(rs.getString("language"));
        movie.setReleaseDate(rs.getString("release_date"));
        movie.setDuration(rs.getString("duration"));
        movie.setDoubanScore(rs.getString("douban_score"));
        movie.setDoubanUrl(rs.getString("douban_url"));
        movie.setImdbScore(rs.getString("imdb_score"));
        movie.setImdbUrl(rs.getString("imdb_url"));
        movie.setIntro(rs.getString("intro"));
        movie.setType(rs.getString("type"));
        movie.setIsActive(rs.getBoolean("is_active"));

        return movie;
    }
}
