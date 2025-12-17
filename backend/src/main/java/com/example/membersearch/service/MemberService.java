package com.example.membersearch.service;

import com.example.membersearch.dto.SearchRequest;
import com.example.membersearch.exception.MemberNotFoundException;
import com.example.membersearch.model.Member;
import com.example.membersearch.repository.MemberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);

    @Autowired
    private MemberRepository memberRepository;

    public Page<Member> searchMembers(SearchRequest request) {
        logger.info(
                "Searching members with criteria: firstName={}, lastName={}, businessUnits={}, country={}, page={}, size={}",
                request.getFirstName(), request.getLastName(), request.getBusinessUnits(),
                request.getCountry(), request.getPage(), request.getSize());

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        Specification<Member> spec = memberRepository.buildSpecification(request);

        Page<Member> results = memberRepository.findAll(spec, pageable);

        logger.info("Search completed. Found {} total elements, returning page {} of {}",
                results.getTotalElements(), results.getNumber(), results.getTotalPages());

        return results;
    }

    public Member updateMember(Long id, Member memberDetails) {
        logger.info("Updating member with id: {}", id);

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException(id));

        String oldValues = String.format("Old values: firstName=%s, lastName=%s, businessUnit=%s, country=%s",
                member.getFirstName(), member.getLastName(), member.getBusinessUnit(), member.getCountry());

        member.setFirstName(memberDetails.getFirstName());
        member.setLastName(memberDetails.getLastName());
        member.setMiddleName(memberDetails.getMiddleName());
        member.setBusinessUnit(memberDetails.getBusinessUnit());
        member.setCountry(memberDetails.getCountry());
        member.setSourceMemberId(memberDetails.getSourceMemberId());
        // Entitlement is usually managed separately, but for now we allow updating if
        // needed
        // member.setEntitled(memberDetails.isEntitled());

        Member savedMember = memberRepository.save(member);

        logger.info("Member {} updated successfully. {}", id, oldValues);

        return savedMember;
    }
}
