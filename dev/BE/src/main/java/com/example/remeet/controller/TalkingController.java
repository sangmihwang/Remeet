package com.example.remeet.controller;

import com.example.remeet.dto.FlaskResponseDto;

import com.example.remeet.service.FlaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/talking")
@RestController
@Slf4j
public class TalkingController {
    private final FlaskService flaskService;

    @PostMapping("transcribe")
    public ResponseEntity<FlaskResponseDto> transcribeFile(@RequestParam("file") MultipartFile file) throws IOException {
        log.info("request to /api/v1/talking/transcribe [Method: POST]");
        FlaskResponseDto transcriptionResult = flaskService.callFlaskByMultipartFile(file, "stt");
        return ResponseEntity.ok(transcriptionResult);
    }


}
