package com.example.remeet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelBoardCreateDto {
    private String modelName;
    private char gender;
    private String imagePath;
    private String conversationText;
}
