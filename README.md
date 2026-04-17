# NexusAI Dialogflow Web Application

A premium, interactive web interface built to seamlessly connect with Google Dialogflow. This project was specifically designed to handle rich text and custom payloads (including Telegram-formatted protobufs), transforming raw backend data into a stunning, glassmorphic UI.

## 🚀 Overview

This Next.js application acts as a custom front-end for a Dialogflow agent. Instead of using generic iframe embeddings, this web app securely communicates with Dialogflow via a dedicated API route. 

One of the standout features is its custom **Payload Parser**. When the Dialogflow agent returns product data via Telegram Custom Payloads (e.g., data fetched from Google Sheets containing images, prices, and links), this application intercepts the raw Protobuf format and magically translates it into interactive, scrollable product cards in the UI.

## ✨ Key Features

- **Premium UI/UX:** Built with Tailwind CSS, featuring dark mode by default, deep ambient gradients, backdrop blur effects, and smooth micro-interactions.
- **Framer Motion Animations:** Fluid page transitions, staggered message appearances, and realistic typing indicators.
- **Custom Telegram Payload Parsing:** Automatically detects `telegram` custom payloads sent by Dialogflow and extracts photos, captions, and inline keyboard URLs to display rich product carousels.
- **Secure Serverless API:** All interactions with Google Cloud happen securely on the server side (`/api/chat/route.ts`). Client credentials are never exposed to the browser.
- **Next.js App Router:** Utilizing the latest Next.js features for optimized performance and instant loading.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Cloud Integration:** `@google-cloud/dialogflow`

## ⚙️ Setup Instructions

### 1. Prerequisites
Ensure you have Node.js installed on your machine. You will also need a Google Cloud Project with the Dialogflow API enabled and a Service Account.

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your Google Cloud credentials:

```env
DIALOGFLOW_PROJECT_ID=your-project-id
DIALOGFLOW_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
DIALOGFLOW_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```
*(Note: Ensure the quotes around the private key are kept so the `\n` newline characters are processed correctly).*

### 3. Running Locally
Install the dependencies and start the development server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment

This application is fully optimized for **Vercel**. 

1. Push your code to a GitHub repository.
2. Import the repository into your Vercel dashboard.
3. In the Vercel project settings, go to **Environment Variables** and add `DIALOGFLOW_PROJECT_ID`, `DIALOGFLOW_CLIENT_EMAIL`, and `DIALOGFLOW_PRIVATE_KEY`.
4. Click **Deploy**.

## 🤖 About the Bot Interaction

The chatbot interface expects two types of responses from the API:
1. **Standard Text:** Simple conversational text rendered with a user/bot bubble.
2. **Product Payloads:** If the bot responds with a Telegram payload containing images, captions with `*Name*` and `Price: X`, and `inline_keyboard` URLs, the frontend translates this into a horizontal scrollable row of interactive glassmorphic cards right inside the chat window.

---
*Built with ❤️ using Next.js and Google Dialogflow.*
