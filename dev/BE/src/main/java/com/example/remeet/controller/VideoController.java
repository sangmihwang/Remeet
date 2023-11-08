package com.example.remeet.controller;

import com.example.remeet.dto.VideoDataDto;
import com.example.remeet.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(value = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/video")
@RestController
@Slf4j
public class VideoController {
    private final VideoService videoService;

    @GetMapping("recent")
    public ResponseEntity<List<VideoDataDto>> recentProducedVideo(HttpServletRequest request) {
        log.info("request to /api/v1/video/recent [Method: GET]");
        Integer userNo = (Integer)request.getAttribute("userNo");
        List<VideoDataDto> recentVideos = videoService.recentProducedVideo(userNo);
        return ResponseEntity.ok(recentVideos);
    }

    @GetMapping("{modelNo}")
    public ResponseEntity<List<VideoDataDto>> allProducedVideoByModel(@PathVariable("modelNo") Integer modelNo) {
        log.info("request to /api/v1/video/"+modelNo+" [Method: POST]");
        List<VideoDataDto> videoList = videoService.allProducedVideoByModel(modelNo);
        return ResponseEntity.ok(videoList);
    }

    @DeleteMapping("{proVideoNo}")
    public ResponseEntity deleteProducedVideo(HttpServletRequest request, @PathVariable("proVideoNo") Integer proVideoNo) {
        log.info("request to /api/v1/video/"+proVideoNo+" [Method: DELETE]");
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
                log.info("내가 만든 영상이 아닙니다.");
                return ResponseEntity.status(403).build();
            }
        } else {
            // 영상이 없을때
            log.info("해당 영상이 없습니다.");
            return ResponseEntity.status(404).build();
        }
    }
}
