package com.socialswap.api.repository;

import com.socialswap.api.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUserId(Long userId);
    
    @Query("SELECT w FROM Watchlist w WHERE w.user.id = :userId AND w.profile.id = :profileId")
    Optional<Watchlist> findByUserIdAndProfileId(@Param("userId") Long userId, @Param("profileId") Long profileId);
    
    @Modifying
    @Query("DELETE FROM Watchlist w WHERE w.user.id = :userId AND w.profile.id = :profileId")
    void deleteByUserIdAndProfileId(@Param("userId") Long userId, @Param("profileId") Long profileId);
}