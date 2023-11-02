package com.example.remeet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
public class ModelBoardDto {
    private Integer modelNo;
    private String modelName;
    private String imagePath;

    public ModelBoardDto(Integer modelNo, String modelName, String imagePath) {
        this.modelNo = modelNo;
        this.modelName = modelName;
        this.imagePath = imagePath;
    }
}
