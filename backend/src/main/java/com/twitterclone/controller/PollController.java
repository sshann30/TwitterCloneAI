package com.twitterclone.controller;

import com.twitterclone.model.Poll;
import com.twitterclone.service.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/polls")
@RequiredArgsConstructor
public class PollController {

    private final PollService pollService;

    @PostMapping("/create")
    public ResponseEntity<Poll> createPoll(
            @AuthenticationPrincipal String userId,
            @RequestParam String messageId,
            @RequestParam String question,
            @RequestBody Map<String, String> options,
            @RequestParam LocalDateTime endTime) {
        return ResponseEntity.ok(pollService.createPoll(messageId, question, options, endTime));
    }

    @PostMapping("/{pollId}/vote")
    public ResponseEntity<Poll> vote(
            @AuthenticationPrincipal String userId,
            @PathVariable String pollId,
            @RequestParam String optionId) {
        return ResponseEntity.ok(pollService.vote(pollId, userId, optionId));
    }

    @DeleteMapping("/{pollId}/vote")
    public ResponseEntity<Poll> removeVote(
            @AuthenticationPrincipal String userId,
            @PathVariable String pollId) {
        return ResponseEntity.ok(pollService.removeVote(pollId, userId));
    }

    @GetMapping("/{pollId}/results")
    public ResponseEntity<Map<String, Object>> getPollResults(@PathVariable String pollId) {
        return ResponseEntity.ok(pollService.getPollResults(pollId));
    }
} 