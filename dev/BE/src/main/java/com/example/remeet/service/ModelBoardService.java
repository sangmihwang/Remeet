package com.example.remeet.service;

import com.example.remeet.dto.*;
import com.example.remeet.entity.*;
import com.example.remeet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ModelBoardService {
    private final FlaskService flaskService;
    private final ModelBoardRepository modelBoardRepository;
    private final UserRepository userRepository;
    private final UploadedVoiceRepository uploadedVoiceRepository;
    private final UploadedVideoRepository uploadedVideoRepository;
    private final ProducedVideoRepository producedVideoRepository;
    private final ProducedVoiceRepository producedVoiceRepository;


    @Transactional(readOnly = true)
    public List<String> getVideoPathsByModelNo(Integer modelNo) {
        ModelBoardEntity modelBoardEntity = modelBoardRepository.findById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 모델입니다"));

        return uploadedVideoRepository.findByModelNo(modelBoardEntity).stream()
                .map(UploadedVideoEntity::getVideoPath)
                .collect(Collectors.toList());
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
        List<String> uploadedImagePaths = flaskService.uploadFilesToFlask(imageFiles, userNo, modelNo, "image");
        List<String> uploadedVoicePaths = flaskService.uploadFilesToFlask(voiceFiles, userNo, modelNo, "voice");
        List<String> uploadedVideoPaths = flaskService.uploadFilesToFlask(videoFiles, userNo, modelNo, "video");

        for (MultipartFile imageFile : imageFiles) {
            for (String imagePath : uploadedImagePaths){
                String avatar = flaskService.callFlaskByMultipartFile(imageFile, "avatar").getResult();
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

        String voiceId = flaskService.makeVoice(modelBoardEntity, fileResources);

        if (voiceId != null && !voiceId.isEmpty()) {
            // Update the ModelBoardEntity with the new voice ID
            modelEntity.setEleVoiceId(voiceId); // Assuming 'eleVoiceId' is the correct field to update
            modelBoardRepository.save(modelEntity);
        }

        return voiceId;
    }

    @Transactional(readOnly = true)
    public Optional<ModelBoardDetailDto> getModelBoardDetailById(Integer modelNo) {
        return modelBoardRepository.findById(modelNo)
                .map(entity -> {
                    List<UploadedVideoDto> videoList = uploadedVideoRepository.findByModelNo(entity).stream()
                            .map(videoEntity -> new UploadedVideoDto(videoEntity.getVideoNo(), videoEntity.getVideoPath()))
                            .collect(Collectors.toList());

                    List<UploadedVoiceDto> voiceList = uploadedVoiceRepository.findByModelNo(entity).stream()
                            .map(voiceEntity -> new UploadedVoiceDto(voiceEntity.getVoiceNo(), voiceEntity.getVoicePath()))
                            .collect(Collectors.toList());

                    return new ModelBoardDetailDto(
                            entity.getModelNo(),
                            entity.getModelName(),
                            entity.getImagePath(),
                            entity.getAvatarId(),
                            entity.getEleVoiceId(),
                            entity.getHeyVoiceId(),
                            entity.getGender(),
                            entity.getCommonVideoPath(),
                            transformValue(entity.getConversationText()),
                            entity.getConversationText(),
                            entity.getConversationCount(),
                            entity.getLatestConversationTime(),
                            videoList,
                            voiceList
                    );
                });
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

    public List<Map<String, String>> transformValue(String conversationText) {
        List<Map<String, String>> result = new ArrayList<>();
        String[] lines = conversationText.split("\n");
        for (String line : lines) {
            String[] words = line.split(":");
            Map<String, String> map = new HashMap<>();
            map.put(words[0], words[1]);
            result.add(map);
        }
        return result;
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

    public List<NeedUpdateModelDto> getNeedUpdateList() {
        List<NeedUpdateModelDto> getList = modelBoardRepository.findByNeedUpdate();
        return getList;
    }

    public void updateHeyVoiceId(NeedUpdateModelDto needUpdateModelDto) throws IOException{
        ModelBoardEntity getModel = modelBoardRepository.findByModelNo(needUpdateModelDto.getModelNo()).get();
        String heyVoiceId = flaskService.callFlaskByMultipartFile(null, needUpdateModelDto.getModelName()).getResult();
        getModel.setHeyVoiceId(heyVoiceId);
        modelBoardRepository.save(getModel);
    }

    public Integer makeConversation(Integer modelNo, String type) {
        ModelBoardEntity model = modelBoardRepository.findById(modelNo)
                .orElseThrow(() -> new EntityNotFoundException("모델 정보가 없습니다."));

        model.setLatestConversationTime(LocalDateTime.now());
        model.setConversationCount(model.getConversationCount() + 1);
        modelBoardRepository.save(model);

        if (type.equals("video")) {
            ProducedVideoEntity newConversation = ProducedVideoEntity.builder()
                    .modelNo(modelBoardRepository.findByModelNo(modelNo).get())
                    .build();
            producedVideoRepository.save(newConversation);
            return newConversation.getProVideoNo();
        } else {
            ProducedVoiceEntity newConversation = ProducedVoiceEntity.builder()
                    .modelNo(modelBoardRepository.findByModelNo(modelNo).get())
                    .build();
            producedVoiceRepository.save(newConversation);
            return newConversation.getProVoiceNo();
        }
    }
}

