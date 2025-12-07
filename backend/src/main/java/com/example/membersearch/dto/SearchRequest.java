package com.example.membersearch.dto;

import lombok.Data;

@Data
public class SearchRequest {
    private String firstName;
    private String middleName;
    private String lastName;
    private String businessUnit;
    private String country;
    private String sourceMemberId;
    
    private int page = 0;
    private int size = 10;
}
