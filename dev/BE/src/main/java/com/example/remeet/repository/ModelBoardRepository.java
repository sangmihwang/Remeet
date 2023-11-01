package com.example.remeet.repository;

import com.example.remeet.entity.ModelBoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModelBoardRepository extends JpaRepository<ModelBoardEntity, Integer> {

}

