package com.example.membersearch.service;

import com.example.membersearch.dto.SearchRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AISearchService {

    private static final List<String> KNOWN_BUSINESS_UNITS = Arrays.asList("IT", "HR", "Admin", "Sales", "Finance",
            "Legal");
    private static final List<String> KNOWN_COUNTRIES = Arrays.asList("India", "USA", "US", "UK", "Canada", "Germany",
            "Japan");

    public SearchRequest parseQuery(String query) {
        SearchRequest request = new SearchRequest();
        String lowerQuery = query.toLowerCase();

        // 1. Extract Business Units
        List<String> foundBus = new ArrayList<>();
        for (String bu : KNOWN_BUSINESS_UNITS) {
            // Check for exact word matches to avoid partial matches
            if (containsWord(lowerQuery, bu.toLowerCase())) {
                foundBus.add(bu);
            }
        }
        if (!foundBus.isEmpty()) {
            request.setBusinessUnits(foundBus);
        }

        // 2. Extract Country
        // Simple heuristic: First found country wins
        for (String country : KNOWN_COUNTRIES) {
            if (containsWord(lowerQuery, country.toLowerCase())) {
                // Normalize US -> USA if needed, or just use detected string
                request.setCountry(country);
                break;
            }
        }

        // 3. Extract Potential Names (First Name)
        // Heuristic: Look for capitalized words that are NOT BUs or Countries or common
        // stopwords.
        // This is a naive implementation but works for "John in IT".
        String[] words = query.split("\\s+");
        for (String word : words) {
            if (Character.isUpperCase(word.charAt(0)) && word.length() > 2) {
                // Filter out known BUs and Countries
                if (!isKnownTerm(word)) {
                    // Check if it's likely a name (not a stopword like 'Find', 'Show', 'All')
                    if (!isCommonStopWord(word)) {
                        // Assume first found extraction is the first name
                        if (request.getFirstName() == null) {
                            request.setFirstName(word);
                        } else if (request.getLastName() == null) {
                            // If we already have a first name, assume next is last name
                            request.setLastName(word);
                        }
                    }
                }
            }
        }

        // Default pagination
        request.setPage(0);
        request.setSize(10);

        return request;
    }

    private boolean containsWord(String text, String word) {
        String regex = ".*\\b" + Pattern.quote(word) + "\\b.*";
        return text.matches(regex);
    }

    private boolean isKnownTerm(String word) {
        return KNOWN_BUSINESS_UNITS.stream().anyMatch(bu -> bu.equalsIgnoreCase(word)) ||
                KNOWN_COUNTRIES.stream().anyMatch(c -> c.equalsIgnoreCase(word));
    }

    private boolean isCommonStopWord(String word) {
        List<String> stopWords = Arrays.asList("Find", "Search", "Show", "Get", "List", "All", "Members", "People",
                "Employees", "Who", "Are", "In", "The", "Living", "Working");
        return stopWords.stream().anyMatch(s -> s.equalsIgnoreCase(word));
    }
}
