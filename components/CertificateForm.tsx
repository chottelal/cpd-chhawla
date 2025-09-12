
import React from 'react';
import type { CertificateData } from '../types';

interface CertificateFormProps {
  data: CertificateData;
  setData: React.Dispatch<React.SetStateAction<CertificateData>>;
}

const InputField: React.FC<{
  label: string;
  id: keyof CertificateData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  as?: 'textarea';
}> = ({ label, id, value, onChange, as = 'input' }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    className: "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
  };
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea {...commonProps} rows={3} />
      ) : (
        <input type="text" {...commonProps} />
      )}
    </div>
  );
};

export const CertificateForm: React.FC<CertificateFormProps> = ({ data, setData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-3">Certificate Details</h2>
      <form className="space-y-4">
        <InputField label="Participant Name (English)" id="participantName" value={data.participantName} onChange={handleChange} />
        <InputField label="Participant Name (Hindi)" id="participantNameHindi" value={data.participantNameHindi} onChange={handleChange} />
        <InputField label="Designation (English)" id="designation" value={data.designation} onChange={handleChange} />
        <InputField label="Designation (Hindi)" id="designationHindi" value={data.designationHindi} onChange={handleChange} />
        <InputField label="Organization Name (Header, Hindi)" id="organizationNameHindi" value={data.organizationNameHindi} onChange={handleChange} />
        <InputField label="Organization Name (Header, English)" id="organizationName" value={data.organizationName} onChange={handleChange} />
        <InputField label="Organization Address (Header, English)" id="organizationAddress" value={data.organizationAddress} onChange={handleChange} />
        <InputField label="Organization Location (Body, English)" id="organizationLocation" value={data.organizationLocation} onChange={handleChange} />
        <InputField label="Organization Location (Body, Hindi)" id="organizationLocationHindi" value={data.organizationLocationHindi} onChange={handleChange} />
        <InputField label="Regional Office (English)" id="regionalOffice" value={data.regionalOffice} onChange={handleChange} />
        <InputField label="Regional Office (Hindi)" id="regionalOfficeHindi" value={data.regionalOfficeHindi} onChange={handleChange} />
        <InputField label="Training Name" id="trainingName" value={data.trainingName} onChange={handleChange} />
        <InputField label="Workshop Details" id="workshopDetails" value={data.workshopDetails} onChange={handleChange} as="textarea" />
        <InputField label="Date(s)" id="dates" value={data.dates} onChange={handleChange} />
        <InputField label="Duration (English)" id="duration" value={data.duration} onChange={handleChange} />
        {/* FIX: Removed stray hyphen that was causing a syntax error. */}
        <InputField label="Duration (Hindi)" id="durationHindi" value={data.durationHindi} onChange={handleChange} />
        <InputField label="Year" id="year" value={data.year} onChange={handleChange} />
        {/* FIX: Added InputField for principalName. */}
  <InputField label="Principal Name" id="principalName" value={data.principalName} onChange={handleChange} />
  <InputField label="Principal Signature URL or base64" id="principalSignature" value={data.principalSignature || ''} onChange={handleChange} />
      </form>
    </div>
  );
};