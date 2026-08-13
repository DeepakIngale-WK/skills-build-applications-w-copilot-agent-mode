import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_CODESPACE_NAME
  ? 'https://refactored-winner-4vvvgqrvvqq3q649-8000.app.github.dev/api/activities/'
  : 'http://localhost:8000/api/activities/';

const getItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function Activities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(getItems(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load activities.');
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  if (loading) return <div className="alert alert-info">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        <div className="list-group">
          {items.length === 0 ? (
            <div className="alert alert-secondary mb-0">No activities found.</div>
          ) : (
            items.map((activity, index) => (
              <div className="list-group-item" key={activity._id ?? activity.id ?? `${activity.type ?? 'activity'}-${index}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="h6 mb-1">{activity.type ?? 'Activity'}</h3>
                    <p className="mb-0 text-muted">{activity.description ?? 'No description provided.'}</p>
                  </div>
                  <span className="badge bg-primary rounded-pill">{activity.duration ?? activity.minutes ?? 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
