package com.example.remeet.dto;

import lombok.Data;

@Data
public class STTResponseDto {
    private String text;

    public void setMsg(String msg) {
        this.text = msg;
    }
}
