# Login Debugging Guide

## Frontend Debugging Checklist

### 1. Credential Verification
- [ ] Credential is received from Google
- [ ] Credential is not empty
- [ ] Credential is sent to backend correctly

### 2. Network Request
- [ ] Correct API endpoint: `https://aibf-backend.up.railway.app/users/api/google-signin/`
- [ ] Proper Content-Type header
- [ ] Timeout configured
- [ ] Request payload includes credential

### 3. Response Handling
- [ ] Check for `access` and `refresh` tokens
- [ ] Validate user details
- [ ] Handle new vs existing user flow

## Common Failure Points

1. **Network Issues**
   - Check internet connection
   - Verify server is reachable
   - Look for CORS errors

2. **Authentication Failures**
   - Invalid Google credential
   - Backend token validation failure
   - Incorrect client configuration

3. **Server-Side Errors**
   - User creation/lookup problems
   - Database connection issues
   - Unexpected server-side exceptions

## Debugging Steps

1. Open Browser DevTools
2. Go to Network Tab
3. Filter XHR/Fetch requests
4. Attempt Google Sign-In
5. Examine:
   - Request payload
   - Response status
   - Response headers
   - Response body

## Recommended Logging

```python
# Backend view example
def google_signin_view(request):
    try:
        # Validate credential
        # Create/find user
        # Generate tokens
        return JsonResponse({
            'access': access_token,
            'refresh': refresh_token,
            'new_user': is_new_user
        })
    except Exception as e:
        logger.error(f"Google Sign-In Error: {str(e)}")
        return JsonResponse({
            'detail': 'Authentication failed',
            'error': str(e)
        }, status=400)
```

## Troubleshooting Checklist
- [ ] Verify Google Client ID
- [ ] Check backend token validation
- [ ] Confirm CORS settings
- [ ] Test with different browsers
- [ ] Validate network requests
