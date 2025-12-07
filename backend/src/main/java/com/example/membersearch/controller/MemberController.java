
package com.example.membersearch.controller;

import com.example.membersearch.dto.SearchRequest;
import com.example.membersearch.model.Member;
import com.example.membersearch.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*") // Allow all for debugging
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private com.example.membersearch.service.AISearchService aiSearchService;

    @PostMapping("/search")
    public Page<Member> searchMembers(@RequestBody SearchRequest request) {
        // System.out.println("Received search request: " + request);
        Page<Member> result = memberService.searchMembers(request);
        // System.out.println("Search completed. Found " + result.getTotalElements() + "
        // elements.");
        return result;
    }

    @PostMapping("/search/ai")
    public Page<Member> aiSearch(@RequestBody String query) {
        SearchRequest request = aiSearchService.parseQuery(query);
        System.out.println("AI Parsed Query: " + request);
        return memberService.searchMembers(request);
    }

    @PutMapping("/{id}")
    public Member updateMember(@PathVariable Long id, @RequestBody Member member) {
        return memberService.updateMember(id, member);
    }
}
