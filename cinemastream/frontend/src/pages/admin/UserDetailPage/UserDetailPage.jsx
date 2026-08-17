import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { toast } from 'react-toastify';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminNavbar from '../../../components/admin/AdminNavbar';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import adminApi from '../../../api/adminApi';
import { useAuth } from '../../../context/AuthContext';
import './UserDetailPage.scss';

const buildConfirmCopy = (type, detail) => {
  if (!type || !detail) return null;
  const name = `${detail.first_name} ${detail.last_name}`;
  switch (type) {
    case 'suspend':
      return { title: 'Suspend user', body: `Suspend ${name}?`, confirmLabel: 'Suspend', danger: true };
    case 'ban':
      return { title: 'Ban user', body: `Ban ${name}?`, confirmLabel: 'Ban', danger: true };
    case 'reactivate':
      return { title: 'Reactivate user', body: `Restore ${name}'s account to active?`, confirmLabel: 'Reactivate' };
    case 'force-logout':
      return { title: 'Force logout', body: `Sign ${name} out of every active session?`, confirmLabel: 'Sign out', danger: true };
    case 'verify-email':
      return { title: 'Verify email', body: `Mark ${name}'s email as verified?`, confirmLabel: 'Verify' };
    case 'reset-password':
      return { title: 'Trigger password reset', body: `Email ${name} a password reset link?`, confirmLabel: 'Send reset' };
    default:
      return null;
  }
};

function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getUserDetail(id)
      .then(setDetail)
      .catch((err) => {
        console.error('Failed to load user detail', err);
        toast.error(err.message || 'Failed to load user');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isSelf = currentUser && detail && currentUser.user_id === Number(id);
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const runPending = async () => {
    if (!pendingAction) return;
    setSubmitting(true);
    try {
      if (pendingAction === 'suspend') await adminApi.changeUserStatus(id, 'suspended');
      else if (pendingAction === 'ban') await adminApi.changeUserStatus(id, 'banned');
      else if (pendingAction === 'reactivate') await adminApi.changeUserStatus(id, 'active');
      else if (pendingAction === 'force-logout') await adminApi.forceLogoutUser(id);
      else if (pendingAction === 'verify-email') await adminApi.verifyUserEmail(id);
      else if (pendingAction === 'reset-password') await adminApi.triggerPasswordReset(id);

      toast.success('Done.');
      setPendingAction(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-userDetail">
      <AdminSidebar />
      <div className="admin-userDetailContainer">
        <AdminNavbar />

        {loading || !detail ? (
          <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
        ) : (
          <>
            <div className="profile-card">
              <div className="profile-fields">
                <div className="profile-field">
                  <label>Name</label>
                  <span>
                    {detail.first_name} {detail.last_name}
                  </span>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <span>{detail.email}</span>
                </div>
                <div className="profile-field">
                  <label>Role</label>
                  <span>{detail.role}</span>
                </div>
                <div className="profile-field">
                  <label>Status</label>
                  <span>
                    {detail.status}
                    {detail.status_reason ? ` — ${detail.status_reason}` : ''}
                  </span>
                </div>
                <div className="profile-field">
                  <label>Verified</label>
                  <span>{detail.is_verified ? 'Yes' : 'No'}</span>
                </div>
                <div className="profile-field">
                  <label>Joined</label>
                  <span>{new Date(detail.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <Stack className="profile-actions" direction="row" spacing={1} flexWrap="wrap">
                <Button size="small" variant="outlined" onClick={() => navigate('/admin/users')}>
                  Back to users
                </Button>
                {!detail.is_verified && (
                  <Button size="small" variant="outlined" onClick={() => setPendingAction('verify-email')}>
                    Verify email
                  </Button>
                )}
                <Button size="small" variant="outlined" onClick={() => setPendingAction('reset-password')}>
                  Trigger password reset
                </Button>
                {isSuperAdmin && !isSelf && (
                  <>
                    {detail.status === 'active' ? (
                      <>
                        <Button size="small" color="warning" variant="outlined" onClick={() => setPendingAction('suspend')}>
                          Suspend
                        </Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => setPendingAction('ban')}>
                          Ban
                        </Button>
                      </>
                    ) : (
                      <Button size="small" variant="outlined" onClick={() => setPendingAction('reactivate')}>
                        Reactivate
                      </Button>
                    )}
                    <Button size="small" color="error" variant="outlined" onClick={() => setPendingAction('force-logout')}>
                      Force logout
                    </Button>
                  </>
                )}
              </Stack>
            </div>

            <div className="history-section">
              <h3>Recent watch history</h3>
              <div className="history-list">
                {detail.watchHistory.length === 0 && <span>No watch history.</span>}
                {detail.watchHistory.map((item, i) => (
                  <div className="history-row" key={i}>
                    <span>{item.movie_title || item.series_name}</span>
                    <span>{new Date(item.watched_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="history-section">
              <h3>Recent login history</h3>
              <div className="history-list">
                {detail.loginHistory.length === 0 && <span>No login history.</span>}
                {detail.loginHistory.map((item, i) => (
                  <div className="history-row" key={i}>
                    <span>
                      {item.ip_address || 'unknown IP'} — {item.was_successful ? 'success' : 'failed'}
                    </span>
                    <span>
                      {new Date(item.login_time).toLocaleString()}
                      {item.logout_time ? ` → ${new Date(item.logout_time).toLocaleString()}` : ' (open)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        submitting={submitting}
        onClose={() => setPendingAction(null)}
        onConfirm={runPending}
        {...(buildConfirmCopy(pendingAction, detail) || {})}
      />
    </div>
  );
}

export default UserDetailPage;
