package com.example.remeet.service;

import com.example.remeet.dto.TokenResponseDto;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RedisRepository redisRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final FlaskService flaskService;

    public boolean isUserIdExist(String userId) {
        return userRepository.findByUserId(userId).isPresent();
    }

    public void signUp(String userId, String password, String userName, MultipartFile imagePath, String userEmail) throws IOException {
        String imageURL = " ";
        if (imagePath != null && !imagePath.isEmpty()) {
            imageURL = flaskService.callFlaskByMultipartFile(imagePath,0,0,0,"null","profile").getResult();
        } else {
            imageURL = "common";
        }

        UserEntity newMember = UserEntity.builder()
                .userId(userId)
                .userName(userName)
                .password(BCrypt.hashpw(password, BCrypt.gensalt()))
                .profileImg(imageURL)
                .userEmail(userEmail)
                .isAdmin("F")
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
        userInfo.setUserEmail(user.getUserEmail());
        userInfo.setIsAdmin(user.getIsAdmin());
        return userInfo;
    }

    public void deleteRefreshToken(Integer userNo){
        redisRepository.deleteById(userNo);
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

    public Boolean checkAdmin(Integer userNo) {
        System.out.println(userNo);
        System.out.println(userRepository.findByUserNo(userNo).get());
        if (userRepository.findByUserNo(userNo).get().getIsAdmin().equals("T")) {
            return true;
        } else {
            return false;
        }
    }
}
