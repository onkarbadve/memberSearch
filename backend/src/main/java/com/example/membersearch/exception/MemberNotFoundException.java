package com.example.membersearch.exception;

/**
 * Exception thrown when a member is not found by ID.
 */
public class MemberNotFoundException extends RuntimeException {

    public MemberNotFoundException(Long id) {
        super("Member not found with id: " + id);
    }

    public MemberNotFoundException(String message) {
        super(message);
    }
}
