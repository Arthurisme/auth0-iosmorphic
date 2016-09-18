package com.auth0.example;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Throwaway stub for demonstration only - feel free to implement a JPA repository
 * using Spring Boot - required dependencies (with h2 db) already configured
 * in maven pom.xml for this sample...
 */
@Component
public class ProfileRepositoryStub {

	private static Map<Long, Profile> profiles = new HashMap<Long, Profile>();
	private static Long idIndex = 3L;

	static {
		final Profile a = new Profile(1L, "Bob", "bob@secure.com");
		profiles.put(1L, a);
		Profile b = new Profile(2L, "Alice", "alice@secure.com");
		profiles.put(2L, b);
		Profile c = new Profile(3L, "Eve", "eve@hacker.com");
		profiles.put(3L, c);
	}

	public static List<Profile> list() {
		return new ArrayList<Profile>(profiles.values());
	}

	public static Profile create(Profile profile) {
		idIndex += 1;
		profile.setId(idIndex);
		profiles.put(idIndex, profile);
		return profile;
	}

	public static Profile get(Long id) {
		final Profile profile = profiles.get(id);
		if (profile == null) {
			throw new ResourceNotFoundException("Cannot find profile with id: " + id);
		}
		return profile;
	}

	public static Profile update(Long id, Profile profile) {
        final Profile persistedProfile = profiles.get(id);
		if (persistedProfile == null) {
			throw new ResourceNotFoundException("Cannot find profile with id: " + id);
		}
        if (profile.getName() != null) {
           persistedProfile.setName(profile.getName());
        }
        if (profile.getEmail() != null) {
            persistedProfile.setEmail(profile.getEmail());
        }
		profiles.put(id, persistedProfile);
        return profiles.get(id);
	}

	public static Profile delete(Long id) {
		if (profiles.get(id) == null) {
			throw new ResourceNotFoundException("Cannot find profile with id: " + id);
		}
		return profiles.remove(id);
	}
}
