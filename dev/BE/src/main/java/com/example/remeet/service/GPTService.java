package com.example.remeet.service;

import com.example.remeet.dto.STTResponseDto;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GPTService {
    private RestTemplate restTemplate;
    private final String FLASK_API_URL = "http://localhost:5000/api/v1/gpt";

    @Autowired
    public GPTService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    public STTResponseDto callFlaskApi(String question) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type을 JSON으로 설정

        // 요청 본문에 qustion을 담아서 HttpEntity 객체 생성
        HttpEntity<String> request = new HttpEntity<>(new JSONObject().put("question", question).toString(), headers);

        // POST 요청 보내기
        ResponseEntity<STTResponseDto> responseEntity = restTemplate.exchange(
                FLASK_API_URL,
                HttpMethod.POST,
                request,
                STTResponseDto.class
        );

        return responseEntity.getBody();
    }
}
