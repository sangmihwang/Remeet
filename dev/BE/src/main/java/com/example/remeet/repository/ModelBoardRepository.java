package com.example.remeet.repository;

import com.example.remeet.dto.ModelBoardDto;
import com.example.remeet.entity.ModelBoardEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelBoardRepository extends JpaRepository<ModelBoardEntity, Integer> {
    @Query("SELECT new com.example.remeet.dto.ModelBoardDto(" +
            "m.modelNo, m.modelName, m.imagePath) " +
            "FROM ModelBoardEntity m " +
            "WHERE m.userNo.userNo = :userNo " +
            "ORDER BY m.conversationCount DESC")
    List<ModelBoardDto> findTopModelsByUserNo(Integer userNo, Pageable pageable);

    @Query("SELECT new com.example.remeet.dto.ModelBoardDto(" +
            "m.modelNo, m.modelName, m.imagePath) " +
            "FROM ModelBoardEntity m " +
            "WHERE m.userNo.userNo = :userNo " +
            "ORDER BY m.latestConversationTime DESC")
    List<ModelBoardDto> findMostRecentByUserNo(Integer userNo, Pageable pageable);

    @Query("SELECT new com.example.remeet.dto.ModelBoardDto(" +
            "m.modelNo, m.modelName, m.imagePath) " +
            "FROM ModelBoardEntity m " +
            "WHERE m.userNo.userNo = :userNo ")
    List<ModelBoardDto> findByUserNo(Integer userNo);

    Optional<ModelBoardEntity> findByModelNo(Integer modelNo);
}

