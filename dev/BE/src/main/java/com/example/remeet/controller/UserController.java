package com.example.remeet.controller;

import com.example.remeet.dto.*;
import com.example.remeet.service.UserService;
import com.example.remeet.util.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
@Slf4j
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public ResponseEntity userInfo(HttpServletRequest request) {
        Integer userNo = (Integer)request.getAttribute("userNo");
        UserInfoDto userInfoDto = userService.getUserInfoById(userService.getUserId(userNo));
//            userInfoDto.setTokenResponse(tokenResponseDto);
        return ResponseEntity.ok(userInfoDto);
    }

    @GetMapping("check-id")
    public ResponseEntity userCheckId(@RequestParam String userId) {
        // 아이디가 있는지 여부 파악
        boolean exists = userService.isUserIdExist(userId);
        if (!exists) {
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
    public ResponseEntity deleteId(HttpServletRequest request){
        Integer userNo = (Integer)request.getAttribute("userNo");
        userService.deleteId(userNo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("login")
    public ResponseEntity<UserInfoDto> logIn(@RequestBody UserLoginDto userLoginData) {
        // 로그인 가능한 정보인지 확인
        if (userService.checkLoginData(userLoginData)) {
            TokenResponseDto tokenResponseDto = userService.getTokenResponse(userLoginData);
            UserInfoDto userInfoDto = userService.getUserInfoById(userLoginData.getUserId());
            userInfoDto.setTokenResponse(tokenResponseDto);
            return ResponseEntity.ok(userInfoDto);
        } else {
            return  ResponseEntity.status(400).build();
        }
    }

    @GetMapping("logout")
    public ResponseEntity logOut(HttpServletRequest request) {
        Integer userNo = (Integer)request.getAttribute("userNo");
//        userService.deleteRefreshToken(userNo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("reissue")
    public ResponseEntity<AccessTokenDto> reissue(@RequestHeader HttpHeaders header){
        log.info("request to /api/v1/user/reissue [Method: GET]");
        AccessTokenDto accessTokenDto = new AccessTokenDto();
        try{
            String refreshToken = header.getFirst("X-REFRESH-TOKEN");
            Integer userNo = Integer.valueOf(jwtTokenProvider.getUserNo(refreshToken));
            String newAccessToken = JwtTokenProvider.createToken(userNo);
            if(userService.checkRefreshToken(refreshToken)){
                accessTokenDto.setToken(newAccessToken);
                return ResponseEntity.ok(accessTokenDto);
            }
            else{
                log.error("리프래시 토큰 만료 ==> 다시 로그인 ");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        catch (ExpiredJwtException e){
            log.error("리프래시 토큰 만료 ==> 다시 로그인 ");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
