package com.twitterclone.service;

import com.twitterclone.model.Message;
import com.twitterclone.model.User;
import com.twitterclone.repository.MessageRepository;
import com.twitterclone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Message> kafkaTemplate;

    public Message sendMessage(String senderId, String receiverId, String content, Set<String> mediaUrls) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setId(UUID.randomUUID().toString());
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setMediaUrls(mediaUrls);
        message.setCreatedAt(LocalDateTime.now());
        message.setIsRead(false);
        message.setConversationId(generateConversationId(senderId, receiverId));

        Message savedMessage = messageRepository.save(message);

        // Publish message to Kafka for real-time updates
        kafkaTemplate.send("twitter-messages", savedMessage);

        return savedMessage;
    }

    public Message createGroupMessage(String senderId, Set<String> participantIds, String groupName, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // Verify all participants exist
        for (String participantId : participantIds) {
            userRepository.findById(participantId)
                    .orElseThrow(() -> new RuntimeException("Participant not found: " + participantId));
        }

        Message message = new Message();
        message.setId(UUID.randomUUID().toString());
        message.setSenderId(senderId);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        message.setIsRead(false);
        message.setIsGroupMessage(true);
        message.setGroupName(groupName);
        message.setParticipants(participantIds);
        message.setConversationId(UUID.randomUUID().toString());

        Message savedMessage = messageRepository.save(message);

        // Publish message to Kafka for real-time updates
        kafkaTemplate.send("twitter-messages", savedMessage);

        return savedMessage;
    }

    public Page<Message> getConversation(String conversationId, Pageable pageable) {
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable);
    }

    public List<Message> getUnreadMessages(String userId) {
        return messageRepository.findByReceiverIdAndIsReadFalse(userId);
    }

    public void markAsRead(String messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        messageRepository.save(message);
    }

    public void markConversationAsRead(String conversationId, String userId) {
        List<Message> unreadMessages = messageRepository.findByConversationIdAndIsReadFalse(conversationId);
        for (Message message : unreadMessages) {
            if (message.getReceiverId().equals(userId)) {
                message.setIsRead(true);
            }
        }
        messageRepository.saveAll(unreadMessages);
    }

    private String generateConversationId(String userId1, String userId2) {
        // Ensure consistent conversation ID regardless of sender/receiver order
        return userId1.compareTo(userId2) < 0
                ? userId1 + "-" + userId2
                : userId2 + "-" + userId1;
    }
} 