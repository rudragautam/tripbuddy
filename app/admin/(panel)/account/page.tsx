import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/Admin/UserForms";
import { PageHeader, Panel } from "@/components/Admin/ui";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader title="Your account" description={`${user.email} · ${user.role}`} />
      <Panel>
        <h2 className="mb-4 font-semibold">Change password</h2>
        <ChangePasswordForm />
      </Panel>
    </>
  );
}
