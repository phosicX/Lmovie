package com.phosicx.lmovie.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class DbUtil {
    private static HikariDataSource dataSource;

    static {
        try {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                System.out.println("MySQL驱动加载成功");
            } catch (ClassNotFoundException e) {
                System.err.println("MySQL驱动加载失败: " + e.getMessage());
                e.printStackTrace();
            }

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl("jdbc:mysql://localhost:3306/lmovie_db?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC&useSSL=false");
            config.setUsername("root");
            config.setPassword("");
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);

            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

            dataSource = new HikariDataSource(config);
            System.out.println("数据库连接池初始化成功！");
        } catch (Exception e) {
            System.err.println("数据库连接池初始化失败: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("数据库连接池初始化失败", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        try {
            return dataSource.getConnection();
        } catch (SQLException e) {
            System.err.println("获取数据库连接失败: " + e.getMessage());
            throw e;
        }
    }
}