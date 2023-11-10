package com.example.remeet.controller;

import com.example.remeet.dto.ConversationDataDto;
import com.example.remeet.dto.ConversationResponseDto;
import com.example.remeet.dto.FlaskResponseDto;

import com.example.remeet.service.FlaskService;
import com.example.remeet.service.ModelBoardService;
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

    @PostMapping("{modelNo}")
    public ResponseEntity<Map<String, Integer>> makeConversation(@PathVariable("modelNo") Integer modelNo, @RequestBody String type) {
        Integer conNo = modelBoardService.makeConversation(modelNo, type);
        Map<String, Integer> conversationNo = new HashMap<>();
        conversationNo.put("conversationNo", conNo);
        return ResponseEntity.ok(conversationNo);
    }


    @PostMapping("transcribe")
    public ResponseEntity<FlaskResponseDto> transcribeFile(@RequestParam("file") MultipartFile file) throws IOException {
        log.info("request to /api/v1/talking/transcribe [Method: POST]");
        FlaskResponseDto transcriptionResult = flaskService.callFlaskByMultipartFile(file, "stt");
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
}
