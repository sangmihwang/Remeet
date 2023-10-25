package com.example.remeet.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.time.Duration;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secretKey}")
    private String secretKey ;

    private static Key key;

    @PostConstruct
    public void init() {
        if (secretKey == null) {
            throw new IllegalStateException("jwt.secretKey must be defined in application properties.");
        }
        key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }
    //==토큰 생성 메소드==//
    public static String createToken(int userNo) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + Duration.ofDays(1).toMillis()); // 만료기간 30분
        Claims claims = Jwts.claims().setSubject(Integer.toString(userNo));
        return Jwts.builder()
                .setClaims(claims)
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE) // (1)
                .setIssuer(Integer.toString(userNo)) // 토큰발급자(iss)
                .setIssuedAt(now) // 발급시간(iat)
                .setExpiration(expiration) // 만료시간(exp)
//                .setSubject(subject) //  토큰 제목(subject)
                .signWith(key,SignatureAlgorithm.HS256) // 알고리즘, 시크릿 키
                .compact();
    }

    //==토큰 생성 메소드==//
    public static String createRefreshToken(int userNo) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + Duration.ofDays(14).toMillis()); // 만료기간 2 주
        Claims claims = Jwts.claims().setSubject(Integer.toString(userNo));
        return Jwts.builder()
                .setClaims(claims)
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE) // (1)
                .setIssuer(Integer.toString(userNo)) // 토큰발급자(iss)
                .setIssuedAt(now) // 발급시간(iat)
                .setExpiration(expiration) // 만료시간(exp)
//                .setSubject(subject) //  토큰 제목(subject)
                .signWith(key,SignatureAlgorithm.HS256) // 알고리즘, 시크릿 키
                .compact();
    }



    public String getJwt(){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        return request.getHeader("X-ACCESS-TOKEN");
    }


    //토큰에서 값 추출
    public Integer getUserNo(String token) {
        return Integer.valueOf(Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject());
    }

    //유효한 토큰인지 확인
    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            if (claims.getBody().getExpiration().before(new Date())) {
                return false;
            }
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

}
