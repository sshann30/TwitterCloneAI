package com.twitterclone.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@RedisHash("polls")
public class Poll {
    @Id
    private String id;
    
    private String messageId;
    private String question;
    private Map<String, String> options = new HashMap<>();
    private Map<String, String> votes = new HashMap<>();
    private LocalDateTime endTime;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public boolean getIsActive() {
        return isActive;
    }

    public void addOption(String optionId, String optionText) {
        options.put(optionId, optionText);
    }

    public void addVote(String userId, String optionId) {
        votes.put(userId, optionId);
    }

    public void removeVote(String userId) {
        votes.remove(userId);
    }

    public Map<String, Integer> getResults() {
        Map<String, Integer> results = new HashMap<>();
        options.keySet().forEach(optionId -> results.put(optionId, 0));
        votes.values().forEach(optionId -> results.merge(optionId, 1, Integer::sum));
        return results;
    }
} 