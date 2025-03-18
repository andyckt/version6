/**
 * Comprehensive User Data Structure
 * 
 * This file defines the complete user data structure for the travel social media application.
 * It includes all user fields across different parts of the application, including account
 * information, privacy settings, safety & emergency data, and all other user-related data.
 */

// Define Activity type
export interface Activity {
  type: 'like' | 'read' | 'checkin';
  content: string;
  time: string;
  image: string;
  postId?: number;
}

// Define Auth Provider type
export interface AuthProvider {
  provider: string;
  providerId: string;
  lastLogin: string;
}

// Document type for insurance and other uploads
export interface Document {
  id: string;
  name: string;
  size: string;
  uploaded: string;
}

// Define Emergency Contact type
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

// Define Medical Information type
export interface MedicalInformation {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  additionalInfo: string;
  shareWithEmergencyServices: boolean;
}

// Define Insurance Policy type
export interface InsurancePolicy {
  id: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  startDate: string;
  endDate: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  documents: Document[];
  notes: string;
}

// Complete User Structure
export interface User {
  // Basic Identifiers
  id: number;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  verified: boolean;
  location: string;
  homeLocation: string;
  website: string;
  joinDate: string;
  
  // Stats
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  
  // Authentication & Security
  auth: {
    email: string;
    emailVerified: boolean;
    password: string; // This would be hashed, not stored as plaintext
    salt: string;
    twoFactorEnabled: boolean;
    twoFactorMethod: 'app' | 'sms' | 'email' | 'none';
    lastLogin: string;
    loginAttempts: number;
    accountLocked: boolean;
    providers: AuthProvider[];
  };
  
  // Privacy & Settings
  settings: {
    privacy: {
      profileVisibility: 'public' | 'followers' | 'private';
      activityVisibility: 'public' | 'followers' | 'private';
      locationSharing: boolean;
      showEmail: boolean;
      nameVisibility: boolean;
      bioVisibility: boolean;
      locationVisibility: boolean;
      followersListVisibility: 'public' | 'followers' | 'private';
      followingListVisibility: 'public' | 'followers' | 'private';
      searchIndexing: boolean;
    };
    activity: {
      likesVisibility: 'public' | 'followers' | 'private';
      commentsVisibility: 'public' | 'followers' | 'private';
      bookmarksVisibility: 'public' | 'followers' | 'private';
      newFollowsVisibility: boolean;
      recentActivityVisibility: 'public' | 'followers' | 'private';
      showActivityStatus: boolean;
      showReadReceipts: boolean;
    };
    location: {
      shareLocation: boolean;
      preciseLevelSharing: 'exact' | 'neighborhood' | 'city';
      shareWith: 'public' | 'followers' | 'private';
      enableAutomatic: boolean;
      notifyOnSharing: boolean;
      saveLocationHistory: boolean;
      showLocationInPosts: boolean;
      locationTaggingAccuracy: string;
    };
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      notificationTypes: {
        newFollower: boolean;
        likes: boolean;
        comments: boolean;
        mentions: boolean;
        directMessages: boolean;
      };
    };
    appearance: {
      theme: 'light' | 'dark' | 'system';
      language: string;
    };
    security: {
      twoFactorEnabled: boolean;
      twoFactorMethod: 'app' | 'sms' | 'none';
      activeSessions: {
        id: string;
        device: string;
        location: string;
        lastActive: string;
        isCurrent: boolean;
      }[];
      connectedApps: {
        id: string;
        name: string;
        permissions: string[];
        connectedDate: string;
        lastUsed: string;
      }[];
    };
  };
  
  // Safety & Emergency
  safety: {
    emergencyContacts: EmergencyContact[];
    medicalInformation: MedicalInformation;
    insurancePolicies: InsurancePolicy[];
  };
  
  // Compliance & Legal
  compliance: {
    termsAccepted: boolean;
    termsAcceptedVersion: string;
    termsAcceptedDate: string;
    privacyPolicyAccepted: boolean;
    privacyPolicyVersion: string;
    privacyPolicyDate: string;
    marketingConsent: boolean;
    dataProcessingConsent: boolean;
  };
  
  // Account Management
  accountManagement: {
    accountCreated: string;
    accountStatus: 'active' | 'suspended' | 'deactivated' | 'deleted';
    subscriptionTier: 'free' | 'premium';
    subscriptionStatus: 'none' | 'active' | 'canceled' | 'expired';
  };
  
  // Recent Activity
  recentActivity: Activity[];
}

