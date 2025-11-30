# Creating Staff Users

To make a user a staff member, you need to manually update their role in Firebase:

## Method 1: Firebase Console
1. Go to Firebase Console
2. Open your project
3. Go to Firestore Database
4. Find the `users` collection
5. Find the user document by email
6. Edit the document
7. Change `role` field from `'user'` to `'staff'`
8. Save changes

## Method 2: Admin User Creation (Future)
In the future, you could add a feature in the Admin panel to promote users to staff.

## Staff Features
Staff users can:
- Access the Admin panel at `/admin`
- View all registered users
- See user roles and contact information

## Testing
To test staff features:
1. Register a new user account
2. Use Firebase Console to change their role to 'staff'
3. Log out and log back in
4. You should now see the "Admin" link in the navigation bar