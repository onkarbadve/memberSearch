package com.example.membersearch.service;

import com.example.membersearch.dto.SearchRequest;
import com.example.membersearch.exception.MemberNotFoundException;
import com.example.membersearch.model.Member;
import com.example.membersearch.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private MemberService memberService;

    private Member testMember;

    @BeforeEach
    void setUp() {
        testMember = new Member();
        testMember.setId(1L);
        testMember.setFirstName("John");
        testMember.setLastName("Doe");
        testMember.setBusinessUnit("IT");
        testMember.setCountry("USA");
    }

    @Test
    void searchMembers_WithValidRequest_ReturnsPageOfMembers() {
        // Arrange
        SearchRequest request = new SearchRequest();
        request.setPage(0);
        request.setSize(10);

        List<Member> members = Arrays.asList(testMember);
        Page<Member> page = new PageImpl<>(members, PageRequest.of(0, 10), 1);

        when(memberRepository.findAll(any(Specification.class), any(PageRequest.class)))
                .thenReturn(page);

        // Act
        Page<Member> result = memberService.searchMembers(request);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("John", result.getContent().get(0).getFirstName());
        verify(memberRepository).findAll(any(Specification.class), any(PageRequest.class));
    }

    @Test
    void searchMembers_WithFirstNameFilter_ReturnsFilteredResults() {
        // Arrange
        SearchRequest request = new SearchRequest();
        request.setFirstName("John");
        request.setPage(0);
        request.setSize(10);

        List<Member> members = Arrays.asList(testMember);
        Page<Member> page = new PageImpl<>(members, PageRequest.of(0, 10), 1);

        when(memberRepository.findAll(any(Specification.class), any(PageRequest.class)))
                .thenReturn(page);

        // Act
        Page<Member> result = memberService.searchMembers(request);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(memberRepository).findAll(any(Specification.class), any(PageRequest.class));
    }

    @Test
    void updateMember_WithValidId_ReturnsUpdatedMember() {
        // Arrange
        Long memberId = 1L;
        Member updatedData = new Member();
        updatedData.setFirstName("Jane");
        updatedData.setLastName("Smith");
        updatedData.setBusinessUnit("HR");

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(testMember));
        when(memberRepository.save(any(Member.class))).thenReturn(testMember);

        // Act
        Member result = memberService.updateMember(memberId, updatedData);

        // Assert
        assertNotNull(result);
        verify(memberRepository).findById(memberId);
        verify(memberRepository).save(testMember);
    }

    @Test
    void updateMember_WithInvalidId_ThrowsException() {
        // Arrange
        Long memberId = 999L;
        Member updatedData = new Member();

        when(memberRepository.findById(memberId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MemberNotFoundException.class, () -> {
            memberService.updateMember(memberId, updatedData);
        });

        verify(memberRepository).findById(memberId);
        verify(memberRepository, never()).save(any(Member.class));
    }

    @Test
    void searchMembers_WithPagination_ReturnsCorrectPage() {
        // Arrange
        SearchRequest request = new SearchRequest();
        request.setPage(1);
        request.setSize(5);

        List<Member> members = Arrays.asList(testMember);
        Page<Member> page = new PageImpl<>(members, PageRequest.of(1, 5), 10);

        when(memberRepository.findAll(any(Specification.class), any(PageRequest.class)))
                .thenReturn(page);

        // Act
        Page<Member> result = memberService.searchMembers(request);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getNumber());
        assertEquals(5, result.getSize());
        verify(memberRepository).findAll(any(Specification.class), any(PageRequest.class));
    }
}
