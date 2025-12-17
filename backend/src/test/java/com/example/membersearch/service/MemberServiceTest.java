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
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private MemberService memberService;

    private Member testMember;
    private SearchRequest searchRequest;

    @BeforeEach
    void setUp() {
        testMember = new Member(1L, "John", "A", "Doe", "Engineering", "USA", "M001", true);
        searchRequest = new SearchRequest();
        searchRequest.setPage(0);
        searchRequest.setSize(10);
    }

    @Test
    void searchMembers_WithValidRequest_ReturnsPageOfMembers() {
        // Arrange
        List<Member> members = Arrays.asList(testMember);
        Page<Member> expectedPage = new PageImpl<>(members, PageRequest.of(0, 10), 1);

        when(memberRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<Member> result = memberService.searchMembers(searchRequest);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());
        verify(memberRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void searchMembers_WithFirstNameFilter_ReturnsFilteredResults() {
        // Arrange
        searchRequest.setFirstName("John");
        List<Member> members = Arrays.asList(testMember);
        Page<Member> expectedPage = new PageImpl<>(members, PageRequest.of(0, 10), 1);

        when(memberRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<Member> result = memberService.searchMembers(searchRequest);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("John", result.getContent().get(0).getFirstName());
    }

    @Test
    void updateMember_WithValidId_UpdatesAndReturnsMember() {
        // Arrange
        Long memberId = 1L;
        Member existingMember = new Member(1L, "John", "A", "Doe", "Engineering", "USA", "M001", true);
        Member updatedDetails = new Member(null, "Jane", "B", "Smith", "Sales", "UK", "M002", true);
        Member savedMember = new Member(1L, "Jane", "B", "Smith", "Sales", "UK", "M002", true);

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(existingMember));
        when(memberRepository.save(any(Member.class))).thenReturn(savedMember);

        // Act
        Member result = memberService.updateMember(memberId, updatedDetails);

        // Assert
        assertNotNull(result);
        assertEquals("Jane", result.getFirstName());
        assertEquals("Smith", result.getLastName());
        assertEquals("Sales", result.getBusinessUnit());
        assertEquals("UK", result.getCountry());
        verify(memberRepository, times(1)).findById(memberId);
        verify(memberRepository, times(1)).save(any(Member.class));
    }

    @Test
    void updateMember_WithInvalidId_ThrowsMemberNotFoundException() {
        // Arrange
        Long invalidId = 999L;
        Member updatedDetails = new Member(null, "Jane", "B", "Smith", "Sales", "UK", "M002", true);

        when(memberRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MemberNotFoundException.class, () -> {
            memberService.updateMember(invalidId, updatedDetails);
        });

        verify(memberRepository, times(1)).findById(invalidId);
        verify(memberRepository, never()).save(any(Member.class));
    }

    @Test
    void searchMembers_WithPagination_ReturnsCorrectPage() {
        // Arrange
        searchRequest.setPage(1);
        searchRequest.setSize(5);
        List<Member> members = Arrays.asList(testMember);
        Page<Member> expectedPage = new PageImpl<>(members, PageRequest.of(1, 5), 10);

        when(memberRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(expectedPage);

        // Act
        Page<Member> result = memberService.searchMembers(searchRequest);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getNumber());
        assertEquals(5, result.getSize());
        assertEquals(10, result.getTotalElements());
    }
}
