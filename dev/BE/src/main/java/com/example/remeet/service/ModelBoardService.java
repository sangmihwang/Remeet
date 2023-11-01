package com.example.remeet.service;

import com.example.remeet.dto.ModelBoardCreateDto;
import com.example.remeet.dto.ModelBoardDetailDto;
import com.example.remeet.dto.ModelBoardDto;
import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.entity.UploadedVideoEntity;
import com.example.remeet.entity.UploadedVoiceEntity;
import com.example.remeet.entity.UserEntity;
import com.example.remeet.repository.ModelBoardRepository;
import com.example.remeet.repository.UploadedVideoRepository;
import com.example.remeet.repository.UploadedVoiceRepository;
import com.example.remeet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator;


@Service
public class ModelBoardService {

    @Autowired
    private ModelBoardRepository modelBoardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UploadedVoiceRepository uploadedVoiceRepository;

    @Autowired
    private UploadedVideoRepository uploadedVideoRepository;

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

    @Transactional
    public Integer createModelBoard(ModelBoardCreateDto modelBoardCreateDto, Integer userNo) {
        UserEntity userEntity = userRepository.findByUserNo(userNo)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 userNo 입니다"));

        ModelBoardEntity modelBoardEntity = ModelBoardEntity.builder()
                .modelName(modelBoardCreateDto.getModelName())
                .gender(modelBoardCreateDto.getGender())
                .imagePath(modelBoardCreateDto.getImagePath())
                .conversationText(modelBoardCreateDto.getConversationText())
                .userNo(userEntity)
                .build();

        modelBoardRepository.save(modelBoardEntity);
        return modelBoardEntity.getModelNo();
    }


    @Transactional(readOnly = true)
    public List<ModelBoardDto> getAllModelBoards() {
        return modelBoardRepository.findAll().stream()
                .map(entity -> new ModelBoardDto(
                        entity.getModelNo(),
                        entity.getModelName(),
                        entity.getImagePath()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ModelBoardDetailDto> getModelBoardDetailById(Integer modelNo) {
        return modelBoardRepository.findById(modelNo)
                .map(entity -> new ModelBoardDetailDto(
                        entity.getModelNo(),
                        entity.getModelName(),
                        entity.getImagePath(),
                        entity.getAvatarId(),
                        entity.getVoiceId(),
                        entity.getGender(),
                        entity.getCommonVideoPath(),
                        entity.getConversationText(),
                        entity.getConversationCount(),
                        entity.getLatestConversationTime()
                ));
    }

    public List<ModelBoardDto> findByOption(String option) {
        switch (option) {
            case "all":
                return findAll();
            case "recent":
                return findRecent();
            case "most":
                return findMostTalked();
            default:
                throw new IllegalArgumentException("Invalid option provided: " + option);
        }
    }
    public List<ModelBoardDto> findAll() {
        return getAllModelBoards();
    }

    public List<ModelBoardDto> findRecent() {
        return modelBoardRepository.findAll().stream()
                .sorted(Comparator.comparing(ModelBoardEntity::getLatestConversationTime).reversed())
                .map(entity -> new ModelBoardDto(
                        entity.getModelNo(),
                        entity.getModelName(),
                        entity.getImagePath()
                ))
                .collect(Collectors.toList());
    }

    public List<ModelBoardDto> findMostTalked() {
        return modelBoardRepository.findAll().stream()
                .sorted(Comparator.comparing(ModelBoardEntity::getConversationCount).reversed())
                .map(entity -> new ModelBoardDto(
                        entity.getModelNo(),
                        entity.getModelName(),
                        entity.getImagePath()
                ))
                .collect(Collectors.toList());
    }


    @Transactional
    public void deleteModelBoard(Integer modelNo) {
        modelBoardRepository.deleteById(modelNo);
    }
}

