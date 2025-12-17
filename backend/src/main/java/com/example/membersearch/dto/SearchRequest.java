package com.example.membersearch.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class SearchRequest {
    private String firstName;
    private String middleName;
    private String lastName;
    private java.util.List<String> businessUnits;
    private String country;
    private String sourceMemberId;

    @Min(value = 0, message = "Page number must be non-negative")
    private int page = 0;

    @Min(value = 1, message = "Page size must be at least 1")
    @Max(value = 100, message = "Page size must not exceed 100")
    private int size = 10;
}
