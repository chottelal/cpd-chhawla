
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
  // FIX: Added missing principalName property.
  principalName: string;
  // Optional URL or data URI for principal signature image; Excel value is authoritative.
  principalSignature?: string;
}