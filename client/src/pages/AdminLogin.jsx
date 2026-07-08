import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar, { TopbarLink } from '../components/Topbar';
import { api } from '../api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.data?.error || 'Login failed.');
    }
  }

  return (
    <div>
      <Topbar actions={<TopbarLink to="/">&larr; Home</TopbarLink>} />
      <div className="mx-auto mt-20 max-w-[400px] rounded-sm border border-line bg-paper-white p-10 shadow-[0_2px_10px_rgba(14,34,51,0.08)]">
        <h2 className="mb-1 font-display text-xl text-navy-deep">Staff Sign In</h2>
        <p className="mt-1 text-sm text-ink-soft">Access the barangay administration dashboard.</p>

        <form onSubmit={onSubmit}>
          <label className="mb-1.5 mt-3.5 block text-[13px] font-semibold text-ink-soft">Username</label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-sm border border-line bg-paper-white px-3 py-2.5 text-[14.5px] focus:border-gold focus:outline focus:outline-2 focus:outline-gold-light"
          />

          <label className="mb-1.5 mt-3.5 block text-[13px] font-semibold text-ink-soft">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-line bg-paper-white px-3 py-2.5 text-[14.5px] focus:border-gold focus:outline focus:outline-2 focus:outline-gold-light"
          />

          <div className="mt-5.5">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-sm bg-navy-deep px-5 py-2.5 text-[14.5px] font-semibold text-white hover:bg-navy"
            >
              Sign In
            </button>
          </div>
          {error && <div className="mt-2.5 text-[13.5px] text-red">{error}</div>}
          <div className="mt-1.5 text-[12.5px] text-ink-soft">
            Demo credentials — username: <strong>admin</strong>, password: <strong>admin123</strong>
          </div>
        </form>
      </div>
    </div>
  );
}
