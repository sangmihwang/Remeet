package com.example.remeet.controller;

import com.example.remeet.dto.TokenResponseDto;
import com.example.remeet.dto.UserDataDto;
import com.example.remeet.dto.UserInfoDto;
import com.example.remeet.dto.UserLoginDto;
import com.example.remeet.entity.UserEntity;
import com.example.remeet.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
@Slf4j
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity userInfo() {
        Integer member = 1;
        UserInfoDto userInfoDto = userService.getUserInfoById(userService.getUserId(member));
//            userInfoDto.setTokenResponse(tokenResponseDto);
        return ResponseEntity.ok(userInfoDto);
    }

    @GetMapping("check-id")
    public ResponseEntity userCheckId(@RequestParam String userId) {
        // 아이디가 있는지 여부 파악
        boolean exists = userService.isUserIdExist(userId);
        if (exists) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    @PostMapping("signup")
    public ResponseEntity signUp(@RequestBody UserDataDto userData) {
        // 아이디가 있는지 여부 파악
        boolean exists = userService.isUserIdExist(userData.getUserId());
        if (!exists) {
            // 없으면 만들기
            userService.signUp(userData);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(400).build();
        }
    }

    @DeleteMapping
    public ResponseEntity deleteId(){
        Integer member = 1;
        userService.deleteId(member);
        return ResponseEntity.ok().build();
    }

    @PostMapping("login")
    public ResponseEntity<UserInfoDto> logIn(@RequestBody UserLoginDto userLoginData) {
        // 로그인 가능한 정보인지 확인
        if (userService.checkLoginData(userLoginData)) {
//            TokenResponseDto tokenResponseDto = userService.getTokenResponse(userService.getUserNo(userLoginDto.getUserId()));
            UserInfoDto userInfoDto = userService.getUserInfoById(userLoginData.getUserId());
//            userInfoDto.setTokenResponse(tokenResponseDto);
            return ResponseEntity.ok(userInfoDto);
        } else {
            return  ResponseEntity.status(400).build();
        }
    }

    @GetMapping("logout")
    public ResponseEntity logOut() {
        Integer member = 1;
//        userService.deleteRefreshToken(member);
        return ResponseEntity.ok().build();
    }
}
