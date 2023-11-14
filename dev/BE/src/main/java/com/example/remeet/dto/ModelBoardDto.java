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
    private String eleVoiceId;
    private String heyVoiceId;

    public ModelBoardDto(Integer modelNo, String modelName, String imagePath, String eleVoiceId, String heyVoiceId) {
        this.modelNo = modelNo;
        this.modelName = modelName;
        this.imagePath = imagePath;
        this.eleVoiceId = eleVoiceId;
        this.heyVoiceId = heyVoiceId;
    }
}
