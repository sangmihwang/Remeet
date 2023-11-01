package com.example.remeet.controller;

import com.example.remeet.dto.ModelBoardCreateDto;
import com.example.remeet.dto.ModelBoardDetailDto;
import com.example.remeet.dto.ModelBoardDto;
import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.service.ModelBoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/model")
public class ModelBoardController {
    private final ModelBoardService modelBoardService;
    public ModelBoardController(ModelBoardService modelBoardService) {
        this.modelBoardService = modelBoardService;
    }
    @GetMapping
    public ResponseEntity<List<ModelBoardDto>> getModelBoard(@RequestParam("option") String option){
        List<ModelBoardDto> modelBoardDtos = modelBoardService.findByOption(option);
        return ResponseEntity.ok(modelBoardDtos);
    }

    @GetMapping("/{modelNo}")
    public ResponseEntity<ModelBoardDetailDto> getModelBoardDetail(@PathVariable Integer modelNo){
        ModelBoardDetailDto modelBoardDetailDto = modelBoardService.getModelBoardDetailById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("모델넘버가 존재하지 않음: " + modelNo));

        return ResponseEntity.ok(modelBoardDetailDto);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ModelBoardDetailDto> createModelBoard(
            @RequestParam("modelName") String modelName,
            @RequestParam("gender") char gender,
            @RequestParam("imagePath") String imagePath,
            @RequestParam("voiceId") String voiceId,
            @RequestParam("avatarId") String avatarId,
            @RequestParam("commonVideoPath") String commonVideoPath,
            @RequestParam("conversationText") String conversationText,
            @RequestParam("conversationCount") Integer conversationCount
    ) {
        ModelBoardCreateDto modelBoardCreateDto = new ModelBoardCreateDto(
                modelName, gender, imagePath, voiceId, avatarId,
                commonVideoPath, conversationText, conversationCount
        );
        Integer modelNo = modelBoardService.createModelBoard(modelBoardCreateDto);
        ModelBoardDetailDto modelBoardDetailDto = modelBoardService.getModelBoardDetailById(modelNo)
                .orElseThrow(() -> new IllegalArgumentException("생성 후 오류가 있음"));

        return ResponseEntity.ok(modelBoardDetailDto);

    }

}
