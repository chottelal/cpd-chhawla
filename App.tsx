
import React, { useEffect, useState } from 'react';
import { CertificateForm } from './components/CertificateForm';
import { CertificatePreview } from './components/CertificatePreview';
import { BulkUpload } from './components/BulkUpload';
import { SignatureTab } from './components/SignatureTab';
import type { CertificateData } from './types';
import { DownloadIcon, BrandIcon } from './components/Icons';
import { generateSinglePDF, generateBulkBoth } from './utils/pdfUtils';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'signature'>('single');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  const [uploadedSignature, setUploadedSignature] = useState<string | undefined>(() => {
    try { return localStorage.getItem('principalSignature') || undefined; } catch { return undefined; }
  });
  const [certificateData, setCertificateData] = useState<CertificateData>({
    participantName: 'JITESH SHAH',
    participantNameHindi: 'जितेश शाह',
    designation: 'PGT (COMPUTER SCIENCE)',
    designationHindi: 'स्नातकोत्तर शिक्षक(कंप्यूटर साइंस)',
    organizationName: 'KENDRIYA VIDYALAYA BSF CAMP CHHAWLA',
    organizationNameHindi: 'पीएमश्रीकेंद्रीयविद्यालय सीमा सुरक्षा बल छावलानईदिल्ली-71',
    organizationAddress: 'NEW DELHI-71',
    organizationLocation: 'BSF CAMP CHHAWLA',
    organizationLocationHindi: 'सीमा सुरक्षा बल छावलानईदिल्ली',
    regionalOffice: 'DELHI REGION',
    regionalOfficeHindi: 'दिल्ली संभाग',
    trainingName: 'NCF-SE',
    workshopDetails: 'Paper Publishing / Question Paper Setting / Editing a Publication etc.',
    dates: '12.12.2024 and 13.12.2024',
    duration: '03 hours',
    durationHindi: 'तीन',
    year: '2024',
    // FIX: Added principalName to initial state.
    principalName: 'PRINCIPAL NAME',
    principalSignature: '/signature.png',
  });

  useEffect(() => {
    // Keep localStorage in sync in case state changes elsewhere
    try {
      if (uploadedSignature) localStorage.setItem('principalSignature', uploadedSignature);
      else localStorage.removeItem('principalSignature');
    } catch {}
  }, [uploadedSignature]);

  const handlePrint = async () => {
    try {
      setIsGenerating(true);
      const pdfBlob = await generateSinglePDF(certificateData);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${certificateData.participantName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkGenerate = async (certificates: CertificateData[]) => {
    try {
      setIsGenerating(true);
      // Count per-file progress: 2 files per certificate (PDF + DOCX)
      setGenerationProgress({ current: 0, total: certificates.length * 2 });
      
      const getCertificateElement = () => {
        return activeTab === 'bulk' 
          ? document.getElementById('bulk-certificate-preview')
          : document.getElementById('certificate-preview');
      };
      const updateCertificateData = async (data: CertificateData) => {
        setCertificateData(data);
        return new Promise<void>(resolve => {
          setTimeout(resolve, 50);
        });
      };
      
      await generateBulkBoth(
        certificates,
        getCertificateElement,
        updateCertificateData,
        (current, total) => {
          setGenerationProgress({ current, total });
        }
      );
      
      alert(`Successfully generated ${certificates.length} certificates!`);
    } catch (error) {
      console.error('Failed to generate bulk PDFs:', error);
      alert('Failed to generate certificates. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BrandIcon />
            <h1 className="text-2xl font-bold text-slate-700">CPD Certificate Generator</h1>
          </div>
          <button
            onClick={handlePrint}
            disabled={isGenerating}
            className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 ${
              isGenerating
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <DownloadIcon />
            Download Certificate
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'single'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📄 Single Certificate
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'bulk'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📦 Bulk Generation
            </button>
            <button
              onClick={() => setActiveTab('signature')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'signature'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ✍️ Principal Signature
            </button>
          </div>
        </div>

        {/* Loading/Progress Indicator */}
        {isGenerating && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <p className="font-medium text-blue-800">
                  {activeTab === 'single' ? 'Generating certificate...' : 'Generating certificates...'}
                </p>
                {generationProgress.total > 0 && (
                  <p className="text-sm text-blue-600">
                    Progress: {generationProgress.current} of {generationProgress.total}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <CertificateForm data={certificateData} setData={setCertificateData} />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg">
                <CertificatePreview data={{...certificateData, principalSignature: certificateData.principalSignature || uploadedSignature}} id="certificate-preview" />
              </div>
            </div>
          </div>
        ) : activeTab === 'bulk' ? (
          <div>
            <BulkUpload onBulkGenerate={handleBulkGenerate} fallbackSignature={uploadedSignature} />
            {/* Off-screen certificate preview for bulk generation (must NOT be display:none) */}
            <div style={{ position: 'absolute', left: '-2000px', top: 0, width: '1122px' }}>
              <CertificatePreview data={{...certificateData, principalSignature: certificateData.principalSignature || uploadedSignature}} id="bulk-certificate-preview" />
            </div>
          </div>
        ) : (
          <SignatureTab value={uploadedSignature} onChange={setUploadedSignature} />
        )}
      </main>
      
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS. Inspired by professional certificate designs.</p>
      </footer>
    </div>
  );
};

export default App;