import { useState } from 'react';
import Badge from '../Badge';
import { Button } from '../Form';
import ResidentModal from './ResidentModal';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';

export default function ResidentsTab({ residents, refresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const showToast = useToast();

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(resident) {
    setEditing(resident);
    setModalOpen(true);
  }

  async function handleSave(id, payload) {
    try {
      if (id) {
        await api.updateResident(id, payload);
        showToast('Resident updated.');
      } else {
        await api.createResident(payload);
        showToast('Resident registered.');
      }
      setModalOpen(false);
      refresh();
    } catch (err) {
      showToast(err.data?.error || 'Something went wrong.');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this resident record? This cannot be undone.')) return;
    await api.deleteResident(id);
    showToast('Resident record deleted.');
    refresh();
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-navy-deep">Residents</h2>
        <Button variant="gold" onClick={openAdd}>+ Register Resident</Button>
      </div>

      <div className="rounded-sm border border-line bg-paper-white shadow-[0_2px_10px_rgba(14,34,51,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Name</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Address</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Years</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Status</th>
                <th className="border-b-2 border-line px-3.5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {residents.map((r) => (
                <tr key={r.id} className="hover:bg-gold/5">
                  <td className="border-b border-line px-3.5 py-3">{r.fullName}</td>
                  <td className="border-b border-line px-3.5 py-3">{r.address}</td>
                  <td className="border-b border-line px-3.5 py-3">{r.yearsOfResidency}</td>
                  <td className="border-b border-line px-3.5 py-3"><Badge status={r.status} /></td>
                  <td className="border-b border-line px-3.5 py-3">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {residents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-soft">
                    No residents registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ResidentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingResident={editing}
      />
    </div>
  );
}
