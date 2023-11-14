package com.example.remeet.controller;

import com.example.remeet.dto.*;
import com.example.remeet.service.FlaskService;
import com.example.remeet.service.ModelBoardService;
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

    public ModelBoardController(ModelBoardService modelBoardService, FlaskService flaskService) {
        this.modelBoardService = modelBoardService;
    }

    @GetMapping
    public ResponseEntity<List<ModelBoardDto>> getModelBoard(HttpServletRequest request, @RequestParam("option") String option){
        log.info("request to /api/v1/model [Method: GET]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        List<ModelBoardDto> modelBoardDtos = modelBoardService.findByOption(option, userNo);
        return ResponseEntity.ok(modelBoardDtos);
    }


    @GetMapping("/{modelNo}")
    public ResponseEntity<ModelBoardDetailDto> getModelBoardDetail(@PathVariable Integer modelNo){
        log.info("request to /api/v1/model/"+modelNo+" [Method: GET]");
        ModelBoardDetailDto modelBoardDetailDto = modelBoardService.getModelBoardDetailById(modelNo)
                .orElseThrow(() ->{
                            log.info("모델넘버가 존재하지 않음: " + modelNo);
                            return new IllegalArgumentException("모델넘버가 존재하지 않음: " + modelNo);
                        }
                );
        return ResponseEntity.ok(modelBoardDetailDto);
    }

    @GetMapping("/video/{modelNo}")
    public ResponseEntity<List<String>> getVideoPathsByModelNo(@PathVariable Integer modelNo) {
        log.info("request to /api/v1/model/video/"+modelNo+" [Method: GET]");
        return ResponseEntity.ok(modelBoardService.getVideoPathsByModelNo(modelNo));
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
        log.info("request to /api/v1/model [Method: POST]");
        String conversationText = new String(conversationTextFile.getBytes(), StandardCharsets.UTF_8);

        ModelBoardCreateDto modelBoardCreateDto = new ModelBoardCreateDto(
                modelName, gender
        );

        Integer userNo = (Integer) request.getAttribute("userNo");
        Integer modelNo = modelBoardService.createModelBoard(modelBoardCreateDto, userNo, voiceFiles, videoFiles,imagePath, kakaoName, conversationText);

        ModelBoardDetailDto modelBoardDetailDto = modelBoardService.getModelBoardDetailById(modelNo)
                .orElseThrow(() ->{
                        log.info("생성 후 오류가 있음");
                        return new IllegalArgumentException("생성 후 오류가 있음");
                        }
                );
        
        return ResponseEntity.ok(modelBoardDetailDto);
    }

    @GetMapping("/makevoice/{modelNo}")
    public ResponseEntity<?> generateEleVoiceId(@PathVariable Integer modelNo) {
        log.info("request to /api/v1/model/makevoice/"+modelNo+" [Method: GET]");
        try {
            String voiceId = modelBoardService.createVoiceModel(modelNo);
            return ResponseEntity.ok(Collections.singletonMap("ele_voice_id", voiceId));
        } catch (Exception e) {
            log.info("음성 ID 생성 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "음성 ID 생성 중 오류가 발생했습니다."));
        }
    }

    @DeleteMapping("{modelNo}")
    public ResponseEntity getVoicePathsByModelNo(@PathVariable Integer modelNo) {
        log.info("request to /api/v1/model/"+modelNo+" [Method: DELETE]");
        modelBoardService.deleteModelBoard(modelNo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("check-model")
    public ResponseEntity<List<NeedUpdateModelDto>> getNeedUpdate() {
        log.info("request to /api/v1/model/check-model [Method: GET]");
        List<NeedUpdateModelDto> getNeedUpdateList = modelBoardService.getNeedUpdateList();
        return ResponseEntity.ok(getNeedUpdateList);
    }

    @PostMapping("update-heyId")
    public ResponseEntity updateHeyVoiceId(@RequestBody NeedUpdateModelDto needUpdateModelDto) throws IOException {
        log.info("request to /api/v1/model/update-heyId [Method: POST]");
        modelBoardService.updateHeyVoiceId(needUpdateModelDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("create-common")
    public ResponseEntity<CommonVideoDto> createCommonVideo(@RequestBody NeedUpdateModelDto needUpdateModelDto) throws IOException {
        log.info("request to /api/v1/model/create-common [Method: POST]");
        CommonVideoDto transcriptionResult = modelBoardService.createCommonVideo(needUpdateModelDto);
        return ResponseEntity.ok(transcriptionResult);
    }
}
