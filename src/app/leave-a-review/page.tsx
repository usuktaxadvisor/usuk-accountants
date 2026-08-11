import type { Metadata } from 'next';
import Link from 'next/link';
import { ReviewSubmissionForm } from './ReviewSubmissionForm';

export const metadata: Metadata = {
  title: 'Leave a Review | US UK Accountants',
  description:
    'Share your honest experience of working with US UK Accountants. Genuine client reviews only — every submission is read and verified before publication.',
  robots: { index: false, follow: true },
};

export default function LeaveAReviewPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Leave a review</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Thank you for taking the time. Please share your honest experience of working with
        us — positive or critical, it genuinely helps us and helps others decide. We only
        publish genuine client reviews: your submission is read by our team, verified
        against our client records, and published with your first name (never your email
        or contact details).
      </p>
      <div className="mt-10">
        <ReviewSubmissionForm />
      </div>
      <p className="mt-8 text-xs leading-relaxed text-muted">
        By submitting, you confirm you are a genuine client describing your own
        experience, and you consent to your review (name and review text) being published
        on this website. We never edit the substance of a review. See our{' '}
        <Link href="/review-policy" className="underline hover:text-gold-antique">review policy</Link>.
      </p>
    </main>
  );
}
