package com.example.remeet.controller;

import com.example.remeet.dto.VideoDataDto;
import com.example.remeet.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/video")
@RestController
@Slf4j
public class VideoController {
    private final VideoService videoService;

    @GetMapping("recent")
    public ResponseEntity<Map<String, Object>> recentProducedVideo(HttpServletRequest request) {
        Integer userNo = (Integer)request.getAttribute("userNo");
        List<VideoDataDto> recentVideos = videoService.recentProducedVideo(userNo);
        Map<String, Object> response = new HashMap<>();
        response.put("data", recentVideos);
        return ResponseEntity.ok(response);
    }

    @GetMapping("{modelNo}")
    public ResponseEntity<Map<String, Object>> allProducedVideoByModel(@PathVariable("modelNo") Integer modelNo) {
        List<VideoDataDto> videoList = videoService.allProducedVideoByModel(modelNo);
        Map<String, Object> response = new HashMap<>();
        response.put("data", videoList);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{proVideoNo}")
    public ResponseEntity deleteProducedVideo(HttpServletRequest request, @PathVariable("proVideoNo") Integer proVideoNo) {
        Integer userNo = (Integer)request.getAttribute("userNo");
        Boolean checkVideo = videoService.checkProducedVideo(proVideoNo);
        // 영상이 있는지 여부 확인
        if (checkVideo) {
            // 있으면 지울수 있는지 확인
            Boolean deleteVideo = videoService.deleteProducedVideo(userNo, proVideoNo);
            if (deleteVideo) {
                // 내가 저장한 것이 맞을 때 삭제완료
                return ResponseEntity.ok().build();
            } else {
                // 내가 저장한 것이 아닐떄 403 반환
                return ResponseEntity.status(403).build();
            }
        } else {
            // 영상이 없을때
            return ResponseEntity.status(404).build();
        }
    }
}
