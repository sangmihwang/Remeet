package com.example.remeet.repository;

import com.example.remeet.entity.ModelBoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModelRepository extends JpaRepository<ModelBoardEntity, Integer> {

}
