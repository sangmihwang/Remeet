package com.example.remeet.controller;

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
        List<ModelBoardDto> modelBoardDtos= modelBoardService.findByOption(option);
        return ResponseEntity.ok(modelBoardDtos);
    }

}
