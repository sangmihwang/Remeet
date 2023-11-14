package com.example.remeet.controller;

import com.example.remeet.dto.CombinationDto;
import com.example.remeet.dto.ConversationDataDto;
import com.example.remeet.dto.ConversationResponseDto;
import com.example.remeet.dto.FlaskResponseDto;

import com.example.remeet.service.FlaskService;
import com.example.remeet.service.ModelBoardService;
import com.example.remeet.service.TalkingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/talking")
@RestController
@Slf4j
public class TalkingController {
    private final FlaskService flaskService;
    private final ModelBoardService modelBoardService;
    private final TalkingService talkingService;

    @PostMapping("{modelNo}")
    public ResponseEntity<Map<String, Integer>> makeConversation(@PathVariable("modelNo") Integer modelNo, @RequestBody String type) {
        Integer conNo = modelBoardService.makeConversation(modelNo, type);
        Map<String, Integer> conversationNo = new HashMap<>();
        conversationNo.put("conversationNo", conNo);
        return ResponseEntity.ok(conversationNo);
    }


    @PostMapping("transcribe")
    public ResponseEntity<FlaskResponseDto> transcribeFile(HttpServletRequest request, @RequestParam("file") MultipartFile file, @RequestParam("modelNo") Integer modelNo, @RequestParam("conversationNo") Integer conversationNo) throws IOException {
        log.info("request to /api/v1/talking/transcribe [Method: POST]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        FlaskResponseDto transcriptionResult = flaskService.callFlaskByMultipartFile(file,userNo,modelNo, conversationNo,"null", "stt");
        return ResponseEntity.ok(transcriptionResult);
    }

    @PostMapping("conversation/voice")
    public ResponseEntity<ConversationResponseDto> conversationVoice(HttpServletRequest request, @RequestBody ConversationDataDto conversationDataDto) throws JsonProcessingException {
        log.info("request to /api/v1/talking/conversation/voice [Method: POST]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        ConversationResponseDto answer = flaskService.callFlaskConversation(conversationDataDto, userNo, "voice");
        return ResponseEntity.ok(answer);
    }

    @PostMapping("conversation/video")
    public ResponseEntity<ConversationResponseDto> conversationVideo(HttpServletRequest request, @RequestBody ConversationDataDto conversationDataDto) throws JsonProcessingException {
        log.info("request to /api/v1/talking/conversation/video [Method: POST]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        ConversationResponseDto answer = flaskService.callFlaskConversation(conversationDataDto, userNo, "video");
        return ResponseEntity.ok(answer);
    }

    @PostMapping("question")
    public ResponseEntity uploadQuestion(HttpServletRequest request, @RequestParam("file") MultipartFile file, @RequestParam("modelNo") Integer modelNo, @RequestParam("conversationNo") Integer conversationNo,  @RequestParam("type") String type) throws IOException {
        log.info("request to /api/v1/talking/question [Method: POST]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        talkingService.uploadQuestion(file,userNo,modelNo, conversationNo, type);
        return ResponseEntity.ok().build();
    }

    @PostMapping("combination")
    public ResponseEntity combinationResult(HttpServletRequest request, CombinationDto combinationDto) throws JsonProcessingException {
        Integer userNo = (Integer)request.getAttribute("userNo");
        talkingService.combinationResult(combinationDto, userNo);
        return ResponseEntity.ok().build();
    }

}
