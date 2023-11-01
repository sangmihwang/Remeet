package com.example.remeet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelBoardDto {
    private Integer modelNo;
    private String modelName;
    private String imagePath;
    private String avatarId;
    private String voiceId;
    private char gender;
    private String commonVideoPath;
    private String conversationText;
    private Integer conversationCount;
    private LocalDateTime latestConversationTime;
}
