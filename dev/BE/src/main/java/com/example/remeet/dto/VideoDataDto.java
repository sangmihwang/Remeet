package com.example.remeet.dto;

import lombok.Data;

@Data
public class VideoDataDto {
    private Integer proVideoNo;
    private String proVideoName;
    private String videoPath;
    private String holoPath;
    private String imagePath;

    public VideoDataDto(Integer proVideoNo, String proVideoName, String videoPath, String holoPath, String imagePath) {
        this.proVideoNo = proVideoNo;
        this.proVideoName = proVideoName;
        this.videoPath = videoPath;
        this.holoPath = holoPath;
        this.imagePath = imagePath;
    }
}
