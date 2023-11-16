package com.example.remeet.repository;

import com.example.remeet.entity.ModelBoardEntity;
import com.example.remeet.entity.UploadedVideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadedVideoRepository extends JpaRepository<UploadedVideoEntity, Integer> {
    List<UploadedVideoEntity> findByModelNo(ModelBoardEntity modelNo);
}
