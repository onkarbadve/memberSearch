package com.example.membersearch.config;

import com.example.membersearch.model.Member;
import com.example.membersearch.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(MemberRepository repository) {
        return args -> {
            // Seed data
            // Some entitled, some not
            // Seed 1000 members for pagination testing
            List<Member> members = new java.util.ArrayList<>();

            // Add original manual data first (optional, but good for specific testing)
            members.addAll(Arrays.asList(
                    new Member(null, "John", "D", "Doe", "IT", "USA", "1001", true),
                    new Member(null, "Alice", "K", "Johnson", "IT", "USA", "1003", false)));

            for (int i = 1; i <= 1000; i++) {
                boolean entitled = i % 5 != 0; // 80% entitled
                members.add(new Member(
                        null,
                        "User" + i,
                        "M",
                        "Last" + i,
                        "IT",
                        "USA",
                        "S" + i,
                        entitled));
            }

            repository.saveAll(members);
            System.out.println("Seeded " + members.size() + " members.");
        };
    }
}