// Default user structure when a new user registers
export const createNewUser = (
  id: number,
  username: string,
  email: string,
  displayName: string
): User => {
  const currentDate = new Date().toISOString();
  
  return {
    // Basic Identifiers
    id,
    username,
    displayName,
    bio: '',
    profileImage: `https://placehold.co/400x400/4ecdc4/ffffff?text=${username.charAt(0).toUpperCase()}`,
    coverImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    verified: false,
    location: '',
    homeLocation: '',
    website: '',
    joinDate: currentDate.split('T')[0],
    
    // Stats
    stats: {
      posts: 0,
      followers: 0,
      following: 0
    },
    
    // Authentication & Security
    auth: {
      email,
      emailVerified: false,
      password: '', // This would be hashed before storing
      salt: '',
      twoFactorEnabled: false,
      twoFactorMethod: 'none',
      lastLogin: currentDate,
      loginAttempts: 0,
      accountLocked: false,
      providers: []
    },
    
    // Privacy & Settings
    settings: {
      privacy: {
        profileVisibility: 'public',
        activityVisibility: 'followers',
        locationSharing: false,
        showEmail: false,
        nameVisibility: true,
        bioVisibility: true,
        locationVisibility: true,
        followersListVisibility: 'public',
        followingListVisibility: 'public',
        searchIndexing: true
      },
      activity: {
        likesVisibility: 'followers',
        commentsVisibility: 'public',
        bookmarksVisibility: 'private',
        newFollowsVisibility: true,
        recentActivityVisibility: 'public',
        showActivityStatus: true,
        showReadReceipts: true
      },
      location: {
        shareLocation: false,
        preciseLevelSharing: 'city',
        shareWith: 'followers',
        enableAutomatic: false,
        notifyOnSharing: true,
        saveLocationHistory: false,
        showLocationInPosts: true,
        locationTaggingAccuracy: 'neighborhood'
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
        notificationTypes: {
          newFollower: true,
          likes: true,
          comments: true,
          mentions: true,
          directMessages: true
        }
      },
      appearance: {
        theme: 'system',
        language: 'en-US'
      },
      security: {
        twoFactorEnabled: false,
        twoFactorMethod: 'none',
        activeSessions: [],
        connectedApps: []
      }
    },
    
    // Safety & Emergency
    safety: {
      emergencyContacts: [],
      medicalInformation: {
        bloodType: '',
        allergies: [],
        medications: [],
        conditions: [],
        additionalInfo: '',
        shareWithEmergencyServices: false
      },
      insurancePolicies: []
    },
    
    // Compliance & Legal
    compliance: {
      termsAccepted: true,
      termsAcceptedVersion: '1.0',
      termsAcceptedDate: currentDate,
      privacyPolicyAccepted: true,
      privacyPolicyVersion: '1.0',
      privacyPolicyDate: currentDate,
      marketingConsent: false,
      dataProcessingConsent: true
    },
    
    // Account Management
    accountManagement: {
      accountCreated: currentDate,
      accountStatus: 'active',
      subscriptionTier: 'free',
      subscriptionStatus: 'none'
    },
    
    // Recent Activity
    recentActivity: []
  };
};

