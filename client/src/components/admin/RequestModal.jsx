import { useEffect, useState } from 'react';
import Modal from '../Modal';
import { Field, TextInput, Select, Button } from '../Form';
import { CERT_LABELS } from '../../api';

export default function RequestModal({ open, onClose, onSubmit, residents }) {
  const [residentId, setResidentId] = useState('');
  const [certificateType, setCertificateType] = useState('barangay_clearance');
  const [purpose, setPurpose] = useState('');
  const [extra, setExtra] = useState({});

  useEffect(() => {
    if (open) {
      setResidentId(residents[0]?.id || '');
      setCertificateType('barangay_clearance');
      setPurpose('');
      setExtra({});
    }
  }, [open]);

  const selectedResident = residents.find((r) => String(r.id) === String(residentId));

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ residentId, certificateType, purpose, extra });
  }

  return (
    <Modal open={open} onClose={onClose} title="New Certificate Request">
      <form onSubmit={handleSubmit}>
        <Field label="Resident">
          <Select required value={residentId} onChange={(e) => setResidentId(e.target.value)}>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fullName} {r.status === 'verified' ? '' : '(unverified)'}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Certificate Type">
          <Select value={certificateType} onChange={(e) => setCertificateType(e.target.value)}>
            {Object.entries(CERT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Purpose">
          <TextInput placeholder="e.g. Employment requirement" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </Field>

        {certificateType === 'certificate_of_cohabitation' && (
          <>
            <Field label="Partner's Full Name">
              <TextInput value={extra.partnerName || ''} onChange={(e) => setExtra({ ...extra, partnerName: e.target.value })} />
            </Field>
            <Field label="Years Cohabiting">
              <TextInput type="number" min="0" value={extra.years || ''} onChange={(e) => setExtra({ ...extra, years: e.target.value })} />
            </Field>
          </>
        )}

        {certificateType === 'business_clearance' && (
          <>
            <Field label="Business Name">
              <TextInput value={extra.businessName || ''} onChange={(e) => setExtra({ ...extra, businessName: e.target.value })} />
            </Field>
            <Field label="Business Address">
              <TextInput value={extra.businessAddress || ''} onChange={(e) => setExtra({ ...extra, businessAddress: e.target.value })} />
            </Field>
          </>
        )}

        <p className="mt-2.5 text-[12.5px] text-ink-soft">
          {selectedResident?.status === 'verified'
            ? 'This resident is already verified — the request will be auto-approved.'
            : 'This resident is not yet verified — the request will require manual approval.'}
        </p>

        <div className="mt-5.5 flex gap-2.5">
          <Button type="submit" variant="primary">Submit Request</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
