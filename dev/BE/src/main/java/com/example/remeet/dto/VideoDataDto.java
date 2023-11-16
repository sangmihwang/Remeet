package com.example.remeet.dto;

import lombok.Data;

@Data
public class VideoDataDto {
    private Integer fileNo;
    private String fileName;
    private String filePath;
    private String imagePath;

    public VideoDataDto(Integer proVideoNo, String proVideoName, String videoPath, String imagePath) {
        this.fileNo = proVideoNo;
        this.fileName = proVideoName;
        this.filePath = videoPath;
        this.imagePath = imagePath;
    }
}
