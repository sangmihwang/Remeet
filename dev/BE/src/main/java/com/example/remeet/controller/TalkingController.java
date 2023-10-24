package com.example.remeet.controller;

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

     @PostMapping("stt")
    public ResponseEntity<Object> upload(@RequestPart(value = "file") MultipartFile multipartFile) throws Exception {
        List<String> imagePathList = uploadService.upload(multipartFile);
        return new ResponseEntity<Object>(imagePathList, HttpStatus.OK);
    }

}
