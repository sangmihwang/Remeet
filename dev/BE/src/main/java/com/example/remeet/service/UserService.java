package com.example.remeet.service;

import com.example.remeet.dto.UserDataDto;
import com.example.remeet.dto.UserInfoDto;
import com.example.remeet.dto.UserLoginDto;
import com.example.remeet.entity.UserEntity;
import com.example.remeet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public boolean isUserIdExist(String userId) {
        return userRepository.findByUserId(userId).isPresent();
    }

    public void signUp(UserDataDto userData) {
        UserEntity newMember = UserEntity.builder()
                .userId(userData.getUserId())
                .userName(userData.getUserName())
                .password(userData.getPassword())
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


//    public void deleteRefreshToken(int userNo){
//        refreshTokenRedisRepository.deleteById(userNo);
//    }

}
