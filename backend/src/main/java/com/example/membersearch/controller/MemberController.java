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

    @PostMapping("/search")
    public Page<Member> search(@RequestBody SearchRequest request) {
        System.out.println("Received search request: " + request);
        Page<Member> result = memberService.searchMembers(request);
        System.out.println("Search completed. Found: " + result.getTotalElements());
        return result;
    }
}
