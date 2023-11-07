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
public class FlaskService {
    private RestTemplate restTemplate;
    private final String FLASK_API_URL = "http://localhost:5000/api/v1/";

    @Autowired
    public FlaskService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public STTResponseDto callFlaskByString(String requestThing, String voiceId) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type을 JSON으로 설정

        // 요청 본문에 qustion을 담아서 HttpEntity 객체 생성
        HttpEntity<String> request = new HttpEntity<>(new JSONObject().put("request", requestThing).put("voiceId", voiceId).toString(), headers);

        // POST 요청 보내기
        String URL = FLASK_API_URL + "GPT";
        ResponseEntity<STTResponseDto> responseEntity = restTemplate.exchange(
                URL,
                HttpMethod.POST,
                request,
                STTResponseDto.class
        );
        return responseEntity.getBody();
    }

    public String callFlaskByMultipartFile(MultipartFile file, String type) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA); // Content-Type을 multipart/form-data로 설정

        // MultipartFile을 MultiValueMap에 추가
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        // POST 요청 보내기
        String newURL = " ";
        if (type == "avatar"){
            newURL = FLASK_API_URL + "createAvatarID";
        } else if (type == "stt") {
            newURL = FLASK_API_URL + "transcribe";
        } else if (type == "profile") {
            newURL = FLASK_API_URL + "signup";
        }

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                newURL,
                HttpMethod.POST,
                request,
                String.class
        );
        return responseEntity.getBody();
    }
}
