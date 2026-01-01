package com.phosicx.lmovie;

public class User {
    private int id;
    private String email;
    private String nickname;
    private String password_hash;
    private String avatar_url;

    public User() {};

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getNickname() {return nickname;}
    public void setNickname(String nickname) {this.nickname = nickname;}

    public String getPassword_hash() {return password_hash;}
    public void setPassword_hash(String password_hash) {this.password_hash = password_hash;}

    public String getAvatar_url() {return avatar_url;}
    public void setAvatar_url(String avatar_url) {this.avatar_url = avatar_url;}
}
