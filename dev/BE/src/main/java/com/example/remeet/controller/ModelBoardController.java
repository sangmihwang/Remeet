package com.example.remeet.controller;

import com.example.remeet.dto.ModelBoardCreateDto;
import com.example.remeet.dto.ModelBoardDetailDto;
import com.example.remeet.dto.ModelBoardDto;
import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.service.ModelBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;


import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

@CrossOrigin(value = "*", allowedHeaders = "*")
@RequestMapping("/model")
@RestController
@Slf4j
public class ModelBoardController {
    private final ModelBoardService modelBoardService;

    public ModelBoardController(ModelBoardService modelBoardService) {
        this.modelBoardService = modelBoardService;
    }

    @GetMapping
    public ResponseEntity<List<ModelBoardDto>> getModelBoard(HttpServletRequest request, @RequestParam("option") String option){
        Integer userNo = (Integer)request.getAttribute("userNo");
        List<ModelBoardDto> modelBoardDtos = modelBoardService.findByOption(option, userNo);
        return ResponseEntity.ok(modelBoardDtos);
    }


    @GetMapping("/{modelNo}")
    public ResponseEntity<ModelBoardDetailDto> getModelBoardDetail(@PathVariable Integer modelNo){
        ModelBoardDetailDto modelBoardDetailDto = modelBoardService.getModelBoardDetailById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("모델넘버가 존재하지 않음: " + modelNo));

        return ResponseEntity.ok(modelBoardDetailDto);
    }
    @GetMapping("/video/{modelNo}")
    public ResponseEntity<List<String>> getVideoPathsByModelNo(@PathVariable Integer modelNo) {
        return ResponseEntity.ok(modelBoardService.getVideoPathsByModelNo(modelNo));
    }

    @GetMapping("/voice/{modelNo}")
    public ResponseEntity<List<String>> getVoicePathsByModelNo(@PathVariable Integer modelNo) {
        return ResponseEntity.ok(modelBoardService.getVoicePathsByModelNo(modelNo));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ModelBoardDetailDto> createModelBoard(
            @RequestParam("modelName") String modelName,
            @RequestParam("gender") char gender,
            @RequestParam("imagePath") List<MultipartFile> imagePath,
            @RequestParam("kakaoName") String kakaoName,
            @RequestParam("conversationText") MultipartFile conversationTextFile,
            @RequestParam("voiceFiles") List<MultipartFile> voiceFiles,
            @RequestParam("videoFiles") List<MultipartFile> videoFiles,
            HttpServletRequest request
    ) throws IOException {
        String conversationText = new String(conversationTextFile.getBytes(), StandardCharsets.UTF_8);

        ModelBoardCreateDto modelBoardCreateDto = new ModelBoardCreateDto(
                modelName, gender
        );

        Integer userNo = (Integer) request.getAttribute("userNo");
        Integer modelNo = modelBoardService.createModelBoard(modelBoardCreateDto, userNo, voiceFiles, videoFiles,imagePath, kakaoName, conversationText);

        ModelBoardDetailDto modelBoardDetailDto = modelBoardService.getModelBoardDetailById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("생성 후 오류가 있음"));

        
        return ResponseEntity.ok(modelBoardDetailDto);

    }

    @GetMapping("/makevoice/{modelNo}")
    public ResponseEntity<?> generateEleVoiceId(@PathVariable Integer modelNo) {
        try {
            String voiceId = modelBoardService.createVoiceModel(modelNo);
            return ResponseEntity.ok(Collections.singletonMap("ele_voice_id", voiceId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "음성 ID 생성 중 오류가 발생했습니다."));
        }
    }


}
