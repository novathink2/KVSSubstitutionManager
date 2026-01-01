# Script Bot - AI Assistant Guide

## Overview

The **Script Bot** is an AI-powered chatbot integrated into the KVS AI Substitution Manager. It helps users navigate the application, understand features, and get quick answers to their questions using Google Gemini AI.

---

## Features

### ✨ Key Features

- **Floating Button**: Accessible from any page via bottom-right floating button
- **Chat Interface**: Clean, responsive chat window
- **AI-Powered**: Uses Google Gemini 1.5 Pro for intelligent responses
- **Context-Aware**: Maintains conversation history
- **Error Handling**: Graceful fallback when API is unavailable
- **Smooth Animations**: Scale-in animation for chat window
- **Keyboard Support**: Press Enter to send messages

---

## How to Use Script Bot

### Opening the Chat:

1. Look for the **purple floating button** at the bottom-right corner of any page
2. Click the button to open the chat window
3. Chat window slides in with animation

### Asking Questions:

1. **Type Your Question**:
   - Click the input field at the bottom
   - Type your question or request
   - Example: "How do I apply for leave?"

2. **Send Message**:
   - Click the **Send** button (paper plane icon)
   - Or press **Enter** key
   - Your message appears on the right (blue bubble)

3. **Receive Response**:
   - Script Bot reply appears on the left (gray bubble)
   - Supports multi-line text and code formatting
   - Clear, helpful explanations

### Closing the Chat:

- Click the **X** button in the top-right corner
- Chat window slides out
- Conversation history is preserved

---

## Example Questions

### Getting Started:
- "How do I register as an admin?"
- "What is this application for?"
- "How do I add teachers?"

### Leave Management:
- "How do I apply for leave?"
- "Can I upload a medical certificate?"
- "How do I cancel my leave application?"

### Substitution Plans:
- "How does the substitution algorithm work?"
- "Can I see who is substituting for me?"
- "How do admins create substitution plans?"

### Timetable:
- "How do I view my timetable?"
- "Can I edit my timetable?"
- "How do I upload timetables in bulk?"

### Requests:
- "How do I request a class interchange?"
- "Can I see the status of my request?"
- "What types of requests can I make?"

### Profile:
- "How do I upload a profile picture?"
- "Can I change my password?"
- "How do I update my contact information?"

---

## Technical Details

### AI Model

**Provider**: Google Gemini AI  
**Model**: `gemini-1.5-pro`  
**Temperature**: 0.7 (balanced creativity and accuracy)  
**Max Tokens**: 1024 per response

### API Configuration

**Environment Variable**: `VITE_GEMINI_API_KEY`

**Required Setup**:
1. Get API key from: https://makersuite.google.com/app/apikey
2. Add to `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Restart development server

### Context System

**System Prompt** (configured in `src/lib/gemini.ts`):
```
You are a helpful assistant for the KVS AI Substitution Manager application.
This is a school management system designed for Kendriya Vidyalaya Sangathan (KVS).

Features:
- Admin dashboard for managing teachers and creating substitution plans
- Teacher dashboard for managing leaves, requests, and viewing timetables
- Smart substitution algorithm that prioritizes teachers who already teach the class
- Real-time data synchronization with OnSpace Cloud (Supabase)

Help users navigate and understand the application. Provide clear, concise answers.
```

**Conversation History**: Maintains last 10 message pairs for context

---

## User Interface

### Floating Button

**Location**: Bottom-right corner, fixed position  
**Size**: 56x56 px circular button  
**Color**: Primary theme color (purple/indigo)  
**Icon**: MessageCircle from Lucide React  
**Hover Effect**: Scale up (1.1x)

### Chat Window

**Size**: 384px width × 500px height  
**Position**: Bottom-right, 24px from edges  
**Design**: Card-style with rounded corners  
**Animation**: Scale-in on open, fade-out on close

**Header**:
- Title: "Script Bot"
- Icon: MessageCircle
- Close button (X)
- Primary color background

**Messages Area**:
- Scrollable message list
- User messages: Right-aligned, blue background
- Bot messages: Left-aligned, gray background
- Auto-scroll to latest message
- Empty state message when no conversation

**Input Area**:
- Text input field
- Send button (paper plane icon)
- Enter key support
- Disabled during message processing

---

## Error Handling

### No API Key Configured

**Error Message**:
```
⚠️ Gemini API key not configured. Please:

1. Create a .env file in the project root
2. Add: VITE_GEMINI_API_KEY=your_api_key
3. Restart the development server

