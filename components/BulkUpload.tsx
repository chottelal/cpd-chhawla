import React, { useState } from 'react';
import type { CertificateData } from '../types';
import { downloadExcelTemplate, readExcelFile } from '../utils/excelUtils';
import { CertificatePreview } from './CertificatePreview';

interface BulkUploadProps {
  onBulkGenerate: (certificates: CertificateData[]) => void;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ onBulkGenerate }) => {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const data = await readExcelFile(file);
      if (data.length === 0) {
        setError('No valid data found in the Excel file');
        return;
      }
      setCertificates(data);
      setSelectedIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read Excel file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
  };

  const handleBulkGenerate = () => {
    if (certificates.length > 0) {
      onBulkGenerate(certificates);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Bulk Certificate Generation</h3>
        <p className="text-blue-700 mb-4">
          Download the Excel template, fill in the certificate data, and upload it to generate multiple certificates at once.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDownloadTemplate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📥 Download Excel Template
          </button>
          
          <div className="flex items-center">
            <label htmlFor="excel-upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              📤 Upload Excel File
            </label>
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Processing Excel file...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">❌ {error}</p>
        </div>
      )}

      {certificates.length > 0 && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-green-800">
                  ✅ {certificates.length} certificates loaded successfully
                </h4>
                <p className="text-green-700">
                  Preview certificates below and click "Generate All Certificates" to create PDFs.
                </p>
              </div>
              <button
                onClick={handleBulkGenerate}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                📄 Generate All Certificates
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold">Certificate Preview</h5>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                  disabled={selectedIndex === 0}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  ← Previous
                </button>
                <span className="text-sm text-gray-600">
                  {selectedIndex + 1} of {certificates.length}
                </span>
                <button
                  onClick={() => setSelectedIndex(Math.min(certificates.length - 1, selectedIndex + 1))}
                  disabled={selectedIndex === certificates.length - 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <CertificatePreview data={certificates[selectedIndex]} />
            </div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <h5 className="font-semibold mb-2">Loaded Certificates:</h5>
            <div className="max-h-40 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`p-2 border rounded cursor-pointer hover:bg-blue-50 ${
                      index === selectedIndex ? 'bg-blue-100 border-blue-300' : 'bg-white'
                    }`}
                  >
                    <div className="font-medium">{cert.participantName}</div>
                    <div className="text-gray-600">{cert.designation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};