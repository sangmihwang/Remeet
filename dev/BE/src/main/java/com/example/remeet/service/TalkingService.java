package com.example.remeet.service;

import com.example.remeet.dto.CombinationDto;
import com.example.remeet.dto.ConversationDataDto;
import com.example.remeet.dto.ConversationResponseDto;
import com.example.remeet.dto.FlaskResponseDto;
import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.entity.ProducedVideoEntity;
import com.example.remeet.entity.ProducedVoiceEntity;
import com.example.remeet.repository.ModelBoardRepository;
import com.example.remeet.repository.ProducedVideoRepository;
import com.example.remeet.repository.ProducedVoiceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TalkingService {
    private final FlaskService flaskService;
    private final ModelBoardRepository modelBoardRepository;
    private final ProducedVoiceRepository producedVoiceRepository;
    private final ProducedVideoRepository producedVideoRepository;


    public FlaskResponseDto uploadQuestion(MultipartFile file, Integer userNo, Integer modelNo, Integer conversationNo , String type) throws IOException {
        ModelBoardEntity getModel = modelBoardRepository.findByModelNo(modelNo).get();
        FlaskResponseDto getAnswer = flaskService.callFlaskByMultipartFile(file,userNo,modelNo,conversationNo,getModel.getCommonHoloPath(), type);
        return getAnswer;
    }

    public void combinationResult(CombinationDto combinationDto, Integer userNo) throws JsonProcessingException {
        ConversationDataDto tmpDto = new ConversationDataDto();
        tmpDto.setConversationNo(combinationDto.getConversationNo());
        tmpDto.setModelNo(combinationDto.getModelNo());
        if (combinationDto.getType().equals("voice")) {
            ConversationResponseDto getResult = flaskService.callFlaskConversation(tmpDto, userNo, "mp3");
            ProducedVoiceEntity getConversation = producedVoiceRepository.findByProVoiceNo(combinationDto.getConversationNo()).get();
            getConversation.setProVoiceName(combinationDto.getConversationName());
            getConversation.setVoicePath(getResult.getAnswer());
            producedVoiceRepository.save(getConversation);
        } else {
            ConversationResponseDto getResult = flaskService.callFlaskConversation(tmpDto, userNo,  "mp4");
            ProducedVideoEntity getConversation = producedVideoRepository.findByProVideoNo(combinationDto.getConversationNo()).get();
            getConversation.setProVideoName(combinationDto.getConversationName());
            getConversation.setVideoPath(getResult.getAnswer());
            producedVideoRepository.save(getConversation);
        }
    }

    public ConversationResponseDto conversationVideo(ConversationDataDto conversationDataDto,Integer userNo, String type) throws JsonProcessingException {
        ModelBoardEntity getModel = modelBoardRepository.findByModelNo(conversationDataDto.getModelNo()).get();
        conversationDataDto.setMovingHoloPath(getModel.getMovingHoloPath());
        ConversationResponseDto answer = flaskService.callFlaskConversation(conversationDataDto, userNo, "video");
        return answer;

    }
}
