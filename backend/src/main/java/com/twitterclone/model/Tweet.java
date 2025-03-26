package com.twitterclone.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@RedisHash("tweets")
public class Tweet {
    @Id
    private String id;
    
    private String userId;
    private String content;
    private Set<String> mediaUrls = new HashSet<>();
    private Set<String> hashtags = new HashSet<>();
    private Set<String> mentions = new HashSet<>();
    private String replyToTweetId;
    private String retweetFromTweetId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<String> likedBy = new HashSet<>();
    private Set<String> retweetedBy = new HashSet<>();
    private Set<String> replies = new HashSet<>();
    private int quoteCount;
    private int replyCount;
    private int retweetCount;
    private int likeCount;
    private boolean isRetweet;
    private boolean isQuoteTweet;
    private boolean isReply;
    private boolean isPinned;
    private boolean isSensitive;
    private String language;
    private String location;
    private Set<String> pollOptions;
    private LocalDateTime pollEndTime;
    private boolean isPollActive;

    public void setIsRetweet(boolean isRetweet) {
        this.isRetweet = isRetweet;
    }

    public void setIsReply(boolean isReply) {
        this.isReply = isReply;
    }
} 