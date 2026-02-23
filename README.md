# LLM Compare

A minimalistic web application to compare responses from multiple Large Language Models side-by-side.

## Features

- Select up to 4 LLMs simultaneously (GPT-4 Turbo, Claude 3.5 Sonnet, Grok 2, Gemini Pro)
- Send a single prompt to all selected models
- View real-time streaming responses in a split-screen layout
- Track latency metrics (time to first token, total response time)
- Clean black & white UI design

## Technology Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenRouter API for LLM access
- Vercel AI SDK

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Create a `.env.local` file in the root directory and add your OpenRouter API key:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

To get an API key:
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Generate an API key from your dashboard
4. Add credits to your account

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select 1-4 models using the checkboxes
2. Enter your prompt in the text area
3. Click "Send to All" or press Cmd/Ctrl+Enter
4. View streaming responses from all selected models side-by-side

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Using GitHub

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variable: `OPENROUTER_API_KEY`
6. Deploy

## Environment Variables

- `OPENROUTER_API_KEY` - Your OpenRouter API key (required)
- `NEXT_PUBLIC_SITE_URL` - Your site URL for API referer (optional, defaults to localhost)

## Project Structure

```
llm-compare/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route for LLM requests
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main comparison UI
│   └── globals.css                # Global styles
├── components/
│   ├── ModelSelector.tsx          # Checkbox selection UI
│   ├── PromptInput.tsx            # Prompt input field
│   ├── ResponsePanel.tsx          # Individual model response display
│   └── ComparisonGrid.tsx         # Grid layout for responses
├── lib/
│   └── openrouter.ts              # OpenRouter API client
├── .env.local                     # API keys (not committed)
└── package.json
```

## Cost Considerations

This app uses the OpenRouter API, which charges based on token usage. Costs vary by model:
- GPT-4 Turbo: ~$0.01-0.03 per request
- Claude 3.5 Sonnet: ~$0.003-0.015 per request
- Other models: Varies

Check [OpenRouter pricing](https://openrouter.ai/docs#models) for current rates.

## License

MIT
