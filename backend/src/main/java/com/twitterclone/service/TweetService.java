package com.twitterclone.service;

import com.twitterclone.model.Tweet;
import com.twitterclone.model.User;
import com.twitterclone.repository.TweetRepository;
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
public class TweetService {

    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Tweet> kafkaTemplate;

    public Tweet createTweet(String userId, String content, Set<String> mediaUrls) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tweet tweet = new Tweet();
        tweet.setId(UUID.randomUUID().toString());
        tweet.setUserId(userId);
        tweet.setContent(content);
        tweet.setMediaUrls(mediaUrls);
        tweet.setCreatedAt(LocalDateTime.now());
        tweet.setUpdatedAt(LocalDateTime.now());

        // Extract hashtags and mentions
        Set<String> hashtags = extractHashtags(content);
        Set<String> mentions = extractMentions(content);
        tweet.setHashtags(hashtags);
        tweet.setMentions(mentions);

        Tweet savedTweet = tweetRepository.save(tweet);

        // Publish tweet to Kafka for real-time updates
        kafkaTemplate.send("twitter-tweets", savedTweet);

        return savedTweet;
    }

    public Tweet replyToTweet(String userId, String tweetId, String content) {
        Tweet parentTweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new RuntimeException("Tweet not found"));

        Tweet reply = createTweet(userId, content, new HashSet<>());
        reply.setReplyToTweetId(tweetId);
        reply.setIsReply(true);

        // Update parent tweet's reply count
        parentTweet.setReplyCount(parentTweet.getReplyCount() + 1);
        parentTweet.getReplies().add(reply.getId());
        tweetRepository.save(parentTweet);

        return tweetRepository.save(reply);
    }

    public Tweet retweet(String userId, String tweetId) {
        Tweet originalTweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new RuntimeException("Tweet not found"));

        Tweet retweet = new Tweet();
        retweet.setId(UUID.randomUUID().toString());
        retweet.setUserId(userId);
        retweet.setRetweetFromTweetId(tweetId);
        retweet.setIsRetweet(true);
        retweet.setCreatedAt(LocalDateTime.now());
        retweet.setUpdatedAt(LocalDateTime.now());

        // Update original tweet's retweet count
        originalTweet.setRetweetCount(originalTweet.getRetweetCount() + 1);
        originalTweet.getRetweetedBy().add(userId);
        tweetRepository.save(originalTweet);

        return tweetRepository.save(retweet);
    }

    public void likeTweet(String userId, String tweetId) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new RuntimeException("Tweet not found"));

        tweet.getLikedBy().add(userId);
        tweet.setLikeCount(tweet.getLikeCount() + 1);
        tweetRepository.save(tweet);
    }

    public void unlikeTweet(String userId, String tweetId) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new RuntimeException("Tweet not found"));

        tweet.getLikedBy().remove(userId);
        tweet.setLikeCount(tweet.getLikeCount() - 1);
        tweetRepository.save(tweet);
    }

    public Page<Tweet> getUserTweets(String userId, Pageable pageable) {
        return tweetRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Page<Tweet> getHomeTimeline(String userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> following = user.getFollowing();
        following.add(userId); // Include user's own tweets
        return tweetRepository.findByUserIdInOrderByCreatedAtDesc(
                following.stream().toList(), pageable);
    }

    public List<Tweet> getTweetReplies(String tweetId) {
        return tweetRepository.findByReplyToTweetId(tweetId);
    }

    public List<Tweet> getTweetRetweets(String tweetId) {
        return tweetRepository.findByRetweetFromTweetId(tweetId);
    }

    public List<Tweet> searchByHashtag(String hashtag) {
        return tweetRepository.findByHashtagsContaining(hashtag);
    }

    public List<Tweet> searchByMention(String username) {
        return tweetRepository.findByMentionsContaining(username);
    }

    private Set<String> extractHashtags(String content) {
        Set<String> hashtags = new HashSet<>();
        String[] words = content.split("\\s+");
        for (String word : words) {
            if (word.startsWith("#")) {
                hashtags.add(word.substring(1).toLowerCase());
            }
        }
        return hashtags;
    }

    private Set<String> extractMentions(String content) {
        Set<String> mentions = new HashSet<>();
        String[] words = content.split("\\s+");
        for (String word : words) {
            if (word.startsWith("@")) {
                mentions.add(word.substring(1).toLowerCase());
            }
        }
        return mentions;
    }
} 