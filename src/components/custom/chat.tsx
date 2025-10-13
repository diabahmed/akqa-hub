'use client';

import type { UIMessage } from '@ai-sdk/react';
import type { ChatStatus } from 'ai';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';
import { Fragment } from 'react';

import { Action, Actions } from '@src/components/ai-elements/actions';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@src/components/ai-elements/conversation';
import { Message, MessageContent } from '@src/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@src/components/ai-elements/prompt-input';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@src/components/ai-elements/reasoning';
import { Response } from '@src/components/ai-elements/response';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@src/components/ai-elements/sources';
import { Suggestion, Suggestions } from '@src/components/ai-elements/suggestion';
import { cn } from '@src/lib/utils';

interface ChatProps {
  messages: UIMessage[];
  status: ChatStatus;
  input: string;
  suggestions?: string[];
  showSuggestions?: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  onSuggestionClick: (suggestion: string) => void;
  onRegenerate: () => void;
  onStop?: () => void;
  placeholder?: string;
  inputMinHeight?: string;
  inputMaxHeight?: string;
}

export function Chat({
  messages,
  status,
  input,
  suggestions = [],
  showSuggestions = false,
  onInputChange,
  onSubmit,
  onSuggestionClick,
  onRegenerate,
  onStop,
  placeholder = 'Ask anything...',
  inputMinHeight = '20px',
  inputMaxHeight = '100px',
}: ChatProps) {
  return (
    <div className="relative mx-auto size-full h-[calc(100vh-3.5rem)] max-w-4xl rounded-lg p-6">
      <div className="flex h-full flex-col">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message, messageIndex) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text': {
                      const isLastMessage = messageIndex === messages.length - 1;
                      const isWelcomeMessage = message.id === 'welcome';

                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message
                            from={message.role}
                            className={cn(
                              message.role === 'assistant' && 'flex-col items-start gap-1',
                            )}
                          >
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                            {message.role === 'assistant' && isLastMessage && !isWelcomeMessage && (
                              <Actions>
                                <Action onClick={() => onRegenerate()} label="Retry">
                                  <RefreshCcwIcon className="size-3" />
                                </Action>
                                <Action copyText={part.text} label="Copy">
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                          </Message>
                        </Fragment>
                      );
                    }
                    case 'reasoning': {
                      const hasReasoningContent = part.text && part.text.trim() !== '';
                      const isCurrentlyStreaming =
                        status === 'streaming' &&
                        i === message.parts.length - 1 &&
                        message.id === messages.at(-1)?.id;

                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="mb-0 w-full"
                          isStreaming={isCurrentlyStreaming}
                          hasContent={!!hasReasoningContent}
                          open={hasReasoningContent ? undefined : false}
                          defaultOpen={!!hasReasoningContent}
                        >
                          <ReasoningTrigger />
                          {hasReasoningContent && <ReasoningContent>{part.text}</ReasoningContent>}
                        </Reasoning>
                      );
                    }
                  }
                })}
                {/* Render citations/sources if present */}
                {message.role === 'assistant' &&
                  message.parts.some(part => part.type === 'source-url') && (
                    <Sources>
                      <SourcesTrigger
                        count={message.parts.filter(part => part.type === 'source-url').length}
                      />
                      {message.parts.map((part, i) => {
                        if (part.type === 'source-url') {
                          return (
                            <SourcesContent key={`${message.id}-source-${i}`}>
                              <Source
                                key={`${message.id}-source-${i}`}
                                href={part.url}
                                title={part.url}
                              />
                            </SourcesContent>
                          );
                        }
                        return null;
                      })}
                    </Sources>
                  )}
              </div>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="relative mx-auto w-full max-w-4xl">
          {showSuggestions && suggestions.length > 0 && (
            <Suggestions className="mt-3 mb-3" aria-label="Example prompts">
              {suggestions.map(suggestion => (
                <Suggestion key={suggestion} onClick={onSuggestionClick} suggestion={suggestion} />
              ))}
            </Suggestions>
          )}
          <PromptInput
            onSubmit={onSubmit}
            className="bg-background/30 supports-[backdrop-filter]:bg-background/30 relative w-full backdrop-blur-xs"
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                placeholder={placeholder}
                onChange={e => onInputChange(e.currentTarget.value)}
                className="placeholder:text-muted-foreground flex-1 resize-none border-0 bg-transparent py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                rows={1}
                style={{
                  minHeight: inputMinHeight,
                  maxHeight: inputMaxHeight,
                }}
              />
            </PromptInputBody>
            <PromptInputToolbar>
              <PromptInputTools>{/* Model selector, web search, etc. */}</PromptInputTools>
              <PromptInputSubmit
                status={status === 'streaming' ? 'streaming' : 'ready'}
                disabled={!input.trim() && status !== 'streaming'}
                variant="ghost"
                size="icon-sm"
                onClick={
                  status === 'streaming'
                    ? e => {
                        e.preventDefault();
                        onStop?.();
                      }
                    : undefined
                }
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
