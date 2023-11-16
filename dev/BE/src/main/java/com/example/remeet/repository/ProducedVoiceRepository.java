package com.example.remeet.repository;

import com.example.remeet.dto.VideoDataDto;
import com.example.remeet.dto.VoiceDataDto;
import com.example.remeet.entity.ProducedVoiceEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProducedVoiceRepository extends JpaRepository<ProducedVoiceEntity, Integer> {

    @Query("SELECT new com.example.remeet.dto.VideoDataDto(" +
            "v.proVoiceNo, v.proVoiceName, v.voicePath, m.imagePath) " +
            "FROM ProducedVoiceEntity v " +
            "JOIN v.modelNo m " +
            "WHERE m.userNo.userNo = :userNo " +
            "ORDER BY v.createdTime DESC")
    List<VideoDataDto> findTopVoicesByUserNo(Integer userNo, Pageable pageable);

    @Query("SELECT new com.example.remeet.dto.VideoDataDto(" +
            "v.proVoiceNo, v.proVoiceName, v.voicePath, m.imagePath) " +
            "FROM ProducedVoiceEntity v " +
            "JOIN v.modelNo m " +
            "WHERE m.modelNo = :modelNo " +
            "ORDER BY v.createdTime DESC")
    List<VideoDataDto> findProducedVoiceByModelNo(Integer modelNo);

    Optional<ProducedVoiceEntity> findByProVoiceNo(Integer proVoiceNo);
}
