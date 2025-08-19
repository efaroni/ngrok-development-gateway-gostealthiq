# GoHighLevel OAuth Development Gateway

A minimal Express.js gateway server that routes GoHighLevel OAuth callbacks to your local application during development.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the gateway + ngrok:**
   ```bash
   npm start
   ```
   This starts both the gateway server and ngrok tunnel automatically!

3. **Start your GHL app on port 3001** (separate terminal)

4. **Set GoHighLevel redirect URI to:**
   ```
   https://gostealthiq-dev.sa.ngrok.io/oauth/callback/stealth-iq-location
   ```

That's it! The gateway will route GHL OAuth callbacks to `http://localhost:3001/oauth/callback/ghl`

### Alternative Scripts
- `npm run server-only` - Start just the gateway server (no ngrok)
- `npm run dev` - Development mode with auto-restart + ngrok

## How It Works

When developing with the GoHighLevel API, you need a stable callback URL for OAuth. This gateway provides a single entry point that routes GHL callbacks to your local application running on port 3001.

```
GoHighLevel → ngrok → Gateway (port 3000) → Your App (port 3001)
```

### Request Flow

1. GoHighLevel sends callback to: `https://gostealthiq-dev.sa.ngrok.io/oauth/callback/stealth-iq-location`
2. Gateway receives request and routes to your local app
3. Gateway proxies to: `http://localhost:3001/oauth/callback/ghl`
4. Your local app handles the GoHighLevel OAuth callback

## Example Setup

Create your GoHighLevel application that will receive the OAuth callback:

### Your GHL App - Port 3001

Create a new directory and set up your app:

```bash
mkdir my-ghl-app && cd my-ghl-app
npm init -y
npm install express
```

Create `app.js`:
```javascript
const express = require('express');
const app = express();

app.get('/oauth/callback/ghl', (req, res) => {
  console.log('GoHighLevel OAuth callback received:', req.query);
  
  // Extract the authorization code and state
  const { code, state } = req.query;
  
  // Here you would exchange the code for an access token
  // using GoHighLevel's token endpoint
  
  res.json({ 
    message: 'OAuth callback received successfully',
    code,
    state
  });
});

app.listen(3001, () => {
  console.log('GoHighLevel app running on port 3001');
});
```

## Running the Complete Setup

### 1. Start Your Applications

In separate terminals:

```bash
# Terminal 1 - Your GHL App
cd my-ghl-app
node app.js

# Terminal 2 - Gateway Server  
cd ngrok-development-gateway-gostealthiq
npm start
```

### 2. Start ngrok

```bash
# Terminal 3
ngrok http --domain=gostealthiq-dev.sa.ngrok.io 3000
```

### 3. Configure GoHighLevel Application

In your GoHighLevel developer settings, set the redirect URI to:

`https://gostealthiq-dev.sa.ngrok.io/oauth/callback/stealth-iq-location`

## Testing

Test the routing with curl:

```bash
# Test GoHighLevel callback
curl "https://gostealthiq-dev.sa.ngrok.io/oauth/callback/stealth-iq-location?code=abc123&state=xyz"
```

Expected response:
```json
{"message":"OAuth callback received successfully","code":"abc123","state":"xyz"}
```

## Gateway Configuration

The gateway server maps the stealth-iq-location key to port 3001 in `server.js`:

```javascript
const appTargets = {
  'stealth-iq-location': 3001
};
```

The gateway is configured for your specific GoHighLevel setup and runs on port 3000.

## Development Workflow

1. **Stable URL**: Use the same ngrok domain for GoHighLevel OAuth
2. **Local Development**: Your app runs on port 3001 with hot reload
3. **Gateway Routing**: All GHL callbacks route through the gateway on port 3000
4. **Easy Testing**: Test OAuth flows without changing GHL settings

This setup is perfect for:
- GoHighLevel API development
- Testing OAuth flows locally
- Stable development environment
- Quick iteration on GHL integrations