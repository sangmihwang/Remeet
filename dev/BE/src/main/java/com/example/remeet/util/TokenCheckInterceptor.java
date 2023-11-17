package com.example.remeet.util;

import com.example.remeet.exception.InterceptorException;
import com.example.remeet.exception.InterceptorExceptionEnum;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RequiredArgsConstructor
@Slf4j
public class TokenCheckInterceptor implements HandlerInterceptor {

    private final JwtTokenProvider jwtTokenProvider;


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{

        String [] arr = request.getRequestURI().split("/");
        if(request.getMethod().equals("OPTIONS")) {
            return true;
        }
        String jwtToken = jwtTokenProvider.getJwt();
        String uri = request.getRequestURI();
        

        log.info("요청 주소 :" + request.getRequestURI());
        if(jwtToken != null){
            try {
                if(jwtTokenProvider.validateToken(jwtToken)) { // JWT 토큰이 유효하면
                    int userNo = jwtTokenProvider.getUserNo(jwtToken);
                    request.setAttribute("userNo",userNo);
                    return HandlerInterceptor.super.preHandle(request, response, handler);
                }
                throw new InterceptorException(InterceptorExceptionEnum.Conflict);
                //throw new InterceptorException(InterceptorExceptionEnum.UNAUTHORIZED);
            } catch (MalformedJwtException e) { // 위조 시도

                throw new InterceptorException(InterceptorExceptionEnum.COUNTERFEIT);

            } catch (ExpiredJwtException e) { // 만료된 토큰
                log.error("ACCESS-TOKEN 만료");
                throw new InterceptorException(InterceptorExceptionEnum.Conflict);

            }
        } else { // 토큰이 없음

            if(uri.contains("/token")) { // 토큰 발급
                return true;
            }
            log.error("권한(토큰) 없음!!!! ");
            throw new InterceptorException(InterceptorExceptionEnum.Conflict);
        }

    }

}
