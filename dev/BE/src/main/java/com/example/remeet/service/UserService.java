package com.example.remeet.service;

import com.example.remeet.dto.TokenResponseDto;
import com.example.remeet.dto.UserDataDto;
import com.example.remeet.dto.UserInfoDto;
import com.example.remeet.dto.UserLoginDto;
import com.example.remeet.entity.RefreshTokenEntity;
import com.example.remeet.entity.UserEntity;
import com.example.remeet.repository.RedisRepository;
import com.example.remeet.repository.UserRepository;
import com.example.remeet.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RedisRepository redisRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public boolean isUserIdExist(String userId) {
        return userRepository.findByUserId(userId).isPresent();
    }

    public void signUp(UserDataDto userData) {
        UserEntity newMember = UserEntity.builder()
                .userId(userData.getUserId())
                .userName(userData.getUserName())
                .password(BCrypt.hashpw(userData.getPassword(), BCrypt.gensalt()))
                .profileImg(userData.getImagePath())
                .build();
        userRepository.save(newMember);
    }

    public void deleteId(Integer userNo) {
        userRepository.deleteById(userNo);
    }

    public boolean checkLoginData(UserLoginDto userLoginDto){
        Optional<UserEntity> user = userRepository.findByUserId(userLoginDto.getUserId());
        if(user.isPresent()&& BCrypt.checkpw(userLoginDto.getPassword(), user.get().getPassword())){
            return true;
        }
        else {
            return false;
        }
    }

    public UserInfoDto getUserInfoById(String userId) {
        UserEntity user = userRepository.findByUserId(userId).get();
        UserInfoDto userInfo = new UserInfoDto();
        userInfo.setUserNo(user.getUserNo());
        userInfo.setUserName(user.getUserName());
        userInfo.setImagePath(user.getProfileImg());

        return userInfo;
    }

    public String getUserId(Integer userNo) {
        return userRepository.findByUserNo(userNo).get().getUserId();
    }


    public TokenResponseDto getTokenResponse(UserLoginDto userLoginData){
        Integer userNo = userRepository.findByUserId(userLoginData.getUserId()).get().getUserNo();
        String accessToken = jwtTokenProvider.createToken(userNo);
        String refreshToken = jwtTokenProvider.createRefreshToken(userNo);
        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder()
                .refreshToken(refreshToken)
                .userNo(userRepository.findByUserId(userLoginData.getUserId()).get().getUserNo())
                .build();
        redisRepository.save(refreshTokenEntity);
        TokenResponseDto tokenResponseDto = new TokenResponseDto();
        tokenResponseDto.setAccessToken(accessToken);
        tokenResponseDto.setRefreshToken(refreshToken);
        return tokenResponseDto;
    }

    public boolean checkRefreshToken(String token){
        if(redisRepository.findByRefreshToken(token) == null) return false; // 리프레시 토큰이 유효하다면 true 아니라면 false 반환
        else return true;
    }
}
