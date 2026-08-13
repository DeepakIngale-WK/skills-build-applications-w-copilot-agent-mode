import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  return codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
};

const getItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function Workouts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/workouts/`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(getItems(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load workouts.');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  if (loading) return <div className="alert alert-info">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Workouts</h2>
        <div className="row g-3">
          {items.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-secondary mb-0">No workouts found.</div>
            </div>
          ) : (
            items.map((workout, index) => (
              <div className="col-md-6 col-xl-4" key={workout._id ?? workout.id ?? `${workout.name ?? 'workout'}-${index}`}>
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h6 text-uppercase text-muted">{workout.name ?? 'Workout'}</h3>
                    <p className="mb-1"><strong>Type:</strong> {workout.type ?? 'General'}</p>
                    <p className="mb-1"><strong>Duration:</strong> {workout.duration ?? workout.minutes ?? 'N/A'}</p>
                    <p className="mb-0"><strong>Focus:</strong> {workout.focus ?? 'General fitness'}</p>
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
