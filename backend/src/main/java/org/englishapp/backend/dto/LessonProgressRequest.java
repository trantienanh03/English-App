package org.englishapp.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class LessonProgressRequest {
    @Min(0) @Max(100)
    private int score;
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
