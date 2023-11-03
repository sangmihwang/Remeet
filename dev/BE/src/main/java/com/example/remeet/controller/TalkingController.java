package com.example.remeet.controller;

import com.example.remeet.dto.STTResponseDto;
import com.example.remeet.service.FlaskService;
import com.example.remeet.service.GPTService;
import com.example.remeet.service.TTSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/talking")
@RestController
@Slf4j
public class TalkingController {
    private final TalkingService talkingService;
    private final GPTService gptService;
    private final TTSService ttsService;
    private final FlaskService flaskService;

    @PostMapping("stt/{voiceId}")
    public ResponseEntity<STTResponseDto> upload(@RequestPart(value = "file") MultipartFile multipartFile, @PathVariable("voiceId") String voiceId) throws Exception {
        String wavPath = flaskService.callFlaskByMultipartFile(multipartFile, "stt");
        String msg = talkingService.callFlaskApi(wavPath).getText();
        String answer = gptService.callFlaskApi(msg).getText();
        STTResponseDto audioPath = ttsService.callFlaskApi(answer, voiceId);
        return new ResponseEntity<STTResponseDto>(audioPath, HttpStatus.OK);
    }

}
