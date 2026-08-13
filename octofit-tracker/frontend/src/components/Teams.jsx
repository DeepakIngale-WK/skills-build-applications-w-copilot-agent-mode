import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_CODESPACE_NAME
  ? 'https://refactored-winner-4vvvgqrvvqq3q649-8000.app.github.dev/api/teams/'
  : 'http://localhost:8000/api/teams/';

const getItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function Teams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setItems(getItems(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load teams.');
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  if (loading) return <div className="alert alert-info">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>
        <div className="row g-3">
          {items.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-secondary mb-0">No teams found.</div>
            </div>
          ) : (
            items.map((team, index) => (
              <div className="col-md-6" key={team._id ?? team.id ?? `${team.name ?? 'team'}-${index}`}>
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h5">{team.name ?? 'Team'}</h3>
                    <p className="mb-1"><strong>Members:</strong> {Array.isArray(team.members) ? team.members.length : team.memberCount ?? 0}</p>
                    <p className="mb-0"><strong>Coach:</strong> {team.coach ?? 'TBD'}</p>
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
