package com.example.remeet.repository;

import com.example.remeet.dto.VideoDataDto;
import com.example.remeet.entity.ProducedVideoEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProducedVideoRepository extends JpaRepository<ProducedVideoEntity, Integer> {
    @Query("SELECT new com.example.remeet.dto.VideoDataDto(" +
            "v.proVideoNo, v.proVideoName, v.videoPath, m.imagePath) " +
            "FROM ProducedVideoEntity v " +
            "JOIN v.modelNo m " +
            "WHERE m.userNo.userNo = :userNo " +
            "ORDER BY v.createdTime DESC")
    List<VideoDataDto> findTopVideosByUserNo(Integer userNo, Pageable pageable);

    @Query("SELECT new com.example.remeet.dto.VideoDataDto(" +
            "v.proVideoNo, v.proVideoName, v.videoPath, m.imagePath) " +
            "FROM ProducedVideoEntity v " +
            "JOIN v.modelNo m " +
            "WHERE m.modelNo = :modelNo " +
            "ORDER BY v.createdTime DESC")
    List<VideoDataDto> findProducedVideoByModelNo(Integer modelNo);

    Optional<ProducedVideoEntity> findByProVideoNo(Integer proVideoNo);


}
