'use client';

import { useState } from 'react';

export function AssignmentSubmissionForm({ assignmentId }: { assignmentId: string }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const response = await fetch(`/api/assignments/${assignmentId}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    setSubmitting(false);
    if (response.ok) {
      setMessage('Submission uploaded successfully');
      setText('');
    } else {
      const body = await response.json();
      setMessage(body?.error?.message || 'Failed to submit');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
      <textarea
        name="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste your repo link or summary"
        className="h-32 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? 'Submitting…' : 'Upload submission'}
      </button>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </form>
  );
}
