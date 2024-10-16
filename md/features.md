[go back](../README.md)

### This startup kit have implemented the following features

- Sign In
  Users enter their email and password to authenticate

- Sign Up
  Users create an account with an email and password, receiving a 6-digit code via email to verify and activate the account.

- Confirm Signup Email
  Users input the 6-digit code sent to their email to confirm their account and complete the signup process.

- Reset Password
  Users request a password reset link via email, follow the link, and set a new password to regain account access.

- Logout
  Users terminate their session and logging them out of the app.

#### This features would be great to add

- Change Email
  Users update their email by verifying the new email address with a confirmation code sent to the new email.

- One-Time Password (OTP) Authentication
  -- OTP-based Sign In: Instead of password-based authentication, allow users to log in using an OTP sent to their registered email or phone number. This is particularly useful for mobile-first apps.
  -- Backup OTP Methods: Provide a backup OTP method in case the primary method fails, e.g., using email if SMS OTP fails or vice versa.

- Social Login Options
  -- Google, Facebook, Apple, etc.: Many users could prefer signing in with existing social accounts. Integrating social logins improves convenience and reduces friction.

- Multi-Factor Authentication (MFA)
  -- SMS/Email or App-Based (Google Authenticator, Authy): After entering the password, users can be required to provide a second form of authentication. This enhances security and is crucial for high-value applications.

- Passwordless Authentication
  -- Magic Links: Allow users to sign in via a link sent to their email. This can be more secure than passwords and offers a better user experience.
  -- Biometric Authentication: If your app will support mobile devices, consider adding fingerprint or facial recognition login options.

- Security Notifications
  -- Login Alerts: Notify users of any login from a new device or location. Include details like IP address, device type, and approximate location.
  -- Password Change Notifications: Notify the user when their password is changed, along with an option to reset if the action was unauthorized.

- User Consent on Each New Device
  -- Device Authorization: When a user logs in from a new device, notify them via email or SMS, asking for confirmation. This adds a layer of protection and keeps users aware of new logins.
  -- Device Recognition: Provide an option to "Remember this device" so the user doesn’t need to repeatedly verify trusted devices. They can manage these devices from their account settings.
  -- users could see the devices that access that account, and could revoke device permissions

- Role-Based Access Control (RBAC)
  -- Permissions and Roles: If your app will have admin or different user levels, integrate role-based access control. Different users might have different permissions within the app.

- Account Merge & Linking/Unmerge & Unlinking
  -- Account Linking: If your users have multiple accounts (e.g., social logins combined with email/password logins), give them an option to link or merge these accounts into one for a smoother user experience.
  -- Automatic Account Merge: If users sign up using an email they’ve previously signed in with via social login, automatically link the accounts and avoid duplicate profiles.

### Because this is using supabase, this features already come included

- Session Management & Security
  -- Session Expiration: Implement session timeout after a period of inactivity. It can also include a "Remember Me" option for persistent sessions.
  -- Session Revocation: Allow users to revoke all active sessions, which is especially useful if a user suspects their account is compromised.

- Device/Session History: Show users which devices and locations they are logged in from, with an option to revoke specific sessions.

- Account Lock: After a certain number of failed login attempts, temporarily lock the account to prevent brute-force attacks.

- Email Link Expiration: Set expiration times on email confirmation links (e.g., 24 hours), requiring users to request a new one if they don't verify within that window.
