package com.example.remeet.config;

import com.example.remeet.util.JwtTokenProvider;
import com.example.remeet.util.TokenCheckInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void addInterceptors(InterceptorRegistry registry){
        registry.addInterceptor(new TokenCheckInterceptor(jwtTokenProvider))
                .addPathPatterns("/user")
                .addPathPatterns("/user/logout")
                .addPathPatterns(("/video/*"));



    }
}
