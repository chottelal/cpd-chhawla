
import React from 'react';
import type { CertificateData } from '../types';
import { KvLogo } from './Icons';

export const CertificatePreview: React.FC<{ data: CertificateData; id?: string }> = ({ data, id = "certificate-preview" }) => {
  return (
  <div id={id} className="w-full p-6" style={{ width: id !== 'certificate-preview' ? '1122px' : undefined, height: id !== 'certificate-preview' ? '794px' : undefined }}>
      <div className="bg-white outer-border p-6">
        <div className="inner-border h-full p-6 flex flex-col" style={{ minHeight: '640px' }}>
          <header className="flex items-start justify-between mb-2 gap-4">
            <div className="flex-shrink-0">
              <img src="/kvs.png" alt="KVS Logo" className="w-24 h-24 object-contain" />
            </div>
            <div className="flex-grow text-center">
              <h2 className="devanagari text-2xl font-semibold">{data.organizationNameHindi}</h2>
              <h1 className="text-xl font-bold uppercase mt-1">{data.organizationName}</h1>
              <p className="text-sm mt-1">{data.organizationAddress}</p>
            </div>
            <div className="flex-shrink-0">
              <img src="/kvs.png" alt="KVS Logo" className="w-24 h-24 object-contain" />
            </div>
          </header>

          <div className="text-center my-4">
            <h3 className="text-3xl font-extrabold text-green-700 tracking-wide devanagari">प्रमाणपत्र / CERTIFICATE</h3>
            <p className="text-lg font-semibold mt-1">वर्ष / Year {data.year}</p>
          </div>

          <main className="flex-grow text-lg leading-relaxed mt-6 px-6">
            <p className="text-justify devanagari">
              प्रमाणित किया जाता है कि श्री /श्रीमती /सुश्री /डॉ. <span className="font-bold underline mx-1">{data.participantNameHindi || data.participantName}</span> पदनाम <span className="font-bold underline mx-1">{data.designationHindi || data.designation}</span> पीएम श्री / केन्द्रीय विद्यालय <span className="font-bold underline mx-1">{data.organizationNameHindi}</span> क्षेत्रीय कार्यालय <span className="font-bold underline mx-1">{data.regionalOfficeHindi || data.regionalOffice}</span> ने मुखाभिमुख रूप में विद्यालय स्तर पर आयोजित <span className="font-bold underline mx-1">{data.trainingName}</span> प्रशिक्षण कार्यक्रम / कार्यशाला / गतिविधि (पेपर प्रकाशन / प्रश्न पत्र सेटिंग / प्रकाशन का संपादन इत्यादि) में दिनांक <span className="font-bold underline mx-1">{data.dates}</span> को कुल <span className="font-bold underline mx-1">{data.durationHindi || data.duration}</span> घंटे हेतु प्रतिभागी के रूप में प्रतिभागिता की ।
            </p>

            <p className="mt-8 text-justify">
              This is to certify that Mr/Mrs/Ms/Dr. <span className="font-bold underline mx-1">{data.participantName}</span> Designation <span className="font-bold underline mx-1">{data.designation}</span> of PM Shri / Kendriya Vidyalaya <span className="font-bold underline mx-1">{data.organizationName}</span> Regional Office <span className="font-bold underline mx-1">{data.regionalOffice}</span> has attended vidyalaya level <span className="font-bold underline mx-1">{data.trainingName}</span> Training Programme / Workshop / Activities (Paper Publishing / Question Paper Setting / Editing a Publication etc.) in Offline Mode on date <span className="font-bold underline mx-1">{data.dates}</span> for Total <span className="font-bold underline mx-1">{data.duration}</span> hours as a Participant.
            </p>
          </main>

          <footer className="mt-6 pt-6 flex items-end justify-end">
            <div className="text-center" style={{ width: '260px' }}>
              {/* Signature image: only show if data.principalSignature is provided */}
              { data.principalSignature && (
                <div className="flex items-center justify-center mb-1">
                  <img src={data.principalSignature} alt="Principal Signature" style={{ maxWidth: '220px', maxHeight: '80px', objectFit: 'contain' }} />
                </div>
              ) }
              <p className="font-semibold text-lg italic">{data.principalName}</p>
              <div className="border-t border-black mt-2" />
              <p className="font-bold mt-1">प्राचार्य / Principal</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};