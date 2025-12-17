package com.example.membersearch.exception;

/**
 * Exception thrown when a search request contains invalid parameters.
 */
public class InvalidSearchRequestException extends RuntimeException {

    public InvalidSearchRequestException(String message) {
        super(message);
    }

    public InvalidSearchRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
