'use client';

import type { UIMessage } from '@ai-sdk/react';
import type { ChatStatus } from 'ai';
import { motion } from 'motion/react';

import type { PromptInputMessage } from '@src/components/ai-elements/prompt-input';
import { Chat } from '@src/components/custom/chat';
import ShaderAvatar from '@src/components/custom/shader-avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/components/ui/dialog';
import { cn } from '@src/lib/utils';

interface ChatDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  onReset?: () => void;
  reasoningDurations?: Map<string, number>;
  onReasoningDurationChange?: (messageId: string, partIndex: number, duration: number) => void;
  placeholder?: string;
  inputMinHeight?: string;
  inputMaxHeight?: string;
}

export default function ChatDialog({
  open,
  onOpenChange,
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
  onReset,
  reasoningDurations,
  onReasoningDurationChange,
  placeholder = 'What would you like to explore?',
  inputMinHeight = '20px',
  inputMaxHeight = '100px',
}: ChatDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <motion.button
          key="lumen-chat"
          initial={{ padding: '14px 14px' }}
          whileHover={{ padding: '18px 22px' }}
          whileTap={{ padding: '18px 22px' }}
          transition={{ duration: 1, bounce: 0.6, type: 'spring' }}
          className={cn(
            'border-foreground bg-background/60 supports-[backdrop-filter]:bg-background/60 flex items-center gap-2 rounded-full border p-2 backdrop-blur-xs',
            'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
          type="button"
          aria-label="Open chat with Lumen"
        >
          <ShaderAvatar />
          <span className="font-serif font-bold">Lumen</span>
        </motion.button>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col gap-0 p-0 sm:max-h-[min(90vh,900px)] sm:max-w-2xl"
        onOpenAutoFocus={e => {
          // Prevent auto-focus to avoid scroll-to-top behavior
          e.preventDefault();
        }}
      >
        <DialogHeader className="contents space-y-0 text-left">
          <div className="flex items-center gap-3 border-b px-6 py-2.5">
            <ShaderAvatar />
            <DialogTitle className="flex-1 font-serif text-base font-bold">
              Chat with Lumen
            </DialogTitle>
          </div>
          <div className="flex h-[calc(90vh-80px)] min-h-[500px] flex-col overflow-hidden overflow-y-auto">
            <Chat
              messages={messages}
              status={status}
              input={input}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              onSuggestionClick={onSuggestionClick}
              onRegenerate={onRegenerate}
              onStop={onStop}
              onReset={onReset}
              reasoningDurations={reasoningDurations}
              onReasoningDurationChange={onReasoningDurationChange}
              placeholder={placeholder}
              inputMinHeight={inputMinHeight}
              inputMaxHeight={inputMaxHeight}
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
