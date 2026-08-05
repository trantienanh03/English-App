package org.englishapp.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class SyncRequest {

    @NotBlank(message = "deviceUuid is required")
    @Size(max = 36, message = "deviceUuid must be a valid UUID")
    private String deviceUuid;

    @NotBlank(message = "displayName is required")
    @Size(max = 100)
    private String displayName;

    @Min(0)
    private int totalXp;

    @Min(0)
    private int currentStreak;

    @Min(0)
    private int longestStreak;

    @Min(0)
    private int wordsLearned;
}
