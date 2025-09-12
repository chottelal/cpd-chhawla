import React, { useState } from 'react';
import { CertificateForm } from './components/CertificateForm';
import { CertificatePreview } from './components/CertificatePreview';
import type { CertificateData } from './types';
import { DownloadIcon, BrandIcon } from './components/Icons';

const App: React.FC = () => {
  const [certificateData, setCertificateData] = useState<CertificateData>({
    participantName: 'JITESH SHAH',
    designation: 'PGT (COMPUTER SCIENCE)',
    organizationName: 'KENDRIYA VIDYALAYA BSF CAMP CHHAWLA',
    organizationNameHindi: 'पीएमश्री केंद्रीय विद्यालय सीमा सुरक्षा बल छावला नई दिल्ली-71',
    organizationAddress: 'NEW DELHI-71',
    regionalOffice: 'DELHI REGION',
    trainingName: 'NCF-SE',
    workshopDetails: 'Paper Publishing / Question Paper Setting / Editing a Publication etc.',
    dates: '12.12.2024 and 13.12.2024',
    duration: '03 hours',
    year: '2024',
    principalName: 'Principal Name',
  });

  const handlePrint = () => {
    window.print();
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
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            <DownloadIcon />
            Download Certificate
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CertificateForm data={certificateData} setData={setCertificateData} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg">
                <CertificatePreview data={certificateData} />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS. Inspired by professional certificate designs.</p>
      </footer>
    </div>
  );
};

export default App;
