package org.englishapp.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ReviewFlashcardRequest {
    public enum Rating { AGAIN, GOOD, EASY }

    @NotNull
    private Rating rating;

    public Rating getRating() { return rating; }
    public void setRating(Rating rating) { this.rating = rating; }
}
