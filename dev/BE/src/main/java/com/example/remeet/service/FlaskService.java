package com.example.remeet.service;

import com.example.remeet.dto.ConversationDataDto;
import com.example.remeet.dto.ConversationResponseDto;
import com.example.remeet.dto.FileUploadDto;
import com.example.remeet.dto.FlaskResponseDto;
import com.example.remeet.entity.ModelBoardEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FlaskService {
    private RestTemplate restTemplate;
    private UserService userService;
    private final String FLASK_API_URL = "http://k9a706.p.ssafy.io:5000/api/v1/";

    @Autowired
    public FlaskService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ConversationResponseDto callFlaskConversation(ConversationDataDto conversationDataDto, Integer userNo, String type) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type JSON으로 설정

        // 요청 본문에 conversationDataDto 담아서 HttpEntity 객체 생성
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequest = objectMapper.writeValueAsString(conversationDataDto);

        // userNo를 JSON 객체에 추가
        JSONObject jsonRequestObject = new JSONObject(jsonRequest);
        jsonRequestObject.put("userNo", userNo);

        // POST 요청 보내기
        String NEW_URL = " ";
        if (type.equals("video")) {
            NEW_URL = FLASK_API_URL +"conversation/video";
            if (userService.checkAdmin(userNo)) {
                jsonRequestObject.put("admin", "true");
            } else{
                jsonRequestObject.put("admin", "false");
            }
        } else if (type.equals("voice")) {
            NEW_URL = FLASK_API_URL + "conversation/voice";
        }

        HttpEntity<String> request = new HttpEntity<>(jsonRequestObject.toString(), headers);
        ResponseEntity<ConversationResponseDto> responseEntity = restTemplate.exchange(
                NEW_URL,
                HttpMethod.POST,
                request,
                ConversationResponseDto.class
        );
        return responseEntity.getBody();
    }

    public FlaskResponseDto callFlaskByMultipartFile(MultipartFile file, String type) throws IOException {
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
            newURL = FLASK_API_URL + "heyVoiceId";
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
    public String makeVoice(ModelBoardEntity modelBoardEntity, List<FileSystemResource> audioFiles) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("modelName", modelBoardEntity.getModelName());
        body.add("gender", modelBoardEntity.getGender());

        for (FileSystemResource fileResource : audioFiles) {
            body.add("files", fileResource);
        }

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        String voiceApiUrl = FLASK_API_URL + "conversation/makevoice";

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
