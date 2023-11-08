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
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

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
        log.info("request to /api/v1/user [Method: GET]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        UserInfoDto userInfoDto = userService.getUserInfoById(userService.getUserId(userNo));
        return ResponseEntity.ok(userInfoDto);
    }

    @GetMapping("check-id")
    public ResponseEntity userCheckId(@RequestParam String userId) {
        log.info("request to /api/v1/user/chek-id [Method: GET]");
        // 아이디가 있는지 여부 파악
        boolean exists = userService.isUserIdExist(userId);
        if (!exists) {
            return ResponseEntity.ok().build();
        } else {
            log.info("이미 존재하는 ID : "+userId);
            return ResponseEntity.status(403).build();
        }
    }

    @PostMapping("signup")
    public ResponseEntity signUp(@RequestParam("userId") String userId,
                                 @RequestParam("password") String password,
                                 @RequestParam("userName") String userName,
                                 @RequestParam(value = "imagePath", required = false) MultipartFile imagePath,
                                 @RequestParam("userEmail") String userEmail) throws IOException {
        log.info("request to /api/v1/user/signup [Method: POST]");
        // 아이디가 있는지 여부 파악
        boolean exists = userService.isUserIdExist(userId);
        if (!exists) {
            // 없으면 만들기
            userService.signUp(userId,password,userName,imagePath,userEmail);
            return ResponseEntity.ok().build();
        } else {
            log.info("이미 존재하는 ID : "+userId);
            return ResponseEntity.status(400).build();
        }
    }

    @DeleteMapping
    public ResponseEntity deleteId(HttpServletRequest request){
        log.info("request to /api/v1/user [Method: DELETE]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        userService.deleteId(userNo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("login")
    public ResponseEntity<UserInfoDto> logIn(@RequestBody UserLoginDto userLoginData) {
        log.info("request to /api/v1/user/login [Method: POST]");
        // 로그인 가능한 정보인지 확인
        if (userService.checkLoginData(userLoginData)) {
            TokenResponseDto tokenResponseDto = userService.getTokenResponse(userLoginData);
            UserInfoDto userInfoDto = userService.getUserInfoById(userLoginData.getUserId());
            userInfoDto.setTokenResponse(tokenResponseDto);
            return ResponseEntity.ok(userInfoDto);
        } else {
            log.info("존재하지 않는 로그인 정보");
            return  ResponseEntity.status(400).build();
        }
    }

    @GetMapping("logout")
    public ResponseEntity logOut(HttpServletRequest request) {
        log.info("request to /api/v1/user/logout [Method: GET]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        userService.deleteRefreshToken(userNo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("reissue")
    public ResponseEntity<AccessTokenDto> reissue(@RequestHeader HttpHeaders header){
        log.info("request to /api/v1/user/reissue [Method: POST]");
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
