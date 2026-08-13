import { useEffect, useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const getItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/users/`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(getItems(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div className="alert alert-info">Loading users...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        <div className="row g-3">
          {items.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-secondary mb-0">No users found.</div>
            </div>
          ) : (
            items.map((user, index) => (
              <div className="col-md-6 col-xl-4" key={user._id ?? user.id ?? `${user.name ?? 'user'}-${index}`}>
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h6 text-uppercase text-muted">{user.name ?? 'Unnamed user'}</h3>
                    <p className="mb-1"><strong>Email:</strong> {user.email ?? 'N/A'}</p>
                    <p className="mb-1"><strong>Team:</strong> {user.team ?? 'Unassigned'}</p>
                    <p className="mb-0"><strong>Role:</strong> {user.role ?? 'Member'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
