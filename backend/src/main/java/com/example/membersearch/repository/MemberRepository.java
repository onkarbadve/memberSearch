package com.example.membersearch.repository;

import com.example.membersearch.model.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import com.example.membersearch.dto.SearchRequest;
import org.springframework.util.StringUtils;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long>, JpaSpecificationExecutor<Member> {

    default Specification<Member> buildSpecification(SearchRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(request.getFirstName())) {
                predicates.add(
                        cb.like(cb.lower(root.get("firstName")), "%" + request.getFirstName().toLowerCase() + "%"));
            }
            if (StringUtils.hasText(request.getMiddleName())) {
                predicates.add(
                        cb.like(cb.lower(root.get("middleName")), "%" + request.getMiddleName().toLowerCase() + "%"));
            }
            if (StringUtils.hasText(request.getLastName())) {
                predicates
                        .add(cb.like(cb.lower(root.get("lastName")), "%" + request.getLastName().toLowerCase() + "%"));
            }
            if (StringUtils.hasText(request.getBusinessUnit())) {
                predicates.add(cb.equal(root.get("businessUnit"), request.getBusinessUnit()));
            }
            if (StringUtils.hasText(request.getCountry())) {
                predicates.add(cb.equal(root.get("country"), request.getCountry()));
            }
            if (StringUtils.hasText(request.getSourceMemberId())) {
                predicates.add(cb.equal(root.get("sourceMemberId"), request.getSourceMemberId()));
            }

            // OPTIMIZATION: Move security check to DB
            predicates.add(cb.equal(root.get("entitled"), true));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
