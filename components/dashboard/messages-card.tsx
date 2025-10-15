'use client';

import { useUIStore } from '@/lib/stores/ui-store';

export type MessagePreview = {
  id: string;
  title: string;
  snippet: string;
  unread: boolean;
};

export function MessagesCard({ title, messages }: { title: string; messages: MessagePreview[] }) {
  const { isChatOpen, toggleChat } = useUIStore();

  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <button
          type="button"
          onClick={toggleChat}
          className="rounded-full bg-brand-500/90 px-4 py-1 text-xs font-semibold text-white shadow-sm"
        >
          {isChatOpen ? 'Hide' : 'Open'} chat
        </button>
      </div>
      <ul className="mt-6 space-y-4 text-sm">
        {messages.map((message) => (
          <li key={message.id} className="rounded-xl border border-slate-200/60 p-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900 dark:text-white">{message.title}</span>
              {message.unread && <span className="rounded-full bg-brand-500 px-2 py-1 text-[10px] uppercase text-white">New</span>}
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{message.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
