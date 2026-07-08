import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar, { TopbarButton } from '../components/Topbar';
import OverviewTab from '../components/admin/OverviewTab';
import ResidentsTab from '../components/admin/ResidentsTab';
import RequestsTab from '../components/admin/RequestsTab';
import { api } from '../api';

const NAV = [
  { key: 'overview', label: 'Overview' },
  { key: 'residents', label: 'Residents' },
  { key: 'requests', label: 'Certificate Requests' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [tab, setTab] = useState('overview');
  const [residents, setResidents] = useState([]);
  const [requests, setRequests] = useState([]);

  const refresh = useCallback(async () => {
    const [residentsData, requestsData] = await Promise.all([api.listResidents(), api.listRequests()]);
    setResidents(residentsData);
    setRequests(requestsData);
  }, []);

  useEffect(() => {
    api.me()
      .then((data) => {
        setUsername(data.username);
        setChecking(false);
        refresh();
      })
      .catch(() => navigate('/admin/login'));
  }, [navigate, refresh]);

  async function handleLogout() {
    await api.logout();
    navigate('/admin/login');
  }

  if (checking) return null;

  return (
    <div>
      <Topbar
        subtitle="Admin Dashboard"
        actions={
          <>
            <span className="mr-2.5 text-sm text-gold-light">{username}</span>
            <TopbarButton onClick={handleLogout}>Log Out</TopbarButton>
          </>
        }
      />
      <div className="grid min-h-[calc(100vh-68px)] grid-cols-[220px_1fr]">
        <div className="bg-navy-deep py-6.5 text-white">
          {NAV.map((item) => (
            <a
              key={item.key}
              href="#"
              onClick={(e) => { e.preventDefault(); setTab(item.key); }}
              className={`block border-l-[3px] px-6.5 py-3 text-[14.5px] no-underline ${
                tab === item.key
                  ? 'border-gold bg-white/[0.06] font-semibold text-white'
                  : 'border-transparent text-white/75 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="p-9">
          {tab === 'overview' && <OverviewTab residents={residents} requests={requests} />}
          {tab === 'residents' && <ResidentsTab residents={residents} refresh={refresh} />}
          {tab === 'requests' && <RequestsTab requests={requests} residents={residents} refresh={refresh} />}
        </div>
      </div>
    </div>
  );
}
