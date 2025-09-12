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
        <InputField label="Participant Name" id="participantName" value={data.participantName} onChange={handleChange} />
        <InputField label="Designation" id="designation" value={data.designation} onChange={handleChange} />
        <InputField label="Organization Name (Hindi)" id="organizationNameHindi" value={data.organizationNameHindi} onChange={handleChange} />
        <InputField label="Organization Name (English)" id="organizationName" value={data.organizationName} onChange={handleChange} />
        <InputField label="Organization Address" id="organizationAddress" value={data.organizationAddress} onChange={handleChange} />
        <InputField label="Regional Office" id="regionalOffice" value={data.regionalOffice} onChange={handleChange} />
        <InputField label="Training Name (e.g., NCF-SE)" id="trainingName" value={data.trainingName} onChange={handleChange} />
        <InputField label="Workshop Details" id="workshopDetails" value={data.workshopDetails} onChange={handleChange} as="textarea" />
        <InputField label="Date(s)" id="dates" value={data.dates} onChange={handleChange} />
        <InputField label="Duration" id="duration" value={data.duration} onChange={handleChange} />
        <InputField label="Year" id="year" value={data.year} onChange={handleChange} />
        <InputField label="Principal's Name" id="principalName" value={data.principalName} onChange={handleChange} />
      </form>
    </div>
  );
};