Get your API key from: https://makersuite.google.com/app/apikey
```

**Solution**: Follow the instructions to configure API key

### Invalid API Key

**Error Message**:
```
⚠️ Invalid Gemini API key. Please check your API key and make sure it's correct.
```

**Solution**: Verify API key is copied correctly from Google AI Studio

### Network Error

**Error Message**:
```
⚠️ Error: [error details]
```

**Solution**: Check internet connection and try again

### Rate Limit Exceeded

**Error Message**:
```
⚠️ Error: Rate limit exceeded
```

**Solution**: Wait a few minutes before sending more messages

---

## Best Practices

### For Users:

1. **Be Specific**: Ask clear, specific questions
2. **One Topic**: Focus on one topic per message
3. **Use Examples**: Provide context when asking complex questions
4. **Check Documentation**: Some questions may be better answered in guides

### For Developers:

1. **API Key Security**: Never commit API keys to version control
2. **Rate Limiting**: Implement rate limiting for production
3. **Error Logging**: Log errors for debugging
4. **User Feedback**: Provide clear error messages to users

---

## Customization

### Changing Bot Name:

**File**: `src/components/features/ScriptBot.tsx`

```tsx
// Line 113: Change header title
<h3 className="font-semibold">Your Bot Name</h3>

// Line 120: Change welcome message
<p>Hello! I'm your custom bot name.</p>
```

### Changing Bot Behavior:

**File**: `src/lib/gemini.ts`

```typescript
// Update system prompt
const systemPrompt = `Your custom instructions here...`;

// Adjust temperature (0.0-1.0)
temperature: 0.5, // More focused

// Adjust max tokens
maxOutputTokens: 2048, // Longer responses
```

### Styling:

**Colors**: Edit Tailwind classes in `ScriptBot.tsx`
- `bg-primary`: Button and header background
- `text-primary-foreground`: Button and header text
- `bg-muted`: Bot message background

**Animations**: Modify CSS in `src/index.css`
```css
.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
```

---

## Performance Optimization

### Current Optimizations:
- ✅ Lazy loading (only loaded when needed)
- ✅ Message debouncing (prevents spam)
- ✅ Conversation history limit (last 10 pairs)
- ✅ Streaming disabled for faster responses

### Future Optimizations:
- [ ] Response caching for common questions
- [ ] Streaming responses for longer answers
- [ ] Message persistence (save history)
- [ ] Typing indicator during response generation

---

## Troubleshooting

### Bot Not Responding?

1. **Check API Key**:
   - Verify `.env` file exists
   - Confirm `VITE_GEMINI_API_KEY` is set
   - Restart dev server after adding key

2. **Check Network**:
   - Open browser DevTools → Network tab
   - Look for failed API requests
   - Check internet connection

3. **Check Console**:
   - Open browser DevTools → Console tab
   - Look for error messages
   - Copy error details for debugging

### Chat Window Not Opening?

1. **Check Floating Button**:
   - Button should be visible at bottom-right
   - Try different screen sizes/zoom levels

2. **Check State**:
   - Button toggles `isOpen` state
   - Click may be blocked by other elements

3. **Clear Cache**:
   - Hard refresh: Ctrl+Shift+R
   - Clear browser cache

### Messages Not Displaying?

1. **Check Styling**:
   - Messages should alternate left/right
   - User messages: right-aligned, blue
   - Bot messages: left-aligned, gray

2. **Check Scroll**:
   - Auto-scroll should bring latest message into view
   - Manually scroll if auto-scroll fails

---

## Security Considerations

### ⚠️ Important Security Notes:

1. **API Key Exposure**:
   - Never commit `.env` file to version control
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Rate Limiting**:
   - Google Gemini API has rate limits
   - Implement request throttling for production
   - Consider usage quotas

3. **User Input**:
   - All user input is sent to external API
   - Don't encourage users to share sensitive data
   - Add disclaimer if needed

4. **CORS and CSP**:
   - Configure Content Security Policy
   - Whitelist Google AI domains

---

## Future Enhancements

### Planned Features:
- [ ] Voice input/output (speech-to-text, text-to-speech)
- [ ] Message history persistence (localStorage/database)
- [ ] Quick action buttons (apply leave, view timetable, etc.)
- [ ] Multi-language support
- [ ] Suggested questions/prompts
- [ ] File attachment support (send screenshots)
- [ ] Admin bot analytics (track popular questions)
- [ ] Context-specific help (different prompts per page)

---

## Code Reference

**Main Component**: `src/components/features/ScriptBot.tsx`  
**API Integration**: `src/lib/gemini.ts`  
**Types**: `src/types/index.ts` (ChatMessage interface)

**Dependencies**:
- `lucide-react`: Icons (MessageCircle, X, Send)
- `@google/generative-ai`: Gemini AI SDK

---

**Last Updated**: January 1, 2026  
**Version**: 1.0 (Script Bot Renamed from ChatBot)
