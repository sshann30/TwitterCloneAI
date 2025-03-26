package com.twitterclone.controller;

import com.twitterclone.model.Tweet;
import com.twitterclone.service.TweetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/tweets")
@RequiredArgsConstructor
public class TweetController {

    private final TweetService tweetService;

    @PostMapping
    public ResponseEntity<Tweet> createTweet(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Tweet tweet) {
        return ResponseEntity.ok(tweetService.createTweet(
                userDetails.getUsername(),
                tweet.getContent(),
                tweet.getMediaUrls()));
    }

    @PostMapping("/{tweetId}/reply")
    public ResponseEntity<Tweet> replyToTweet(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String tweetId,
            @RequestBody Tweet reply) {
        return ResponseEntity.ok(tweetService.replyToTweet(
                userDetails.getUsername(),
                tweetId,
                reply.getContent()));
    }

    @PostMapping("/{tweetId}/retweet")
    public ResponseEntity<Tweet> retweet(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String tweetId) {
        return ResponseEntity.ok(tweetService.retweet(
                userDetails.getUsername(),
                tweetId));
    }

    @PostMapping("/{tweetId}/like")
    public ResponseEntity<Void> likeTweet(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String tweetId) {
        tweetService.likeTweet(userDetails.getUsername(), tweetId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{tweetId}/like")
    public ResponseEntity<Void> unlikeTweet(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String tweetId) {
        tweetService.unlikeTweet(userDetails.getUsername(), tweetId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Tweet>> getUserTweets(
            @PathVariable String userId,
            Pageable pageable) {
        return ResponseEntity.ok(tweetService.getUserTweets(userId, pageable));
    }

    @GetMapping("/timeline")
    public ResponseEntity<Page<Tweet>> getHomeTimeline(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        return ResponseEntity.ok(tweetService.getHomeTimeline(
                userDetails.getUsername(),
                pageable));
    }

    @GetMapping("/{tweetId}/replies")
    public ResponseEntity<List<Tweet>> getTweetReplies(
            @PathVariable String tweetId) {
        return ResponseEntity.ok(tweetService.getTweetReplies(tweetId));
    }

    @GetMapping("/{tweetId}/retweets")
    public ResponseEntity<List<Tweet>> getTweetRetweets(
            @PathVariable String tweetId) {
        return ResponseEntity.ok(tweetService.getTweetRetweets(tweetId));
    }

    @GetMapping("/search/hashtag/{hashtag}")
    public ResponseEntity<List<Tweet>> searchByHashtag(
            @PathVariable String hashtag) {
        return ResponseEntity.ok(tweetService.searchByHashtag(hashtag));
    }

    @GetMapping("/search/mention/{username}")
    public ResponseEntity<List<Tweet>> searchByMention(
            @PathVariable String username) {
        return ResponseEntity.ok(tweetService.searchByMention(username));
    }
} 