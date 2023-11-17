package com.example.remeet.repository;


import com.example.remeet.entity.RefreshTokenEntity;
import org.springframework.data.repository.CrudRepository;


public interface RedisRepository extends CrudRepository<RefreshTokenEntity, Integer> {
    RefreshTokenEntity findByRefreshToken(String token);
}

