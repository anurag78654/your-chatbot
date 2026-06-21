# AI Chatbot

A lightweight, responsive AI chatbot powered by **Groq's API** — built with just HTML, CSS, and JavaScript and deployed via **Netlify Functions** (no traditional backend needed).

## Features

- ⚡ Blazing fast responses powered by Groq's LPU inference engine
- 🌙 Dark / light theme with system preference detection
- 🎯 Simple Q&A — no conversation history
- 📱 Mobile-responsive design
- 🔒 API key kept secure via Netlify serverless functions

## Prerequisites

- A [GitHub](https://github.com) account
- A [Netlify](https://netlify.com) account (free tier works perfectly)
- A [Groq API key](https://console.groq.com) (free credits available)

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install Netlify CLI (for local testing)

```bash
npm install -g netlify-cli
```

### 3. Set your Groq API key locally

```bash
echo "GROQ_API_KEY=gsk_your_key_here" > .env
```

### 4. Start the dev server

```bash
netlify dev
```

This starts a local server (usually `http://localhost:8888`) that serves the static files AND the serverless function together.

### 5. Open in browser

Navigate to `http://localhost:8888` and start chatting.

## Deploy to Netlify

### Step 1 — Push to GitHub

Create a repository on GitHub and push your code:

```bash
git remote add origin https://github.com/your-username/your-repo.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 2 — Connect to Netlify

1. Log into [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize Netlify
4. Choose your repository
5. In the deploy settings, leave everything as default — Netlify will detect `netlify.toml` automatically
6. Click **"Deploy site"**

### Step 3 — Set the environment variable

1. In your Netlify dashboard, go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Set **Key** = `GROQ_API_KEY`
4. Set **Value** = `gsk_your_actual_key` (get yours at https://console.groq.com)
5. Click **Save**

### Step 4 — Redeploy

Go to **Deploys** → click **"Trigger deploy"** → **"Deploy site"** to rebuild with the environment variable.

That's it! Your chatbot is now live at `https://your-site-name.netlify.app`.

## How It Works

```
User types message
       ↓
   app.js → POST /.netlify/functions/chat
       ↓
 chat.js (serverless) → reads GROQ_API_KEY from env
       ↓
   POST https://api.groq.com/openai/v1/chat/completions
       ↓
 Groq AI generates response
       ↓
 Response flows back → displayed in chat bubble
```

The API key **never** leaves the serverless function — your frontend only talks to your own Netlify endpoint.

## Customization

### Change the AI model

In `netlify/functions/chat.js`, change the `MODEL` constant. Options:

| Model                    | Speed      | Context |
|--------------------------|------------|---------|
| `llama-3.1-8b-instant`   | Very fast  | 131K    |
| `llama-3.3-70b-versatile`| Fast       | 131K    |
| `openai/gpt-oss-20b`     | Very fast  | 131K    |
| `qwen/qwen3-32b`         | Fast       | 131K    |
| `mixtral-8x7b-32768`     | Fast       | 32K     |

### Change the system prompt

In the same file, edit the system message inside the `messages` array to adjust the bot's personality.

### Change the styling

Edit `style.css` — the dark/light theme variables are at the top inside `:root` and `body.dark`.

## Project Structure

```
.
├── index.html              # Chat UI
├── style.css               # Theming and layout
├── app.js                  # Frontend logic
├── netlify/
│   └── functions/
│       └── chat.js         # Serverless function (Groq proxy)
├── netlify.toml            # Netlify configuration
└── README.md               # This file
```

## License

MIT
