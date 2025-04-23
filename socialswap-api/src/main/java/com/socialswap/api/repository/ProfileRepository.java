package com.socialswap.api.repository;

import com.socialswap.api.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByIsFeaturedTrue();
    List<Profile> findByIsHotTrue();
    List<Profile> findByPlatformId(Long platformId);
    List<Profile> findByCategoryId(Long categoryId);
    List<Profile> findByUserId(Long userId);
}