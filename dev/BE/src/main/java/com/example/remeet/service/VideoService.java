package com.example.remeet.service;

import com.example.remeet.dto.VideoDataDto;
import com.example.remeet.repository.ModelBoardRepository;
import com.example.remeet.repository.ProducedVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final ProducedVideoRepository producedVideoRepository;

    public List<VideoDataDto> recentProducedVideo(Integer userNo) {
        List<VideoDataDto> recentVideo = producedVideoRepository.findTopVideosByUserNo(userNo, PageRequest.of(0, 10));
        return recentVideo;
    }

    public List<VideoDataDto> allProducedVideoByModel(Integer modelNo) {
        List<VideoDataDto> recentVideo = producedVideoRepository.findProducedVideoByModelNo(modelNo);
        return recentVideo;
    }

    public Boolean checkProducedVideo(Integer proVideoNo){
        return producedVideoRepository.findByProVideoNo(proVideoNo).isPresent();
    }

    public Boolean deleteProducedVideo(Integer userNo, Integer proVideoNo) {
        Integer videoUserNo = producedVideoRepository.findByProVideoNo(proVideoNo).get().getModelNo().getUserNo().getUserNo();
        if (videoUserNo.equals(userNo)) {
            producedVideoRepository.deleteById(proVideoNo);
            return true;
        } else {
            return false;
        }
    }
}
