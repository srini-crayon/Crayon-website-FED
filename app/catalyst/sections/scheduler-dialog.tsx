"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "../../../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

type SchedulerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: Date | null;
  onConfirm: (slot: Date | null) => void;
};

export function SchedulerDialog({ open, onOpenChange, selectedSlot, onConfirm }: SchedulerDialogProps) {
  const [slot, setSlot] = useState<Date | null>(selectedSlot);

  useEffect(() => {
    setSlot(selectedSlot);
  }, [selectedSlot]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book time with an AI Execution Expert</DialogTitle>
          <DialogDescription>
            Pick a date to trigger scheduling outreach. Internal notifications go to Suresh, Priyanshu, Ajoy, and TK.
          </DialogDescription>
        </DialogHeader>
        {/* Placeholder: swap Calendar with actual scheduler embed when available */}
        <div className="rounded-xl border border-dashed border-slate-200 p-4">
          <Calendar
            mode="single"
            selected={slot ?? undefined}
            onSelect={(value) => setSlot(value ?? null)}
            className="mx-auto"
          />
          <p className="mt-3 text-xs text-slate-500">
            Selected slot: {slot ? format(slot, "PPP") : "None yet"}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(slot);
              onOpenChange(false);
            }}
            disabled={!slot}
          >
            Confirm & Notify
          </Button>
        </DialogFooter>
        {/* Placeholder email hook: integrate real email service here */}
      </DialogContent>
    </Dialog>
  );
}

