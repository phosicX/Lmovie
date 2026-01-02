package com.phosicx.lmovie.model;

import java.io.Serializable;

public class Movie implements Serializable {
    private String id;
    private String titleZh;
    private String titleIntl;
    private Integer year;
    private String posterUrl;
    private String director;
    private String writers;
    private String actors;
    private String genres;
    private String country;
    private String language;
    private String releaseDate;
    private String duration;
    private String doubanScore;
    private String doubanUrl;
    private String imdbScore;
    private String imdbUrl;
    private String intro;
    private String type;
    private boolean isActive;

    public Movie() {}

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getTitleZh() {return titleZh;}
    public void setTitleZh(String titleZh) {this.titleZh = titleZh;}

    public String getTitleIntl() {return titleIntl;}
    public void setTitleIntl(String titleIntl) {this.titleIntl = titleIntl;}

    public Integer getYear() {return year;}
    public void setYear(Integer year) {this.year = year;}

    public String getPosterUrl() {return posterUrl;}
    public void setPosterUrl(String posterUrl) {this.posterUrl = posterUrl;}

    public String getDirector() {return director;}
    public void setDirector(String director) {this.director = director;}

    public String getWriters() {return writers;}
    public void setWriters(String writers) {this.writers = writers;}

    public String getActors() {return actors;}
    public void setActors(String actors) {this.actors = actors;}

    public String getGenres() {return genres;}
    public void setGenres(String genres) {this.genres = genres;}

    public String getCountry() {return country;}
    public void setCountry(String country) {this.country = country;}

    public String getLanguage() {return language;}
    public void setLanguage(String language) {this.language = language;}

    public String getReleaseDate() {return releaseDate;}
    public void setReleaseDate(String releaseDate) {this.releaseDate = releaseDate;}

    public String getDuration() {return duration;}
    public void setDuration(String duration) {this.duration = duration;}

    public String getDoubanScore() {return doubanScore;}
    public void setDoubanScore(String doubanScore) {this.doubanScore = doubanScore;}

    public String getDoubanUrl() {return doubanUrl;}
    public void setDoubanUrl(String doubanUrl) {this.doubanUrl = doubanUrl;}

    public String getImdbScore() {return imdbScore;}
    public void setImdbScore(String imdbScore) {this.imdbScore = imdbScore;}

    public String getImdbUrl() {return imdbUrl;}
    public void setImdbUrl(String imdbUrl) {this.imdbUrl = imdbUrl;}

    public String getIntro() {return intro;}
    public void setIntro(String intro) {this.intro = intro;}

    public String getType() {return type;}
    public void setType(String type) {this.type = type;}

    public boolean isActive() {return isActive;}
    public void setIsActive(boolean active) {isActive = active;}
}
