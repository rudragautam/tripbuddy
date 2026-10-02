import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { updateUser } from "@/app/admin/actions/users";
import { CreateUserForm, ResetPasswordForm } from "@/components/Admin/UserForms";
import { formatDateTime, PageHeader, Panel } from "@/components/Admin/ui";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireUser("admin");
  const db = await getDb();
  const rows = await db.select().from(users).orderBy(asc(users.name));

  return (
    <>
      <PageHeader title="Users" description="Editors manage content and enquiries. Admins can also manage users." />
      <Panel className="mb-6">
        <h2 className="mb-4 font-semibold">Add a user</h2>
        <CreateUserForm />
      </Panel>
      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-black/5 text-xs text-t-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Last sign-in</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Password</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((u) => {
              const self = u.id === me.id;
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <span className="font-medium">{u.name}</span>
                    {self && <span className="ml-2 text-xs text-t-muted">(you)</span>}
                    <span className="block text-xs text-t-muted">{u.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateUser} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="op" value="toggle-role" />
                      <span className="capitalize">{u.role}</span>
                      {!self && (
                        <button type="submit" className="text-xs font-semibold text-t-accent">
                          Make {u.role === "admin" ? "editor" : "admin"}
                        </button>
                      )}
                    </form>
                  </td>
                  <td className="px-4 py-3 text-t-muted">{u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never"}</td>
                  <td className="px-4 py-3">
                    <form action={updateUser} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="op" value="toggle-active" />
                      <span className={u.active ? "text-emerald-700" : "text-t-muted"}>{u.active ? "Active" : "Deactivated"}</span>
                      {!self && (
                        <button type="submit" className="text-xs font-semibold text-t-accent">
                          {u.active ? "Deactivate" : "Reactivate"}
                        </button>
                      )}
                    </form>
                  </td>
                  <td className="px-4 py-3">{!self && <ResetPasswordForm id={u.id} />}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
