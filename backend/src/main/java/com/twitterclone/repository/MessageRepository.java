package com.twitterclone.repository;

import com.twitterclone.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends CrudRepository<Message, String> {
    Page<Message> findByConversationIdOrderByCreatedAtDesc(String conversationId, Pageable pageable);
    List<Message> findBySenderIdAndReceiverIdOrderByCreatedAtDesc(String senderId, String receiverId);
    List<Message> findByConversationIdAndIsReadFalse(String conversationId);
    List<Message> findByReceiverIdAndIsReadFalse(String receiverId);
} 