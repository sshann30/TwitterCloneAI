package com.twitterclone.repository;

import com.twitterclone.model.Poll;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollRepository extends CrudRepository<Poll, String> {
    List<Poll> findByMessageId(String messageId);
    List<Poll> findByIsActiveTrue();
} 