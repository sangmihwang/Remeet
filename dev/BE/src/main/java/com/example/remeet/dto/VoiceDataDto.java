package com.example.remeet.dto;

import lombok.Data;

@Data
public class VoiceDataDto {
    private Integer proVoiceNo;
    private String proVoiceName;
    private String voicePath;
    private String imagePath;

    public VoiceDataDto(Integer proVoiceNo, String proVoiceName, String voicePath, String imagePath) {
        this.proVoiceNo = proVoiceNo;
        this.proVoiceName = proVoiceName;
        this.voicePath = voicePath;
        this.imagePath = imagePath;
    }
}
