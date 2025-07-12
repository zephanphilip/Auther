# Auther - Authentication as a Service

Auther is a **multi-tenant authentication server** that lets you easily integrate secure login, MFA, and token management into any application.

---

## 🎯 Features

✅ **Multi-tenant authentication**
- Register apps with unique `appId` 
- Isolated user data per app

✅ **Email/Password Login**
- Bcrypt password hashing
- Per-app user separation

✅ **JWT Access & Refresh Tokens**
- RS256 signing (public/private key)
- Short-lived access tokens
- Long-lived refresh tokens with rotation
- Token revocation

✅ **MFA (Two-Factor Authentication)**
- TOTP (Google Authenticator)
- QR code enrollment
- MFA verification during login

✅ **Public JWKS Endpoint**
- Serve `.well-known/jwks.json` for verifying access tokens
- Supports key rotation

✅ **Swagger API Docs**
- All endpoints documented
- Test login, refresh, MFA flows interactively

---

## 🚀 Quick Start

1. **Install dependencies:**
```

npm install

```

2. **Generate RSA keys:**
```

openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa\_keygen\_bits:2048
openssl rsa -pubout -in private.pem -out public.pem

```
Place them in the `keys/` folder.

3. **Configure environment variables:**
```

JWT\_PRIVATE\_KEY\_PATH=./keys/private.pem
JWT\_PUBLIC\_KEY\_PATH=./keys/public.pem
MONGO\_URI=mongodb://localhost/auther

```

4. **Run the app:**
```

npm run start:dev

```

5. **View Swagger docs:**
[http://localhost:3000/docs](http://localhost:3000/docs)


---

## ⚙️ API Endpoints Overview

### 🟢 Registration
`POST /auth/register`
- Register a new user and issue tokens

### 🟢 Login
`POST /auth/login`
- Login with email/password
- If MFA enabled, returns `{ mfaRequired: true }`

### 🟢 Complete MFA
`POST /auth/completemfa`
- Verify TOTP code and issue tokens

### 🟢 Refresh
`POST /auth/refresh`
- Rotate access & refresh tokens using HttpOnly cookie

### 🟢 Logout
`POST /auth/logout`
- Clear refresh token cookie

### 🟢 MFA Enrollment
`POST /mfa/setup`
- Generate QR code for TOTP enrollment

`POST /mfa/verify`
- Verify TOTP code and enable MFA

`POST /mfa/disable`
- Disable MFA

### 🟢 JWKS Endpoint
`GET /.well-known/jwks.json`
- Public key(s) for verifying access tokens

---

## 🧩 Next Steps

- Social login (Google, GitHub)
- Admin dashboard for managing tenants and users
- Usage analytics and logs


---


