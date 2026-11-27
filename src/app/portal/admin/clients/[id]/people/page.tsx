import { clientExists } from '@/lib/portal/client-overview';
import { requireStaffPage } from '@/lib/portal/staff-guard';
import { listMembers, MEMBER_ROLE_LABEL, type MemberRole } from '@/lib/portal/members';
import MembersPanel from '@/components/portal/MembersPanel';
import { Panel, Pill, btn } from '@/components/portal/classic/ui';
import { Ctx, Flash, SectionHead } from '@/components/portal/classic/sections';
import { sendResetLinkAction } from '../actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const LOGIN: Record<string, { label: string; tone: 'done' | 'action' | 'muted' | 'attention' }> = {
  ACTIVE: { label: 'Login active', tone: 'done' }, INVITED: { label: 'Invitation not yet accepted', tone: 'action' },
  SUSPENDED: { label: 'Access suspended', tone: 'attention' }, DEACTIVATED: { label: 'Deactivated', tone: 'muted' },
};

export default async function PeopleSection({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ done?: string }> }) {
  await requireStaffPage();
  const { id } = await params;
  const { done } = await searchParams;
  const client = await clientExists(id);
  if (!client) notFound();
  const members = await listMembers(id);
  const active = members.filter(m => m.status === 'ACTIVE');

  return (
    <div>
      <SectionHead clientId={id} title="People & contact details"
        note="Everyone linked to this client, what they can do, and whether their portal login is working. Joint clients and authorised contacts each have their own login." />
      <Flash done={done} />

      <Panel className="mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="hidden border-b border-mist bg-porcelain text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted md:table-header-group">
            <tr><th className="px-5 py-3">Person</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Permissions</th><th className="px-3 py-3">Portal access</th><th className="px-5 py-3 text-right">Access help</th></tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {active.length === 0 ? <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">No people are linked to this client yet.</td></tr> : active.map(m => {
              const primary = m.userId === client.userId;
              const login = LOGIN[m.userStatus] ?? LOGIN.DEACTIVATED;
              return (
                <tr key={m.id} className="align-top md:align-middle">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-navy-ink">{m.fullName}{primary ? <span className="ml-2 align-middle"><Pill tone="waiting">Primary contact</Pill></span> : null}</p>
                    <a href={`mailto:${m.email}`} className="text-xs text-muted hover:text-navy-ink">{m.email}</a>
                    <p className="mt-2 flex flex-wrap gap-2 md:hidden"><span className="text-xs text-muted">{MEMBER_ROLE_LABEL[m.role as MemberRole] ?? m.role}</span><Pill tone={login.tone}>{login.label}</Pill></p>
                  </td>
                  <td className="hidden px-3 py-4 text-ink md:table-cell">{primary ? 'Primary contact' : MEMBER_ROLE_LABEL[m.role as MemberRole] ?? m.role}</td>
                  <td className="hidden px-3 py-4 text-ink md:table-cell">{m.canSign === 1 ? 'Can approve and sign' : 'View only'}</td>
                  <td className="hidden px-3 py-4 md:table-cell"><Pill tone={login.tone}>{login.label}</Pill></td>
                  <td className="px-5 py-4 text-right">
                    {!client.archivedAt && m.userStatus !== 'DEACTIVATED' ? (
                      <form action={sendResetLinkAction}>
                        <Ctx clientId={id} section="people" />
                        <input type="hidden" name="userId" value={m.userId} />
                        <button className={btn.small}>{m.userStatus === 'INVITED' ? 'Resend access link' : 'Send password-reset link'}</button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
      <p className="mt-2 text-xs text-muted">Each link is valid for 24 hours and goes only to that person&apos;s own email address.</p>

      <div className="mt-12">
        <MembersPanel clientId={id} members={members.map(m => ({ id: m.id, userId: m.userId, fullName: m.fullName, email: m.email, role: m.role, canSign: m.canSign === 1, status: m.status, userStatus: m.userStatus, isPrimary: m.userId === client.userId }))} />
      </div>
    </div>
  );
}
