'use client';

import { useState } from 'react';
import { Button } from '@/components/library/primitives';
import {
  Field, TextInput, Select, Textarea, Checkbox, JURISDICTION_OPTIONS,
} from '@/components/library/FormFields';
import { IconCheck, IconShield, IconArrowRight } from '@/components/ui/icons';
import { submitLead, analytics } from '@/lib/analytics';

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ============================================================
   1. ContactForm — full enquiry form (contact page, service pages)
   ============================================================ */
export function ContactForm({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [data, setData] = useState({ name: '', email: '', situation: '', message: '', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (k: string, v: string | boolean) => setData((d) => ({ ...d, [k]: v }));

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = 'Please enter your name.';
    if (!isEmail(data.email)) e.email = 'Enter a valid email address.';
    if (!data.situation) e.situation = 'Select the option that fits best.';
    if (!data.consent) e.consent = 'Please accept to continue.';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    const res = await submitLead({
      type: 'contact',
      name: data.name,
      email: data.email,
      situation: data.situation,
      message: data.message,
      source: 'contact_form',
    });
    setSubmitting(false);
    if (res.ok) {
      if (typeof window !== 'undefined') window.location.href = '/thank-you/contact';
      else setSent(true);
    } else setSubmitError(res.error ?? 'Something went wrong. Please try again or call us.');
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold-antique">
          <IconCheck className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">Thank you — message received</h3>
        <p className="mt-2 text-sm text-muted">A cross-border specialist will reply within one business day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" required error={errors.name} tone={tone}>
          <TextInput id="name" value={data.name} onChange={(v) => set('name', v)} error={errors.name} autoComplete="name" tone={tone} />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email} tone={tone}>
          <TextInput id="email" type="email" inputMode="email" value={data.email} onChange={(v) => set('email', v)} error={errors.email} autoComplete="email" tone={tone} />
        </Field>
      </div>
      <Field label="Your situation" htmlFor="situation" required error={errors.situation} tone={tone}>
        <Select id="situation" value={data.situation} onChange={(v) => set('situation', v)} options={JURISDICTION_OPTIONS} placeholder="Select what fits you best" error={errors.situation} tone={tone} />
      </Field>
      <Field label="How can we help?" htmlFor="message" hint="A sentence or two is plenty to get started." tone={tone}>
        <Textarea id="message" value={data.message} onChange={(v) => set('message', v)} tone={tone} />
      </Field>
      <Checkbox id="consent" checked={data.consent} onChange={(v) => set('consent', v)} tone={tone}>
        I agree to be contacted about my enquiry. No spam, ever.
      </Checkbox>
      {errors.consent && <p className="text-xs text-signal" role="alert">{errors.consent}</p>}
      {submitError && (
        <p className="rounded-lg border border-signal/30 bg-signal/[0.06] p-3 text-sm text-signal" role="alert">
          {submitError}
        </p>
      )}
      <Button onClick={submit} withArrow size="lg" className="w-full sm:w-auto">
        {submitting ? 'Sending…' : 'Send message'}
      </Button>
      <p className={`flex items-center gap-1.5 text-xs ${tone === 'dark' ? 'text-softwhite/50' : 'text-muted'}`}>
        <IconShield className="h-3.5 w-3.5 text-gold" /> Secure &amp; confidential · We reply within one business day
      </p>
    </div>
  );
}

/* ============================================================
   2. LeadCaptureForm — compact inline email capture (guides, calculators, blog)
   ============================================================ */
export function LeadCaptureForm({
  cta = 'Get the guide',
  placeholder = 'you@email.com',
  note = 'No spam. Unsubscribe anytime.',
  tone = 'light',
  source = 'lead_magnet',
  leadType = 'lead',
  onSubmit,
}: {
  cta?: string;
  placeholder?: string;
  note?: string;
  tone?: 'light' | 'dark';
  source?: string;
  leadType?: 'lead' | 'newsletter';
  onSubmit?: (email: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!isEmail(email)) { setError('Enter a valid email address.'); return; }
    setError('');
    setSubmitting(true);
    const res = await submitLead({ type: leadType, email, source });
    setSubmitting(false);
    if (res.ok) {
      setSent(true);
      onSubmit?.(email);
    } else {
      setError(res.error ?? 'Something went wrong. Please try again.');
    }
  };

  if (sent) {
    return (
      <p className={`flex items-center gap-2 text-sm font-medium ${tone === 'dark' ? 'text-gold-champagne' : 'text-gold-antique'}`}>
        <IconCheck className="h-4 w-4" /> On its way — check your inbox.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          type="email"
          inputMode="email"
          aria-label="Email address"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          className={`min-h-[48px] flex-1 rounded-lg border px-4 text-sm focus:outline-none ${
            tone === 'dark'
              ? 'border-navy-slate bg-navy-ink/60 text-white placeholder:text-softwhite/40 focus:border-gold'
              : 'border-mist bg-white text-ink placeholder:text-muted/60 focus:border-gold'
          } ${error ? 'border-signal' : ''}`}
        />
        <Button onClick={submit} withArrow>{cta}</Button>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-signal" role="alert">{error}</p>
      ) : (
        <p className={`mt-1.5 text-xs ${tone === 'dark' ? 'text-softwhite/50' : 'text-muted'}`}>{note}</p>
      )}
    </div>
  );
}

