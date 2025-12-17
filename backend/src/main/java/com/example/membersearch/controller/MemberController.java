
package com.example.membersearch.controller;

import com.example.membersearch.dto.SearchRequest;
import com.example.membersearch.model.Member;
import com.example.membersearch.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/members")
@Tag(name = "Member Management", description = "APIs for searching and managing members")
public class MemberController {

    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

    @Autowired
    private MemberService memberService;

    @Autowired
    private com.example.membersearch.service.AISearchService aiSearchService;

    @PostMapping("/search")
    @Operation(summary = "Search members", description = "Search members using structured criteria with pagination")
    public Page<Member> searchMembers(@Valid @RequestBody SearchRequest request) {
        logger.debug("Received search request: {}", request);
        Page<Member> result = memberService.searchMembers(request);
        return result;
    }

    @PostMapping("/search/ai")
    @Operation(summary = "AI-powered search", description = "Search members using natural language query")
    public Page<Member> aiSearch(@RequestBody String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.info("AI search query received: {}", query);
        SearchRequest request = aiSearchService.parseQuery(query);
        // Override with requested pagination
        request.setPage(page);
        request.setSize(size);
        logger.debug("AI Parsed Query: {}", request);
        return memberService.searchMembers(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update member", description = "Update an existing member by ID")
    public Member updateMember(@PathVariable Long id, @Valid @RequestBody Member member) {
        logger.debug("Update request for member id: {}", id);
        return memberService.updateMember(id, member);
    }
}