// Example of a user with some data filled in
export const exampleUser: User = {
  // Basic Identifiers
  id: 12345678,
  username: 'travelenthusiast',
  displayName: 'Travel Enthusiast ✈️',
  bio: 'Travel blogger exploring Asia. Sharing authentic experiences and hidden gems. Currently based in Seoul.',
  profileImage: 'https://placehold.co/400x400/ffd100/ffffff?text=T',
  coverImage: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3',
  verified: true,
  location: 'Seoul, South Korea',
  homeLocation: 'Vancouver, Canada',
  website: 'https://travelenthusiast.blog',
  joinDate: '2021-03-15',
  
  // Stats
  stats: {
    posts: 87,
    followers: 1243,
    following: 348
  },
  
  // Authentication & Security
  auth: {
    email: 'travel.enthusiast@example.com',
    emailVerified: true,
    password: 'hashed_password_would_be_here',
    salt: 'random_salt_string',
    twoFactorEnabled: true,
    twoFactorMethod: 'app',
    lastLogin: '2023-11-15T08:42:31Z',
    loginAttempts: 0,
    accountLocked: false,
    providers: [
      {
        provider: 'google',
        providerId: 'google_user_id_123',
        lastLogin: '2023-10-20T14:22:10Z'
      }
    ]
  },
  
  // Privacy & Settings
  settings: {
    privacy: {
      profileVisibility: 'public',
      activityVisibility: 'followers',
      locationSharing: true,
      showEmail: false,
      nameVisibility: true,
      bioVisibility: true,
      locationVisibility: true,
      followersListVisibility: 'public',
      followingListVisibility: 'public',
      searchIndexing: true
    },
    activity: {
      likesVisibility: 'followers',
      commentsVisibility: 'public',
      bookmarksVisibility: 'private',
      newFollowsVisibility: true,
      recentActivityVisibility: 'public',
      showActivityStatus: true,
      showReadReceipts: true
    },
    location: {
      shareLocation: true,
      preciseLevelSharing: 'city',
      shareWith: 'followers',
      enableAutomatic: false,
      notifyOnSharing: true,
      saveLocationHistory: false,
      showLocationInPosts: true,
      locationTaggingAccuracy: 'neighborhood'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      notificationTypes: {
        newFollower: true,
        likes: true,
        comments: true,
        mentions: true,
        directMessages: true
      }
    },
    appearance: {
      theme: 'system',
      language: 'en-US'
    },
    security: {
      twoFactorEnabled: true,
      twoFactorMethod: 'app',
      activeSessions: [
        {
          id: 'sess_123',
          device: 'iPhone 13 Pro - Safari',
          location: 'Seoul, South Korea',
          lastActive: '2023-11-15T08:42:31Z',
          isCurrent: true
        }
      ],
      connectedApps: [
        {
          id: 'app_123',
          name: 'Instagram',
          permissions: ['read_profile', 'read_posts'],
          connectedDate: '2022-05-10T14:30:00Z',
          lastUsed: '2023-10-20T14:22:10Z'
        }
      ]
    }
  },
  
  // Safety & Emergency
  safety: {
    emergencyContacts: [
      {
        id: '1',
        name: 'Emma Johnson',
        relationship: 'Family',
        phone: '+1 (555) 123-4567',
        email: 'emma.j@example.com',
        isPrimary: true
      }
    ],
    medicalInformation: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      medications: ['Cetirizine 10mg (daily)'],
      conditions: ['Asthma - Mild'],
      additionalInfo: 'Carries an inhaler at all times.',
      shareWithEmergencyServices: true
    },
    insurancePolicies: [
      {
        id: '1',
        provider: 'WorldTraveler Insurance',
        policyNumber: 'WT-9876543',
        coverage: 'Comprehensive Travel',
        startDate: '2023-06-01',
        endDate: '2024-06-01',
        contactPhone: '+1 (800) 123-4567',
        contactEmail: 'claims@worldtraveler.com',
        website: 'https://www.worldtraveler-insurance.com',
        documents: [
          { id: 'doc1', name: 'Policy Document.pdf', size: '1.2 MB', uploaded: '2023-05-20' }
        ],
        notes: 'Includes emergency medical evacuation, trip cancellation, and lost baggage coverage.'
      }
    ]
  },
  
  // Compliance & Legal
  compliance: {
    termsAccepted: true,
    termsAcceptedVersion: '2.1',
    termsAcceptedDate: '2021-03-15T10:30:00Z',
    privacyPolicyAccepted: true,
    privacyPolicyVersion: '3.0',
    privacyPolicyDate: '2021-03-15T10:30:00Z',
    marketingConsent: true,
    dataProcessingConsent: true
  },
  
  // Account Management
  accountManagement: {
    accountCreated: '2021-03-15T10:30:00Z',
    accountStatus: 'active',
    subscriptionTier: 'free',
    subscriptionStatus: 'none'
  },
  
  // Recent Activity
  recentActivity: [
    {
      type: 'like',
      content: 'Liked a post about Shanghai Tower',
      time: '2 days ago',
      image: 'https://placehold.co/600x600/ffd100/ffffff'
    },
    {
      type: 'read',
      content: 'Read a post about Best Street Food in Seoul',
      time: '3 days ago',
      image: 'https://placehold.co/600x600/ff6b6b/ffffff'
    },
    {
      type: 'checkin',
      content: 'Checked in at The Bund, Shanghai',
      time: '1 week ago',
      image: 'https://placehold.co/600x600/4ecdc4/ffffff'
    }
  ]
}; 