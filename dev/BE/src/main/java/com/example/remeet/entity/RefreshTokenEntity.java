package com.example.remeet.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import org.springframework.data.annotation.Id;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "refresh", timeToLive = 1209600)
public class RefreshTokenEntity {

    @Id
    private Integer userNo;

    @Indexed
    private String refreshToken;
}
