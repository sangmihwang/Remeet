package com.example.remeet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelBoardDetailDto {
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
