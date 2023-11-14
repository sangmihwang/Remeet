package com.example.remeet.service;

import com.example.remeet.dto.FlaskResponseDto;
import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.repository.ModelBoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TalkingService {
    private final FlaskService flaskService;
    private final ModelBoardRepository modelBoardRepository;
    public FlaskResponseDto uploadQuestion(MultipartFile file, Integer userNo, Integer modelNo, Integer conversationNo , String type) throws IOException {
        ModelBoardEntity getModel = modelBoardRepository.findByModelNo(modelNo).get();
        FlaskResponseDto getAnswer = flaskService.callFlaskByMultipartFile(file,userNo,modelNo,conversationNo,getModel.getCommonHoloPath(), type);
        return getAnswer;
    }
}
