'use client';

import type { UIMessage } from '@ai-sdk/react';
import { useChat } from '@ai-sdk/react';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import type { PromptInputMessage } from '@src/components/ai-elements/prompt-input';
import ChatDialog from '@src/components/custom/chat-dialog';

const suggestions = [
  'Summarize this article',
  'What are related articles?',
  'Search for articles about art',
  'Tell me more about this post',
];

const initialMessages: UIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: "Hi I'm Lumen—your curatorial companion!\n\nAsk me to distill a story, illuminate connections between pieces, or guide you toward your next discovery.",
      },
    ],
  },
];

export function ChatWidget() {
  const pathname = usePathname();
  const params = useParams();
  const [input, setInput] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reasoningDurations, setReasoningDurations] = useState<Map<string, number>>(new Map());

  // Extract context from URL
  const currentSlug = pathname?.split('/').pop();
  const locale = (params?.locale as string) || 'en-US';

  const { messages, sendMessage, status, regenerate, stop, setMessages } = useChat({
    messages: initialMessages,
    onError: error => {
      toast.error('Something went wrong', {
        description: error.message || 'Failed to get a response. Please try again.',
      });
    },
  });

  // Count only user messages (excluding system/assistant greetings)
  const userMessageCount = messages.filter(msg => msg.role === 'user').length;

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) {
      return;
    }

    // Add context as metadata (not visible to user, sent to API)
    const metadata: Record<string, any> = {};
    if (currentSlug && !pathname?.includes('/admin')) {
      metadata.currentSlug = currentSlug;
      metadata.locale = locale;
    }

    sendMessage({
      text: message.text,
      metadata,
    });
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleStop = () => {
    stop();
    // Remove the last incomplete assistant message
    setMessages(prev => {
      if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setInput('');
    setReasoningDurations(new Map());
    toast.success('Conversation cleared', {
      description: 'Starting a fresh conversation with Lumen.',
    });
  };

  const handleReasoningDurationChange = (
    messageId: string,
    partIndex: number,
    duration: number,
  ) => {
    setReasoningDurations(prev => {
      const next = new Map(prev);
      next.set(`${messageId}-${partIndex}`, duration);
      return next;
    });
  };

  return (
    <ChatDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      messages={messages}
      status={status}
      input={input}
      suggestions={suggestions}
      showSuggestions={userMessageCount === 0}
      onInputChange={setInput}
      onSubmit={handleSubmit}
      onSuggestionClick={handleSuggestionClick}
      onRegenerate={regenerate}
      onStop={handleStop}
      onReset={handleReset}
      reasoningDurations={reasoningDurations}
      onReasoningDurationChange={handleReasoningDurationChange}
      placeholder="What would you like to explore?"
      inputMinHeight="20px"
      inputMaxHeight="100px"
    />
  );
}
