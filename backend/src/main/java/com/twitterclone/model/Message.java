package com.twitterclone.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@RedisHash("messages")
public class Message {
    @Id
    private String id;
    
    private String senderId;
    private String receiverId;
    private String content;
    private Set<String> mediaUrls = new HashSet<>();
    private LocalDateTime createdAt;
    private boolean isRead;
    private String conversationId;
    
    // For group messages
    private Set<String> participants = new HashSet<>();
    private boolean isGroupMessage;
    private String groupName;

    private boolean isPollActive;

    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }

    public void setIsGroupMessage(boolean isGroupMessage) {
        this.isGroupMessage = isGroupMessage;
    }

    public void setIsPollActive(boolean isPollActive) {
        this.isPollActive = isPollActive;
    }
} 