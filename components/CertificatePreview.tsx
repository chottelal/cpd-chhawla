
import React from 'react';
import type { CertificateData } from '../types';
import { KvLogo } from './Icons';

export const CertificatePreview: React.FC<{ data: CertificateData }> = ({ data }) => {
  return (
    <div id="certificate-preview" className="bg-white font-serif text-black aspect-[1.414/1] w-full p-8 border-4 border-gray-800">
      <div className="w-full h-full border-2 border-gray-600 p-6 flex flex-col">
        <header className="flex justify-between items-center mb-4">
          <KvLogo />
          <div className="text-center">
            <h2 className="text-lg font-semibold">पीएमश्री केंद्रीय विद्यालय सीमा सुरक्षा बल छावला नई दिल्ली-71</h2>
            <h1 className="text-xl font-bold uppercase">{data.organizationName}, {data.organizationAddress}</h1>
          </div>
          <KvLogo />
        </header>

        <div className="text-center my-4">
          <h3 className="text-2xl font-bold text-green-700 tracking-wider">प्रमाणपत्र / CERTIFICATE</h3>
          <p className="text-lg font-semibold mt-1">वर्ष / Year {data.year}</p>
        </div>

        <main className="flex-grow text-lg leading-relaxed mt-6 px-4">
          <p className="text-justify">
            प्रमाणित किया जाता है कि श्री/श्रीमती/सुश्री/डॉ. <span className="font-bold underline mx-1">{data.participantName}</span> पदनाम <span className="font-bold underline mx-1">{data.designation}</span> पीएमश्री केंद्रीय विद्यालय <span className="font-bold underline mx-1">{data.organizationName}</span> क्षेत्रीय कार्यालय <span className="font-bold underline mx-1">{data.regionalOffice}</span> में मुख्याभिमुख रूप में आयोजित <span className="font-bold underline mx-1">{data.trainingName}</span> प्रशिक्षण कार्यक्रम/कार्यशाला/गतिविधि({data.workshopDetails}) में दिनांक <span className="font-bold underline mx-1">{data.dates}</span> को {data.duration} घंटे हेतु प्रतिभागी/ संसाधक के रूप में प्रतिभागिता की।
          </p>
          <p className="mt-8 text-justify">
            This is to certify that Mr/Mrs/Ms/Dr <span className="font-bold underline mx-1">{data.participantName}</span> Designation <span className="font-bold underline mx-1">{data.designation}</span> of PM Shri / Kendriya Vidyalaya <span className="font-bold underline mx-1">{data.organizationName}, Regional office {data.regionalOffice}</span> has attended <span className="font-bold underline mx-1">{data.trainingName}</span> Training Programme / Workshop / Activities ( {data.workshopDetails} ) in Offline Mode on Date <span className="font-bold underline mx-1">{data.dates}</span> for {data.duration} as a Participant.
          </p>
        </main>

        <footer className="mt-auto pt-12 flex justify-end">
          <div className="text-center">
             <p className="font-semibold text-lg italic">{data.principalName}</p>
            <hr className="border-black mt-1" />
            <p className="font-bold">प्राचार्य / Principal</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
