package com.example.remeet.controller;

import com.example.remeet.dto.STTResponseDto;
import com.example.remeet.service.GPTService;
import com.example.remeet.service.TTSService;
import com.example.remeet.service.TalkingService;
import com.example.remeet.service.UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/talking")
@RestController
@Slf4j
public class TalkingController {
    private final TalkingService talkingService;
    private final UploadService uploadService;
    private final GPTService gptService;
    private final TTSService ttsService;

    @PostMapping("stt/{voiceId}")
    public ResponseEntity<STTResponseDto> upload(@RequestPart(value = "file") MultipartFile multipartFile, @PathVariable("voiceId") String voiceId) throws Exception {
        String wavPath = uploadService.upload(multipartFile);
        String msg = talkingService.callFlaskApi(wavPath).getText();
        String answer = gptService.callFlaskApi(msg).getText();
        STTResponseDto audioPath = ttsService.callFlaskApi(answer, voiceId);
        return new ResponseEntity<STTResponseDto>(audioPath, HttpStatus.OK);
    }

}
