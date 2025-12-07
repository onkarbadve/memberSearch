package com.example.membersearch.service;

import com.example.membersearch.dto.SearchRequest;
import com.example.membersearch.model.Member;
import com.example.membersearch.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public Page<Member> searchMembers(SearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        Specification<Member> spec = memberRepository.buildSpecification(request);

        return memberRepository.findAll(spec, pageable);
    }
}
