"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import TripTable from "@/components/admin/trips/TripTable";
import TripFilters from "@/components/admin/trips/TripFilters";
import TripModal from "@/components/admin/trips/TripModal";

export default function TripsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Trips"
        description="Manage travel packages and destinations"
        actionLabel="Add Trip"
        onAction={() => setOpen(true)}
      />

      <TripFilters />
      <TripTable />

      {open && <TripModal onClose={() => setOpen(false)} />}
    </div>
  );
}