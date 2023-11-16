package com.example.remeet.dto;

import lombok.Data;

@Data
public class TokenResponseDto {

    private String accessToken;

    private String refreshToken;
}
