
export interface CertificateParticipant {
  participantName: string;
  participantNameHindi: string;
  designation: string;
  designationHindi: string;
}

export interface CertificateData {
  participantName: string;
  participantNameHindi: string;
  designation: string;
  designationHindi: string;
  organizationName: string; // Header English
  organizationNameHindi: string; // Header Hindi
  organizationAddress: string;
  organizationLocation: string; // Body English
  organizationLocationHindi: string; // Body Hindi
  regionalOffice: string;
  regionalOfficeHindi: string;
  trainingName: string;
  workshopDetails: string;
  dates: string;
  duration: string;
  durationHindi: string;
  year: string;
  resourcePerson: string;
  // FIX: Added missing principalName property.
  principalName: string;
  participants: CertificateParticipant[];
  // Optional URL or data URI for principal signature image; Excel value is authoritative.
  principalSignature?: string;
}