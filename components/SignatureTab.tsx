import React, { useEffect, useState } from 'react';

interface SignatureTabProps {
  value?: string; // data URL
  onChange: (dataUrl?: string) => void;
}

// Tab to upload/preview/clear principal signature and persist in localStorage
export const SignatureTab: React.FC<SignatureTabProps> = ({ value, onChange }) => {
  const [preview, setPreview] = useState<string | undefined>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
      try { localStorage.setItem('principalSignature', dataUrl); } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(undefined);
    onChange(undefined);
    try { localStorage.removeItem('principalSignature'); } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold mb-2">Principal Signature</h3>
        <p className="text-sm text-gray-600 mb-3">
          Upload a PNG/JPG signature image. This will be used only when the Excel row doesn't provide a signature URL.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <label htmlFor="signature-upload" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Upload Signature
          </label>
          <input
            id="signature-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {preview && (
            <button onClick={handleClear} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Clear</button>
          )}
        </div>
      </div>

      {preview && (
        <div className="bg-white p-4 shadow rounded">
          <p className="text-sm text-gray-700 mb-2">Preview:</p>
          <div className="border rounded p-3 flex items-center justify-center">
            <img src={preview} alt="Principal Signature" style={{ maxWidth: '320px', maxHeight: '120px', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </div>
  );
};
