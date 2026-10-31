
import React from 'react';
import type { CertificateData } from '../types';

export const CertificatePreview: React.FC<{ data: CertificateData; id?: string }> = ({ data, id = "certificate-preview" }) => {
  const schoolName = data.organizationName;
  const schoolNameHindi = data.organizationNameHindi;
  const location = data.organizationLocation;
  const locationHindi = data.organizationLocationHindi;
  const duration = data.duration;
  const durationHindi = data.durationHindi;

  return (
  <div id={id} className="cpd-certificate" style={id !== 'certificate-preview' ? { width: '794px', height: '1122px' } : undefined}>
      <div className="cpd-certificate__paper">
        <header className="cpd-certificate__header">
          <img src="/kvs.png" alt="KVS Logo" className="cpd-certificate__logo" />
          <div className="cpd-certificate__heading">
            <p className="devanagari cpd-certificate__school-hindi">पी.एम. श्री केन्द्रीय विद्यालय सी.सु.बल छावला</p>
            <h1>{schoolName}</h1>
            <p>(शिक्षा मंत्रालय, भारत सरकार / Ministry of Education, Govt. of India)</p>
            <p>नई दिल्ली - 110071 / New Delhi - 110071</p>
            <p>दूरभाष / Telephone No. - 011-25317002</p>
            <p>E- Mail / ई-मेल - <span className="cpd-certificate__link">pmshrikvbsfchhawala@kvsrodelhi.in</span></p>
            <p>Website / वेबसाइट: <span className="cpd-certificate__link">www.chhawalacampbsf.kvs.ac.in</span></p>
            <p className="devanagari">{schoolNameHindi}</p>
          </div>
          <img src="/pm%20shri%20logo.png" alt="PM SHRI Logo" className="cpd-certificate__logo" />
        </header>
        <div className="cpd-certificate__codes">CBSE SCH. CODE: 29026, &nbsp;&nbsp; CBSE AFF. NO: 2700030, &nbsp;&nbsp; UDISE CODE: 07080913301, &nbsp;&nbsp; KV CODE: 1408, &nbsp;&nbsp; KV STATION CODE: 239</div>
        <div className="cpd-certificate__title">
           <h2>{schoolName}</h2>
          <h3>CPD TRAINING CERTIFICATE - {data.year}</h3>
        </div>
        <main className="cpd-certificate__body">
          <p className="devanagari">प्रमाणित किया जाता है कि हमारे विद्यालय <strong>{schoolNameHindi}</strong>, <strong>{data.regionalOfficeHindi}</strong> के निम्नलिखित शिक्षकों ने <strong>“विषय- {data.trainingName}”</strong> पर आयोजित सीपीडी सत्र / कार्यशाला / अल्प अवधि प्रशिक्षण कार्यक्रम में <strong>{data.dates}</strong> को विद्यालय परिसर में ऑफलाइन / आमने-सामने मोड में <strong>{durationHindi}</strong> हेतु प्रतिभागी के रूप में भाग लिया।</p>
          <p>This is to certify that the following teachers of our vidyalaya <strong>{schoolName}</strong>, <strong>{data.regionalOffice}</strong>, have attended a CPD Session/Workshop/short duration training programme on the <strong>“Topic- {data.trainingName}”</strong> held on <strong>{data.dates}</strong> in school premises for <strong>{duration}</strong> as participants in Offline/face-to-face mode.</p>
          <table className="cpd-certificate__table">
            <thead><tr><th>Name</th><th>Designation</th><th>School</th><th>Duration</th></tr></thead>
            <tbody><tr><td>{data.participantName}</td><td>{data.designation}</td><td>{schoolName}</td><td>{duration}</td></tr></tbody>
          </table>
          {data.resourcePerson && <p className="cpd-certificate__details"><strong>Resource Person:</strong> {data.resourcePerson}</p>}
        </main>
        <footer className="cpd-certificate__footer">
          <div className="cpd-certificate__signature">
            {data.principalSignature && <img src={data.principalSignature} alt="Principal Signature" />}
            <p>{data.principalName}</p><p className="devanagari">प्राचार्य / Principal</p>
          </div>
        </footer>
      </div>
    </div>
  );
};