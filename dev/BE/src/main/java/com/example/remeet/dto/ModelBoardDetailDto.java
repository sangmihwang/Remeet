package com.example.remeet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelBoardDetailDto {
    private Integer modelNo;
    private String modelName;
    private String imagePath;
    private String avatarId;
    private String heyVoiceId;
    private String eleVoiceId;
    private char gender;
    private String commonVideoPath;
    private List<Map<String, String>> conversationText;
    private String conversationText2;
    private Integer conversationCount;
    private LocalDateTime latestConversationTime;
}