/* ============================================================
   3. BookingForm — multi-step consultation form with progress
   ============================================================ */
const STEPS = ['Your situation', 'Your details', 'Confirm'];

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ situation: '', name: '', email: '', phone: '', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const set = (k: string, v: string | boolean) => setData((d) => ({ ...d, [k]: v }));

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !data.situation) e.situation = 'Please choose one to continue.';
    if (step === 1) {
      if (!data.name.trim()) e.name = 'Please enter your name.';
      if (!isEmail(data.email)) e.email = 'Enter a valid email address.';
    }
    if (step === 2 && !data.consent) e.consent = 'Please accept to confirm.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) {
      const newStep = Math.min(step + 1, STEPS.length - 1);
      analytics.bookingStep(newStep + 1, STEPS[newStep]);
      setStep(newStep);
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    const res = await submitLead({
      type: 'booking',
      name: data.name,
      email: data.email,
      phone: data.phone,
      situation: data.situation,
      source: 'booking_form',
    });
    setSubmitting(false);
    if (res.ok) {
      if (typeof window !== 'undefined') window.location.href = '/thank-you/booking';
      else setDone(true);
    } else setSubmitError(res.error ?? 'Something went wrong. Please try again or call us.');
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold-antique">
          <IconCheck className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">You&apos;re booked in</h3>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve sent a confirmation to {data.email}. A specialist will be in touch to lock the time.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
      {/* Progress */}
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted">
          <span>{STEPS[step]}</span>
          <span>Step {step + 1} of {STEPS.length}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-gold-champagne transition-all duration-500 ease-premium"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <Field label="Which best describes you?" htmlFor="b-situation" required error={errors.situation}>
          <Select id="b-situation" value={data.situation} onChange={(v) => set('situation', v)} options={JURISDICTION_OPTIONS} placeholder="Select what fits you best" error={errors.situation} />
        </Field>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <Field label="Full name" htmlFor="b-name" required error={errors.name}>
            <TextInput id="b-name" value={data.name} onChange={(v) => set('name', v)} error={errors.name} autoComplete="name" />
          </Field>
          <Field label="Email" htmlFor="b-email" required error={errors.email}>
            <TextInput id="b-email" type="email" inputMode="email" value={data.email} onChange={(v) => set('email', v)} error={errors.email} autoComplete="email" />
          </Field>
          <Field label="Phone" htmlFor="b-phone" hint="Optional — helps us reach you across timezones.">
            <TextInput id="b-phone" type="tel" inputMode="tel" value={data.phone} onChange={(v) => set('phone', v)} autoComplete="tel" />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-lg bg-porcelain p-4 text-sm">
            <p className="text-muted">Booking a free 15-minute consultation for:</p>
            <p className="mt-1 font-medium text-ink">{data.name} · {data.email}</p>
          </div>
          <Checkbox id="b-consent" checked={data.consent} onChange={(v) => set('consent', v)}>
            I agree to be contacted to arrange my consultation.
          </Checkbox>
          {errors.consent && <p className="text-xs text-signal" role="alert">{errors.consent}</p>}
        </div>
      )}

      {submitError && (
        <p className="mt-4 rounded-lg border border-signal/30 bg-signal/[0.06] p-3 text-sm text-signal" role="alert">
          {submitError}
        </p>
      )}

      <div className="mt-7 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button onClick={back} className="text-sm font-medium text-muted transition-colors hover:text-ink">← Back</button>
        ) : <span />}
        {step < STEPS.length - 1 ? (
          <Button onClick={next} withArrow>Continue</Button>
        ) : (
          <Button onClick={finish}>
            {submitting ? 'Confirming…' : 'Confirm booking'}
            {!submitting && <IconArrowRight className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}
