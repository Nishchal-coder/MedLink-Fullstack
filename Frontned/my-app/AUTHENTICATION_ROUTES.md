# Authentication Routes Documentation

## Overview

MedLink now implements role-based authentication routes to provide a better user experience and clearer navigation structure.

## Route Structure

### Main Authentication Selection
- **`/auth`** - Authentication selection page where users choose their portal type
  - Displays three options: Patient Portal, Doctor Portal, Admin Portal
  - Each option links to the appropriate role-specific authentication page

### Role-Specific Authentication Routes
- **`/auth-user`** - Patient/User authentication
  - For regular patients accessing their medical records
  - Redirects to `/user` after successful authentication
  - Role field is pre-set to "user" and hidden

- **`/auth-doctor`** - Doctor authentication
  - For medical professionals managing patient records
  - Redirects to `/doctor` after successful authentication
  - Role field is pre-set to "doctor" and hidden

- **`/auth-admin`** - Administrator authentication
  - For system administrators managing the platform
  - Redirects to `/admin` after successful authentication
  - Role field is pre-set to "admin" and hidden

### Legacy Route
- **`/auth`** (original) - Now serves as the authentication selection page
  - Users can choose which type of account they want to create or access
  - Provides a clear separation between different user types

## Benefits

1. **Better UX**: Users can directly access the appropriate login form
2. **Clearer Navigation**: URL structure immediately indicates the user type
3. **Security**: Different authentication flows for different user types
4. **Scalability**: Easy to add role-specific features to each auth page
5. **Professional Appearance**: Separate portals for different user types

## Implementation Details

### Header Component
- Login/Signup buttons now link to `/auth-user` by default
- This assumes most users accessing from the main site are patients

### AuthPage Component
- Accepts a `userType` prop to determine behavior
- Pre-sets the role field when `userType` is provided
- Hides role selection dropdown when `userType` is specified
- Navigates to appropriate dashboard based on user type

### Navigation Flow
1. User clicks login/signup → `/auth-user` (patient portal)
2. User visits `/auth` → Authentication selection page
3. User chooses portal type → Role-specific authentication page
4. Successful authentication → Role-specific dashboard

## Future Enhancements

- Add role-specific styling and branding to each auth page
- Implement different validation rules for different user types
- Add role-specific registration requirements
- Implement different password policies per user type
- Add role-specific terms of service and privacy policies
