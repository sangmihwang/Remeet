package com.example.remeet.repository;

import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.entity.UploadedVoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadedVoiceRepository extends JpaRepository<UploadedVoiceEntity, Integer> {
    List<UploadedVoiceEntity> findByModelNo(ModelBoardEntity modelNo);
}
