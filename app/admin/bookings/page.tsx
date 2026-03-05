"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import BookingTable from "@/components/admin/bookings/BookingTable";
import BookingFilters from "@/components/admin/bookings/BookingFilters";
import BookingDetailsModal from "@/components/admin/bookings/BookingDetailsModal";

export default function BookingsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Manage trip reservations"
      />

      <BookingFilters />
      <BookingTable onView={() => setOpen(true)} />

      {open && (
        <BookingDetailsModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
}