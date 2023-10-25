package com.example.remeet.service;


import com.example.remeet.dto.STTResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
@RequiredArgsConstructor
public class TalkingService {
    private RestTemplate restTemplate;

    @Autowired
    public TalkingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public STTResponseDto callFlaskApiWithPost(String dataToSend) {
        String flaskApiUrl = "http://localhost:5000/api/v1/start_stt";

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 데이터와 헤더를 같이 보낼 HttpEntity 객체 생성
        HttpEntity<String> request = new HttpEntity<>(dataToSend, headers);

        return restTemplate.postForObject(flaskApiUrl, request, STTResponseDto.class);
    }

}
