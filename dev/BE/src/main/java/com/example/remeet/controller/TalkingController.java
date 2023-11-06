package com.example.remeet.controller;

import com.example.remeet.dto.STTResponseDto;
import com.example.remeet.service.FlaskService;
import com.example.remeet.service.GPTService;
import com.example.remeet.service.TTSService;
import com.example.remeet.service.TranscribeStreamingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/talking")
@RestController
@Slf4j
public class TalkingController {
    private final TranscribeStreamingService transcribeStreamingService;

    @PostMapping("transcribe")
    public ResponseEntity<String> transcribeFile(@RequestParam("file") MultipartFile file, @RequestParam("sessionId") String sessionId) {
        try {
            String transcriptionResult = transcribeStreamingService.transcribe(file, sessionId);
            System.out.println(transcriptionResult);
            return ResponseEntity.ok(transcriptionResult);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during transcription");
        }
    }


}
