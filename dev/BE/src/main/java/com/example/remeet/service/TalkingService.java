package com.example.remeet.service;


import com.example.remeet.dto.STTResponseDto;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@Service
@RequiredArgsConstructor
public class TalkingService {
    private RestTemplate restTemplate;
    private final String FLASK_API_URL = "http://localhost:5000/api/v1/stt";
    private final String FLASK_API_URL1 = "http://localhost:5000/api/v1/upload";

    @Autowired
    public TalkingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public STTResponseDto callUploadApi(MultipartFile blobData) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA); // Content-Type을 multipart/form-data로 설정

        // MultipartFile을 MultiValueMap에 추가
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(blobData.getBytes()) {
            @Override
            public String getFilename() {
                return blobData.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        // POST 요청 보내기
        ResponseEntity<STTResponseDto> responseEntity = restTemplate.exchange(
                FLASK_API_URL1,
                HttpMethod.POST,
                request,
                STTResponseDto.class
        );

        return responseEntity.getBody();
    }

    public STTResponseDto callFlaskApi(String wavPath) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type을 JSON으로 설정

        // 요청 본문에 wavPath를 담아서 HttpEntity 객체 생성
        HttpEntity<String> request = new HttpEntity<>(new JSONObject().put("wavPath", wavPath).toString(), headers);

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

