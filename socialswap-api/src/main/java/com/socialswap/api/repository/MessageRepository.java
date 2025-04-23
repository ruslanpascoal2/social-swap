package com.socialswap.api.repository;

import com.socialswap.api.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByToUserIdOrderByCreatedAtDesc(Long userId);
    List<Message> findByFromUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Message> findByToUserIdAndReadFalse(Long userId);
}