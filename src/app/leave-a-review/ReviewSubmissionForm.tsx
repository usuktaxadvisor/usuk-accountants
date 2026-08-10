'use client';

import { useState } from 'react';
import { Field, TextInput, Textarea, Checkbox } from '@/components/library/FormFields';
import { Button } from '@/components/library/primitives';
import { IconStar } from '@/components/ui/icons';

export function ReviewSubmissionForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [engagement, setEngagement] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (submitting) return;
    if (rating < 1) { setError('Please select a star rating.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (message.trim().length < 20) { setError('Please write a few sentences about your experience.'); return; }
    if (!consent) { setError('Please confirm the consent statement so we may publish your review.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/review-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          name: name.trim(),
          email: email.trim() || undefined,
          engagement: engagement.trim() ? `REVIEW SUBMISSION — ${engagement.trim()}` : 'REVIEW SUBMISSION',
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data.ok) setSent(true);
      else setError(data.error ?? 'Something went wrong. Please try again.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center">
        <p className="font-display text-xl font-semibold text-ink">Thank you — review received.</p>
        <p className="mt-2 text-sm text-muted">
          Our team will read and verify it shortly. Once approved, it will appear on our
          reviews page with your first name.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">Your rating <span className="text-signal">*</span></span>
        <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1"
            >
              <IconStar
                className={`h-7 w-7 transition-colors ${star <= (hover || rating) ? 'text-gold' : 'text-mist'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="rv-name" required>
          <TextInput id="rv-name" value={name} onChange={setName} autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="rv-email" hint="Not published — used only to verify you are a genuine client.">
          <TextInput id="rv-email" type="email" inputMode="email" value={email} onChange={setEmail} autoComplete="email" />
        </Field>
      </div>

      <Field label="What did we help you with?" htmlFor="rv-engagement" hint="Optional — e.g. “US–UK tax returns” or “401(k) advice”.">
        <TextInput id="rv-engagement" value={engagement} onChange={setEngagement} />
      </Field>

      <Field label="Your review" htmlFor="rv-message" required hint="Your honest experience, in your own words.">
        <Textarea id="rv-message" value={message} onChange={setMessage} />
      </Field>

      <Checkbox id="rv-consent" checked={consent} onChange={setConsent}>
        I am a genuine client, this review describes my own experience, and I consent to it
        being published with my name.
      </Checkbox>

      {error && (
        <p className="rounded-lg border border-signal/30 bg-signal/[0.06] p-3 text-sm text-signal" role="alert">{error}</p>
      )}

      <Button onClick={submit} withArrow size="lg" className="w-full sm:w-auto">
        {submitting ? 'Sending…' : 'Submit review'}
      </Button>
    </div>
  );
}
