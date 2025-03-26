package com.twitterclone.repository;

import com.twitterclone.model.Tweet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TweetRepository extends CrudRepository<Tweet, String> {
    Page<Tweet> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    Page<Tweet> findByUserIdInOrderByCreatedAtDesc(List<String> userIds, Pageable pageable);
    List<Tweet> findByReplyToTweetId(String tweetId);
    List<Tweet> findByRetweetFromTweetId(String tweetId);
    List<Tweet> findByHashtagsContaining(String hashtag);
    List<Tweet> findByMentionsContaining(String username);
} 