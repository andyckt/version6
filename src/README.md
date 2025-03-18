# User Data Structure Documentation

This document provides an overview of the comprehensive user data structure used in our travel social media application.

## Overview

The user data structure is designed to store all information related to a user account, including profile information, settings, safety & emergency data, compliance information, and activity data. This structure is defined in `src/types/user.ts` and is used throughout the application.

## Key Files

- `src/types/user.ts`: Defines the complete user data structure with type interfaces
- `src/utils/authUtils.ts`: Utility functions for user authentication and account management
- `src/components/UserContext.tsx`: React context provider for user state management
- `src/hooks/useSafetySettings.ts`: Custom hook for managing safety and emergency settings

## User Structure

The user structure is divided into several key sections:

### Basic Identifiers
- `id`: Unique numeric identifier
- `username`: Unique alphanumeric username
- `displayName`: Name displayed in the UI
- `bio`: User bio/description
- `profileImage`: URL to profile picture
- `coverImage`: URL to cover image
- `verified`: Whether the account is verified
- `location`: Current location
- `homeLocation`: Home location
- `website`: Personal website URL
- `joinDate`: When the user joined

### Stats
- `posts`: Number of posts created
- `followers`: Number of followers
- `following`: Number of accounts following

### Authentication & Security
- Information about the user's login credentials, verification status, etc.
- Authentication providers (Google, Apple, etc.)

### Privacy & Settings
- Profile visibility settings
- Activity visibility
- Location sharing preferences
- Notification preferences
- App appearance settings
- Security settings

### Safety & Emergency
- Emergency contacts
- Medical information
- Insurance policies

### Compliance & Legal
- Terms acceptance
- Privacy policy acceptance
- Marketing consent
- Data processing consent

### Account Management
- Account creation date
- Account status
- Subscription information

### Recent Activity
- List of recent actions in the app

## Example Usage

### Creating a New User

```typescript
import { createAccount } from '@/utils/authUtils';

// Create a new user account
const newUser = createAccount(
  'traveler123',
  'traveler@example.com',
  'securePassword123',
  'Adventure Traveler'
);
```

### Accessing User Data in Components

```typescript
import { useUser } from '@/components/UserContext';

const ProfileComponent = () => {
  const { user, isLoading } = useUser();
  
  if (isLoading) return <Loading />;
  if (!user) return <NotLoggedIn />;
  
  return (
    <div>
      <h1>{user.displayName}</h1>
      <p>{user.bio}</p>
      {/* More profile information */}
    </div>
  );
};
```

### Managing Safety Settings

```typescript
import { useSafetySettings } from '@/hooks/useSafetySettings';

const EmergencyContactsComponent = () => {
  const { 
    addEmergencyContact, 
    removeEmergencyContact,
    isSaving 
  } = useSafetySettings();
  
  const handleAddContact = async () => {
    await addEmergencyContact({
      name: 'John Doe',
      relationship: 'Family',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@example.com',
      isPrimary: true
    });
  };
  
  // Component JSX...
};
```

## Default Values

When a new user registers, default values are provided for all fields in the user structure. These defaults include:

- Empty bio, location, and website
- Default profile image based on the user's first initial
- Public profile visibility but limited activity visibility
- No emergency contacts or medical information
- All required legal agreements accepted
- Free subscription tier

## Best Practices

1. Always use the `createNewUser` function when initializing a new user account to ensure all fields have proper default values.
2. Use the helper functions in `authUtils.ts` to manipulate user data rather than directly modifying the user object.
3. If adding new fields to the User interface, be sure to update the `createNewUser` function with appropriate default values.
4. For sensitive operations (e.g., changing password, updating privacy settings), always implement proper validation and confirmation steps. 