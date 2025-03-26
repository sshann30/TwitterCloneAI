package com.twitterclone.service;

import com.twitterclone.model.Message;
import com.twitterclone.model.Poll;
import com.twitterclone.model.User;
import com.twitterclone.repository.MessageRepository;
import com.twitterclone.repository.PollRepository;
import com.twitterclone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PollService {

    private final PollRepository pollRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Poll> kafkaTemplate;

    public Poll createPoll(String messageId, String question, Map<String, String> options, LocalDateTime endTime) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        Poll poll = new Poll();
        poll.setId(UUID.randomUUID().toString());
        poll.setMessageId(messageId);
        poll.setQuestion(question);
        poll.setEndTime(endTime);
        poll.setIsActive(true);
        poll.setCreatedAt(LocalDateTime.now());
        poll.setUpdatedAt(LocalDateTime.now());

        options.forEach(poll::addOption);
        Poll savedPoll = pollRepository.save(poll);

        // Update message to indicate it has a poll
        message.setIsPollActive(true);
        messageRepository.save(message);

        // Publish poll to Kafka for real-time updates
        kafkaTemplate.send("twitter-polls", savedPoll);

        return savedPoll;
    }

    public Poll vote(String pollId, String userId, String optionId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getIsActive()) {
            throw new RuntimeException("Poll is no longer active");
        }

        if (poll.getVotes().containsKey(userId)) {
            throw new RuntimeException("User has already voted");
        }

        poll.addVote(userId, optionId);
        poll.setUpdatedAt(LocalDateTime.now());
        Poll updatedPoll = pollRepository.save(poll);

        // Publish updated poll to Kafka
        kafkaTemplate.send("twitter-polls", updatedPoll);

        return updatedPoll;
    }

    public Poll removeVote(String pollId, String userId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getIsActive()) {
            throw new RuntimeException("Poll is no longer active");
        }

        poll.removeVote(userId);
        poll.setUpdatedAt(LocalDateTime.now());
        Poll updatedPoll = pollRepository.save(poll);

        // Publish updated poll to Kafka
        kafkaTemplate.send("twitter-polls", updatedPoll);

        return updatedPoll;
    }

    public Map<String, Object> getPollResults(String pollId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        Map<String, Object> results = new HashMap<>();
        results.put("question", poll.getQuestion());
        results.put("options", poll.getOptions());
        results.put("votes", poll.getVotes());
        results.put("results", poll.getResults());
        results.put("isActive", poll.getIsActive());
        results.put("endTime", poll.getEndTime());

        return results;
    }

    @Scheduled(fixedRate = 60000) // Check every minute
    public void checkExpiredPolls() {
        List<Poll> activePolls = pollRepository.findByIsActiveTrue();
        LocalDateTime now = LocalDateTime.now();

        for (Poll poll : activePolls) {
            if (now.isAfter(poll.getEndTime())) {
                poll.setIsActive(false);
                poll.setUpdatedAt(now);
                pollRepository.save(poll);

                // Publish expired poll to Kafka
                kafkaTemplate.send("twitter-polls", poll);
            }
        }
    }
} 