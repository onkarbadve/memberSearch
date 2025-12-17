package com.example.membersearch.controller;

import com.example.membersearch.dto.SearchRequest;
import com.example.membersearch.exception.MemberNotFoundException;
import com.example.membersearch.model.Member;
import com.example.membersearch.service.AISearchService;
import com.example.membersearch.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MemberController.class)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MemberService memberService;

    @MockBean
    private AISearchService aiSearchService;

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
    void searchMembers_WithValidRequest_ReturnsOk() throws Exception {
        // Arrange
        List<Member> members = Arrays.asList(testMember);
        Page<Member> page = new PageImpl<>(members, PageRequest.of(0, 10), 1);
        when(memberService.searchMembers(any(SearchRequest.class))).thenReturn(page);

        // Act & Assert
        mockMvc.perform(post("/api/members/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(searchRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].firstName", is("John")))
                .andExpect(jsonPath("$.content[0].lastName", is("Doe")))
                .andExpect(jsonPath("$.totalElements", is(1)));
    }

    @Test
    void searchMembers_WithInvalidPageNumber_ReturnsBadRequest() throws Exception {
        // Arrange
        searchRequest.setPage(-1);

        // Act & Assert
        mockMvc.perform(post("/api/members/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(searchRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Validation Failed")));
    }

    @Test
    void searchMembers_WithInvalidPageSize_ReturnsBadRequest() throws Exception {
        // Arrange
        searchRequest.setSize(200); // Exceeds max of 100

        // Act & Assert
        mockMvc.perform(post("/api/members/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(searchRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Validation Failed")));
    }

    @Test
    void aiSearch_WithValidQuery_ReturnsOk() throws Exception {
        // Arrange
        String query = "find engineers in USA";
        SearchRequest parsedRequest = new SearchRequest();
        parsedRequest.setBusinessUnits(Arrays.asList("Engineering"));
        parsedRequest.setCountry("USA");
        parsedRequest.setPage(0);
        parsedRequest.setSize(10);

        List<Member> members = Arrays.asList(testMember);
        Page<Member> page = new PageImpl<>(members, PageRequest.of(0, 10), 1);

        when(aiSearchService.parseQuery(query)).thenReturn(parsedRequest);
        when(memberService.searchMembers(any(SearchRequest.class))).thenReturn(page);

        // Act & Assert
        mockMvc.perform(post("/api/members/search/ai")
                .contentType(MediaType.APPLICATION_JSON)
                .content(query)
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].businessUnit", is("Engineering")));
    }

    @Test
    void updateMember_WithValidData_ReturnsOk() throws Exception {
        // Arrange
        Member updatedMember = new Member(1L, "Jane", "B", "Smith", "Sales", "UK", "M002", true);
        when(memberService.updateMember(eq(1L), any(Member.class))).thenReturn(updatedMember);

        // Act & Assert
        mockMvc.perform(put("/api/members/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedMember)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Jane")))
                .andExpect(jsonPath("$.lastName", is("Smith")))
                .andExpect(jsonPath("$.businessUnit", is("Sales")));
    }

    @Test
    void updateMember_WithInvalidId_ReturnsNotFound() throws Exception {
        // Arrange
        Member updatedMember = new Member(null, "Jane", "B", "Smith", "Sales", "UK", "M002", true);
        when(memberService.updateMember(eq(999L), any(Member.class)))
                .thenThrow(new MemberNotFoundException(999L));

        // Act & Assert
        mockMvc.perform(put("/api/members/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedMember)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("Member not found")));
    }

    @Test
    void updateMember_WithMissingFirstName_ReturnsBadRequest() throws Exception {
        // Arrange
        Member invalidMember = new Member(null, "", "B", "Smith", "Sales", "UK", "M002", true);

        // Act & Assert
        mockMvc.perform(put("/api/members/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidMember)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Validation Failed")));
    }

    @Test
    void searchMembers_WithMultipleFilters_ReturnsFilteredResults() throws Exception {
        // Arrange
        searchRequest.setFirstName("John");
        searchRequest.setCountry("USA");
        searchRequest.setBusinessUnits(Arrays.asList("Engineering"));

        List<Member> members = Arrays.asList(testMember);
        Page<Member> page = new PageImpl<>(members, PageRequest.of(0, 10), 1);
        when(memberService.searchMembers(any(SearchRequest.class))).thenReturn(page);

        // Act & Assert
        mockMvc.perform(post("/api/members/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(searchRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].firstName", is("John")))
                .andExpect(jsonPath("$.content[0].country", is("USA")))
                .andExpect(jsonPath("$.content[0].businessUnit", is("Engineering")));
    }
}
