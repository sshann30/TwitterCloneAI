package com.twitterclone.controller;

import com.twitterclone.model.Message;
import com.twitterclone.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @AuthenticationPrincipal String userId,
            @RequestParam String receiverId,
            @RequestParam String content,
            @RequestParam(required = false) Set<String> mediaUrls) {
        return ResponseEntity.ok(messageService.sendMessage(userId, receiverId, content, mediaUrls));
    }

    @PostMapping("/group")
    public ResponseEntity<Message> createGroupMessage(
            @AuthenticationPrincipal String userId,
            @RequestParam Set<String> participantIds,
            @RequestParam String groupName,
            @RequestParam String content) {
        return ResponseEntity.ok(messageService.createGroupMessage(userId, participantIds, groupName, content));
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<Page<Message>> getConversation(
            @PathVariable String conversationId,
            Pageable pageable) {
        return ResponseEntity.ok(messageService.getConversation(conversationId, pageable));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Message>> getUnreadMessages(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(messageService.getUnreadMessages(userId));
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/conversation/{conversationId}/read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable String conversationId,
            @AuthenticationPrincipal String userId) {
        messageService.markConversationAsRead(conversationId, userId);
        return ResponseEntity.ok().build();
    }
} 