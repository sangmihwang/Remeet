package com.example.remeet.dto;

import lombok.Data;

@Data
public class NeedUpdateModelDto {
    private Integer userNo;
    private Integer modelNo;
    private String modelName;

    public NeedUpdateModelDto(Integer modelNo, String modelName, Integer userNo) {
        this.modelNo = modelNo;
        this.modelName = modelName;
        this.userNo = userNo;
    }
}
