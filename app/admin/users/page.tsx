"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import UserTable from "@/components/admin/users/UserTable";
import UserFilters from "@/components/admin/users/UserFilters";
import UserModal from "@/components/admin/users/UserModal";

export default function UsersPage() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage platform users"
        actionLabel="Add User"
        onAction={() => setOpen(true)}
      />

      <UserFilters />
      <UserTable />

      {open && <UserModal onClose={() => setOpen(false)} />}
    </div>
  );
}