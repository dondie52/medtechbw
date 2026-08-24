'use client';

import { Button, Modal } from '@/components/ui';

/**
 * Cancelling an emergency is the most dangerous thing a patient can do by
 * accident, so it takes two deliberate actions and the safe option is the
 * prominent one. The dialog cannot be dismissed by tapping the backdrop or
 * pressing Escape - a choice has to be made.
 */
export function ConfirmCancelEmergency({
  open,
  onKeepActive,
  onConfirmCancel,
}: {
  open: boolean;
  onKeepActive: () => void;
  onConfirmCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onKeepActive}
      dismissible={false}
      labelledBy="cancel-emergency-title"
      describedBy="cancel-emergency-detail"
    >
      <h2 id="cancel-emergency-title" className="text-xl font-bold text-ink">
        Cancel this emergency request?
      </h2>
      <p id="cancel-emergency-detail" className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        Only cancel if emergency assistance is no longer needed.
      </p>

      <div className="mt-6 space-y-2">
        <Button variant="primary" size="lg" fullWidth onClick={onKeepActive} autoFocus>
          Keep emergency active
        </Button>
        <Button variant="destructive-text" size="md" fullWidth onClick={onConfirmCancel}>
          Yes, cancel request
        </Button>
      </div>
    </Modal>
  );
}
