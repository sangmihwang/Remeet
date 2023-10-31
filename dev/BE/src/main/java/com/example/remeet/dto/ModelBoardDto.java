package com.example.remeet.dto;

import lombok.Data;

@Data
public class ModelBoardDto {
    private Integer modelNo;
    private String modelName;
    private String imagePath;
    private String avatarId;
    private char gender;
    private String conversationText;
    private Integer conversationCount;
}
