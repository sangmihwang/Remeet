package com.example.remeet.service;

import com.example.remeet.dto.*;
import com.example.remeet.entity.ModelBoardEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlaskService {
    private RestTemplate restTemplate;
    private final String FLASK_API_URL = "http://nginx:7999/api/v1/";

    @Autowired
    public FlaskService(RestTemplate restTemplate ) {
        this.restTemplate = restTemplate;
    }

    public ConversationResponseDto callFlaskConversation(ConversationDataDto conversationDataDto, Integer userNo,Boolean admin, String type) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type JSON으로 설정

        // 요청 본문에 conversationDataDto 담아서 HttpEntity 객체 생성
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequest = objectMapper.writeValueAsString(conversationDataDto);

        // userNo를 JSON 객체에 추가
        JSONObject jsonRequestObject = new JSONObject(jsonRequest);
        jsonRequestObject.put("userNo", userNo);
        jsonRequestObject.put("type", type);
        // POST 요청 보내기
        String NEW_URL = " ";
        System.out.println(userNo);

        if (type.equals("video")) {
            NEW_URL = FLASK_API_URL +"conversation/video";
            if (admin) {
                jsonRequestObject.put("admin", 1);
            } else{
                jsonRequestObject.put("admin", 0);
            }
        } else if (type.equals("voice")) {
            NEW_URL = FLASK_API_URL + "conversation/voice";
        } else if (type.equals("mp3") || type.equals("mp4")) {
            NEW_URL = FLASK_API_URL + "combinResult";
        } else {
            NEW_URL = FLASK_API_URL + "heyVoiceId";
        }
        System.out.println(jsonRequestObject);
        HttpEntity<String> request = new HttpEntity<>(jsonRequestObject.toString(), headers);
        ResponseEntity<ConversationResponseDto> responseEntity = restTemplate.exchange(
                NEW_URL,
                HttpMethod.POST,
                request,
                ConversationResponseDto.class
        );
        return responseEntity.getBody();
    }

    public CommonVideoDto callFlaskCommonVideo(ConversationDataDto conversationDataDto, Integer userNo, Boolean admin) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type JSON으로 설정

        // 요청 본문에 conversationDataDto 담아서 HttpEntity 객체 생성
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequest = objectMapper.writeValueAsString(conversationDataDto);

        // userNo를 JSON 객체에 추가
        JSONObject jsonRequestObject = new JSONObject(jsonRequest);
        jsonRequestObject.put("userNo", userNo);
        jsonRequestObject.put("admin", admin);
        // POST 요청 보내기
        String NEW_URL = FLASK_API_URL +"conversation/commonvideo";

        HttpEntity<String> request = new HttpEntity<>(jsonRequestObject.toString(), headers);
        ResponseEntity<CommonVideoDto> responseEntity = restTemplate.exchange(
                NEW_URL,
                HttpMethod.POST,
                request,
                CommonVideoDto.class
        );
        return responseEntity.getBody();
    }


    public FlaskResponseDto callFlaskByMultipartFile(MultipartFile file, Integer userNo, Integer modelNo, Integer conversationNo ,String url, String type) throws IOException {
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
        body.add("type", type);
        body.add("userNo", userNo);
        body.add("url", url);
        body.add("modelNo", modelNo);
        body.add("conversationNo", conversationNo);
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        // POST 요청 보내기
        String newURL = " ";
        if (type.equals("avatar")){
            newURL = FLASK_API_URL + "createAvatarID";
        } else if (type.equals("stt")) {
            newURL = FLASK_API_URL + "transcribe";
        } else if (type.equals("profile")) {
            newURL = FLASK_API_URL + "signup";
        } else {
            newURL = FLASK_API_URL + "upload/talking";
        }

        ResponseEntity<FlaskResponseDto> responseEntity = restTemplate.exchange(
                newURL,
                HttpMethod.POST,
                request,
                FlaskResponseDto.class
        );
        return responseEntity.getBody();
    }

    // 기존의 makeVoice 메소드를 수정하여 FileSystemResource 리스트를 받도록 함
    public String makeVoice(ModelBoardEntity modelBoardEntity, List<String> filePaths) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("modelName", modelBoardEntity.getModelNo());
        body.add("gender", modelBoardEntity.getGender());

        filePaths.forEach(path -> body.add("filePaths", path));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        String voiceApiUrl = FLASK_API_URL + "conversation/makevoice";

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(voiceApiUrl, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map responseBody = response.getBody();
                if (responseBody.containsKey("voice_id")) {
                    return responseBody.get("voice_id").toString();
                } else {
                    throw new RuntimeException("Voice ID not found in the response");
                }
            } else {
                throw new RuntimeException("Failed to create voice model: " + response.getStatusCode());
            }
        } catch (RestClientException e) {
            log.error("Flask 서버 통신 중 오류 발생", e);
            throw new RuntimeException("음성 생성 API 호출 실패", e);
        }

    }

    public List<String> uploadFilesToFlask(List<MultipartFile> Files, Integer userNo, Integer modelNo, String type) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        for (MultipartFile file : Files) {
            body.add("files", new ByteArrayResource(file.getBytes()){
                @Override
                public String getFilename(){
                    return file.getOriginalFilename();
                }
            });
        }
        body.add("userNo", userNo.toString());
        body.add("modelNo", modelNo.toString());
        body.add("type", type);

        String NEW_URL = FLASK_API_URL +"upload/files";
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<FileUploadDto> response = restTemplate.exchange(
                NEW_URL,
                HttpMethod.POST,
                requestEntity,
                FileUploadDto.class
        );
        List<String> FileList = response.getBody().getFileList();

        return FileList;
    }
}
