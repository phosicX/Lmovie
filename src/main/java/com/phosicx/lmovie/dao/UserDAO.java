package com.phosicx.lmovie.dao;

import com.phosicx.lmovie.util.DbUtil;
import com.phosicx.lmovie.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDAO {

    public boolean registerUser(User user) throws SQLException {
        String sql = "INSERT INTO user (email, nickname, password_hash) VALUES (?, ?, ?)";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getEmail());
            pstmt.setString(2, user.getNickname());
            pstmt.setString(3, user.getPassword_hash());

            int rowsAffected = pstmt.executeUpdate();
            System.out.println("插入用户成功，影响行数: " + rowsAffected);
            System.out.println("用户邮箱: " + user.getEmail());
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("插入用户失败: " + e.getMessage());
            System.err.println("SQL状态: " + e.getSQLState());
            System.err.println("错误码: " + e.getErrorCode());
            throw e;
        }
    }

    public boolean isEmailExists(String email) throws SQLException {
        String sql = "SELECT COUNT(*) FROM user WHERE email = ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    public User getUserById(int id) throws SQLException {
        String sql = "SELECT * FROM user WHERE id = ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return resultSetToUser(rs);
            }
        }
        return null;
    }

    public User getUserByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM user WHERE email = ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return resultSetToUser(rs);
            }
        }
        return null;
    }

    public boolean updateUser(User user) throws SQLException {
        String sql = "UPDATE user SET nickname = ?, avatar_url = ? WHERE id = ?";

        try (Connection conn = DbUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getNickname());
            pstmt.setString(2, user.getAvatar_url());
            pstmt.setInt(3, user.getId());

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    // ResultSet转User对象
    private User resultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setEmail(rs.getString("email"));
        user.setNickname(rs.getString("nickname"));
        user.setPassword_hash(rs.getString("password_hash"));
        user.setAvatar_url(rs.getString("avatar_url"));
        return user;
    }
}