package com.example.remeet.service;

import com.example.remeet.dto.ModelBoardCreateDto;
import com.example.remeet.dto.ModelBoardDetailDto;
import com.example.remeet.dto.ModelBoardDto;
import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.repository.ModelBoardRepository;
import com.example.remeet.repository.UploadedVideoRepository;
import com.example.remeet.repository.UploadedVoiceRepository;
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
    private UploadedVoiceRepository uploadedVoiceRepository;

    @Autowired
    private UploadedVideoRepository uploadedVideoRepository;

    @Transactional
    public Integer createModelBoard(ModelBoardCreateDto modelBoardCreateDto) {
        ModelBoardEntity modelBoardEntity = ModelBoardEntity.builder()
                .modelName(modelBoardCreateDto.getModelName())
                .gender(modelBoardCreateDto.getGender())
                .imagePath(modelBoardCreateDto.getImagePath())
                .avatarId(modelBoardCreateDto.getAvatarId())
                .voiceId(modelBoardCreateDto.getVoiceId())
                .commonVideoPath(modelBoardCreateDto.getCommonVideoPath())
                .conversationText(modelBoardCreateDto.getConversationText())
                .conversationCount(modelBoardCreateDto.getConversationCount())
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

