# Google Sign-In Troubleshooting

## Potential Issues and Solutions

### 1. Client ID Configuration

- Ensure your Google Cloud Console project is set up correctly
- Verify Authorized JavaScript Origins:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
- Verify Authorized Redirect URIs (if applicable)

### 2. Common Error Messages

- "Access blocked: This app's request is invalid"
  - Check client ID
  - Verify domain configuration
  - Ensure correct OAuth consent screen setup

### 3. Debugging Steps

1. Open Browser Developer Tools
2. Go to Network Tab
3. Filter by XHR/Fetch
4. Attempt Google Sign-In
5. Look for:
   - Request to Google OAuth endpoint
   - Response from your backend

### 4. Recommended Configuration

```typescript
<GoogleLogin
  onSuccess={handleLoginSuccess}
  onError={handleError}
  useOneTap
  auto_select
  type="standard"
  theme="filled_blue"
  size="large"
  text="signin_with"
  shape="rectangular"
/>
```

### 5. Backend Verification

- Ensure backend can validate Google JWT
- Check CORS settings
- Verify token validation logic

### Troubleshooting Checklist

- [ ] Correct Client ID
- [ ] Authorized Domains Configured
- [ ] Backend Token Validation
- [ ] CORS Settings
- [ ] Error Handling Implemented
