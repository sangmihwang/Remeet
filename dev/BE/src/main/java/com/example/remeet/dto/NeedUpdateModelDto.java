package com.example.remeet.dto;

import lombok.Data;

@Data
public class NeedUpdateModelDto {
    private Integer modelNo;
    private String modelName;

    public NeedUpdateModelDto(Integer modelNo, String modelName) {
        this.modelNo = modelNo;
        this.modelName = modelName;
    }
}
