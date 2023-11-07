package com.example.remeet.service;

import com.example.remeet.dto.*;
import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.entity.UploadedVideoEntity;
import com.example.remeet.entity.UploadedVoiceEntity;
import com.example.remeet.entity.UserEntity;
import com.example.remeet.repository.ModelBoardRepository;
import com.example.remeet.repository.UploadedVideoRepository;
import com.example.remeet.repository.UploadedVoiceRepository;
import com.example.remeet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ModelBoardService {

    private final String FLASK_API_UPROAD = "http://localhost:5000/api/v1/upload/files";
    private final String FLASK_API_AVATAR = "http://localhost:5000/api/v1/createAvatarID";
    private final FlaskService flaskService;
    private final ModelBoardRepository modelBoardRepository;
    private final UserRepository userRepository;
    private final UploadedVoiceRepository uploadedVoiceRepository;
    private final UploadedVideoRepository uploadedVideoRepository;
    @Transactional(readOnly = true)
    public List<String> getVideoPathsByModelNo(Integer modelNo) {
        ModelBoardEntity modelBoardEntity = modelBoardRepository.findById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 모델입니다"));

        return uploadedVideoRepository.findByModelNo(modelBoardEntity).stream()
                .map(UploadedVideoEntity::getVideoPath)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getVoicePathsByModelNo(Integer modelNo) {
        ModelBoardEntity modelEntity = modelBoardRepository.findById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 모델입니다"));

        return uploadedVoiceRepository.findByModelNo(modelEntity).stream()
                .map(UploadedVoiceEntity::getVoicePath)
                .collect(Collectors.toList());
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

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<FileUploadDto> response = restTemplate.exchange(
                FLASK_API_UPROAD,
                HttpMethod.POST,
                requestEntity,
                FileUploadDto.class
        );
        List<String> FileList = response.getBody().getFileList();

        return FileList;
    }

    @Transactional
    public Integer createModelBoard(ModelBoardCreateDto modelBoardCreateDto, Integer userNo, List<MultipartFile> voiceFiles, List<MultipartFile> videoFiles, List<MultipartFile> imageFiles, String kakaoName, String conversationText) throws IOException{
        UserEntity userEntity = userRepository.findByUserNo(userNo)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 userNo 입니다"));
        // 파일내용불러오기
        // 작성
        String formattedText = formatChat(conversationText, kakaoName);
        ModelBoardEntity modelBoardEntity = ModelBoardEntity.builder()
                .modelName(modelBoardCreateDto.getModelName())
                .gender(modelBoardCreateDto.getGender())
                .imagePath("tmp")
                .conversationText(formattedText)
                .userNo(userEntity)
                .conversationCount(0)
                .build();

        modelBoardRepository.save(modelBoardEntity);

        Integer modelNo = modelBoardEntity.getModelNo();
        List<String> uploadedImagePaths = uploadFilesToFlask(imageFiles, userNo, modelNo, "image");
        List<String> uploadedVoicePaths = uploadFilesToFlask(voiceFiles, userNo, modelNo, "voice");
        List<String> uploadedVideoPaths = uploadFilesToFlask(videoFiles, userNo, modelNo, "video");

        for (MultipartFile imageFile : imageFiles) {
            for (String imagePath : uploadedImagePaths){
                String avatar = flaskService.callFlaskByMultipartFile(imageFile, "avatar");
                ModelBoardEntity resetModel = modelBoardRepository.findByModelNo(modelNo).get();
                resetModel.setImagePath(imagePath);
                resetModel.setAvatarId(avatar);
                modelBoardRepository.save(resetModel);
            }
        }

        for (String voicePath : uploadedVoicePaths){
            UploadedVoiceEntity uploadedVoiceEntity = UploadedVoiceEntity.builder()
                    .voicePath(voicePath)
                    .modelNo(modelBoardEntity)
                    .build();
            uploadedVoiceRepository.save(uploadedVoiceEntity);
        }

        for (String videoPath : uploadedVideoPaths) {
            UploadedVideoEntity uploadedVideoEntity = UploadedVideoEntity.builder()
                    .videoPath(videoPath)
                    .modelNo(modelBoardEntity)
                    .build();
            uploadedVideoRepository.save(uploadedVideoEntity);
        }

        return modelBoardEntity.getModelNo();
    }

    @Transactional(readOnly = true)
    public String createVoiceModel(Integer modelNo) throws IOException {
        ModelBoardEntity modelEntity = modelBoardRepository.findById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("모델 번호에 해당하는 모델이 존재하지 않습니다."));

        List<UploadedVoiceEntity> uploadedVoices = uploadedVoiceRepository.findByModelNo(modelEntity);

        // 음성 파일이 없는 경우 예외 처리
        if (uploadedVoices.isEmpty()) {
            throw new IllegalArgumentException("음성 파일이 존재하지 않습니다.");
        }

        // ModelBoardEntity 가져오기 (모델 이름과 성별 정보에 사용)
        ModelBoardEntity modelBoardEntity = modelBoardRepository.findById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("모델이 존재하지 않습니다."));

        // Flask 서버로 전송할 파일 리스트 생성
        List<FileSystemResource> fileResources = uploadedVoices.stream()
                .map(voice -> new FileSystemResource(new File(voice.getVoicePath())))
                .collect(Collectors.toList());

        String voiceId = makeVoice(modelBoardEntity, fileResources);

        if (voiceId != null && !voiceId.isEmpty()) {
            // Update the ModelBoardEntity with the new voice ID
            modelEntity.setEleVoiceId(voiceId); // Assuming 'eleVoiceId' is the correct field to update
            modelBoardRepository.save(modelEntity);
        }

        return voiceId;
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
        String voiceApiUrl = "http://localhost:5000/api/v1/conversation/makevoice";

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

    @Transactional(readOnly = true)
    public Optional<ModelBoardDetailDto> getModelBoardDetailById(Integer modelNo) {
        return modelBoardRepository.findById(modelNo)
                .map(entity -> new ModelBoardDetailDto(
                        entity.getModelNo(),
                        entity.getModelName(),
                        entity.getImagePath(),
                        entity.getAvatarId(),
                        entity.getEleVoiceId(),
                        entity.getHeyVoiceId(),
                        entity.getGender(),
                        entity.getCommonVideoPath(),
                        entity.getConversationText(),
                        entity.getConversationCount(),
                        entity.getLatestConversationTime()
                ));
    }

    public String formatChat(String conversationText, String kakaoName) {
        StringBuilder formattedText = new StringBuilder();
        String[] lines = conversationText.split("\\r?\\n");
        for (String line : lines) {
            String formattedLine = transformLine(line, kakaoName);
            if (formattedLine != null) {
                formattedText.append(formattedLine).append("\n");
            }
        }

        // 마지막 줄의 개행 문자를 제거
        if (formattedText.length() > 0) {
            formattedText.setLength(formattedText.length() - 1);
        }

        return formattedText.toString();
    }
    
    public String transformLine(String line, String kakaoName) {
        Pattern pattern = Pattern.compile("^(\\d{4}\\. \\d{1,2}\\. \\d{1,2}\\. (오전|오후) \\d{1,2}:\\d{2}, )?(.+) : (.+)$");
        Matcher matcher = pattern.matcher(line);

        if (matcher.matches()) {
            String person = matcher.group(3);
            String message = matcher.group(4);
    
            if (kakaoName.equals(person)) {
                return "상대방 : " + message;
            } else {
                return "나 : " + message;
            }
        }
        return null;
    }
    public List<ModelBoardDto> findByOption(String option, Integer userNo) {
        switch (option) {
            case "all":
                return modelBoardRepository.findByUserNo(userNo);
            case "recent":
                return modelBoardRepository.findMostRecentByUserNo(userNo, PageRequest.of(0, 3));
            case "most":
                return modelBoardRepository.findTopModelsByUserNo(userNo, PageRequest.of(0, 3));
            default:
                throw new IllegalArgumentException("Invalid option provided: " + option);
        }
    }

    @Transactional
    public void deleteModelBoard(Integer modelNo) {
        modelBoardRepository.deleteById(modelNo);
    }
}

