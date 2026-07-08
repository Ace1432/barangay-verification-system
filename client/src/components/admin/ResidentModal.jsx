import { useEffect, useState } from 'react';
import Modal from '../Modal';
import { Field, TextInput, Select, TextArea, Button } from '../Form';

const BLANK = {
  fullName: '', address: '', birthdate: '', civilStatus: 'Single',
  contactNumber: '', yearsOfResidency: 0, occupation: '', status: 'pending', notes: '',
};

export default function ResidentModal({ open, onClose, onSave, editingResident }) {
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    if (editingResident) {
      setForm({ ...BLANK, ...editingResident });
    } else {
      setForm(BLANK);
    }
  }, [editingResident, open]);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSave(editingResident ? editingResident.id : null, form);
  }

  return (
    <Modal open={open} onClose={onClose} title={editingResident ? 'Edit Resident' : 'Register Resident'}>
      <form onSubmit={submit}>
        <Field label="Full Name">
          <TextInput required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
        </Field>
        <Field label="Address">
          <TextInput required value={form.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
        <Field label="Birthdate">
          <TextInput type="date" value={form.birthdate} onChange={(e) => set('birthdate', e.target.value)} />
        </Field>
        <Field label="Civil Status">
          <Select value={form.civilStatus} onChange={(e) => set('civilStatus', e.target.value)}>
            <option>Single</option>
            <option>Married</option>
            <option>Widowed</option>
            <option>Separated</option>
          </Select>
        </Field>
        <Field label="Contact Number">
          <TextInput value={form.contactNumber} onChange={(e) => set('contactNumber', e.target.value)} />
        </Field>
        <Field label="Years of Residency">
          <TextInput type="number" min="0" value={form.yearsOfResidency} onChange={(e) => set('yearsOfResidency', e.target.value)} />
        </Field>
        <Field label="Occupation">
          <TextInput value={form.occupation} onChange={(e) => set('occupation', e.target.value)} />
        </Field>
        <Field label="Verification Status">
          <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
          </Select>
        </Field>
        <Field label="Notes">
          <TextArea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </Field>

        <div className="mt-5.5 flex gap-2.5">
          <Button type="submit" variant="primary">Save Resident</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
