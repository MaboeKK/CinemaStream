import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

// Generic confirmation dialog for admin mutating actions -- the only
// reusable modal pattern in the app; TrailerModal is bespoke to trailers
// and isn't a fit here. `danger` swaps the confirm button to the error
// palette color for destructive actions (suspend/ban/role change).
function ConfirmDialog({ open, title, body, confirmLabel = 'Confirm', danger = false, submitting = false, onConfirm, onClose }) {
  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color={danger ? 'error' : 'primary'} variant="contained" disabled={submitting}>
          {submitting ? 'Working…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
