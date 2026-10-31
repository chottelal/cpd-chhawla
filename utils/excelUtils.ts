import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { CertificateData } from '../types';

// Excel template columns matching CertificateData interface
const TEMPLATE_COLUMNS = [
  'Participant Name',
  'Participant Name (Hindi)',
  'Designation', 
  'Designation (Hindi)',
  'Organization Name',
  'Organization Name (Hindi)',
  'Organization Address',
  'Organization Location',
  'Organization Location (Hindi)',
  'Regional Office',
  'Regional Office (Hindi)',
  'Training Name',
  'Workshop Details',
  'Dates',
  'Duration',
  'Duration (Hindi)',
  'Year',
  'Principal Name',
  'Principal Signature (URL)',
  'Resource Person'
];

export const downloadExcelTemplate = () => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheet with headers
  const ws = XLSX.utils.aoa_to_sheet([
    TEMPLATE_COLUMNS,
    // Add one sample row with example data
    [
      'John Doe',
      'जॉन डो',
      'Teacher', 
      'शिक्षक',
      'PM SHRI KV BSF CAMP CHHAWLA',
      'पीएम श्री केन्द्रीय विद्यालय सीमा सुरक्षा बल छावला',
      'NEW DELHI-71',
      'BSF CAMP CHHAWLA',
      'सीमा सुरक्षा बल छावला',
      'Delhi Regional Office',
      'दिल्ली क्षेत्रीय कार्यालय',
      'Professional Development Workshop',
      'Details about the training workshop conducted for capacity building',
      '15-17 January 2025',
      '3 Days',
      '3 दिन',
      '2025',
      'Dr. Principal Name',
      'https://example.com/signature.png',
      'Resource Person Name'
    ]
  ]);
  
  // Auto-size columns
  const colWidths = TEMPLATE_COLUMNS.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Certificate Data');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Save file
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, 'certificate_template.xlsx');
};

export const readExcelFile = (file: File): Promise<CertificateData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        // Skip header row and process data
        const headers = (jsonData[0] || []).map((header: unknown) => String(header || '').trim().toLowerCase());
        const rows = jsonData.slice(1);

        const columnAliases: Record<string, string[]> = {
          participantName: ['participant name', 'name', 'teacher name'],
          participantNameHindi: ['participant name (hindi)', 'name (hindi)'],
          designation: ['designation', 'post'],
          designationHindi: ['designation (hindi)', 'post (hindi)'],
          organizationName: ['organization name', 'school name', 'school'],
          organizationNameHindi: ['organization name (hindi)', 'school name (hindi)'],
          organizationAddress: ['organization address', 'school address', 'address'],
          organizationLocation: ['organization location', 'school location', 'location'],
          organizationLocationHindi: ['organization location (hindi)', 'location (hindi)'],
          regionalOffice: ['regional office', 'region'],
          regionalOfficeHindi: ['regional office (hindi)', 'region (hindi)'],
          trainingName: ['training name', 'programme', 'program', 'workshop'],
          workshopDetails: ['workshop details', 'activity', 'details'],
          dates: ['dates', 'date'],
          duration: ['duration', 'hours'],
          durationHindi: ['duration (hindi)', 'hours (hindi)'],
          year: ['year'],
          principalName: ['principal name', 'principal'],
          principalSignature: ['principal signature (url)', 'principal signature', 'signature url'],
          resourcePerson: ['resource person', 'resource person name', 'facilitator', 'trainer']
        };

        const getCell = (row: unknown[], field: keyof CertificateData, fallbackIndex: number): string => {
          const aliases = columnAliases[field] || [];
          const columnIndex = headers.findIndex((header: string) => aliases.includes(header));
          const value = columnIndex >= 0 ? row[columnIndex] : row[fallbackIndex];
          return value === undefined || value === null ? '' : String(value).trim();
        };
        
        const certificates: CertificateData[] = rows
          .filter(row => row.length > 0 && row[0]) // Filter empty rows
          .map((row, index) => {
            try {
              return {
                participantName: getCell(row, 'participantName', 0),
                participantNameHindi: getCell(row, 'participantNameHindi', 1),
                designation: getCell(row, 'designation', 2),
                designationHindi: getCell(row, 'designationHindi', 3),
                organizationName: getCell(row, 'organizationName', 4),
                organizationNameHindi: getCell(row, 'organizationNameHindi', 5),
                organizationAddress: getCell(row, 'organizationAddress', 6),
                organizationLocation: getCell(row, 'organizationLocation', 7),
                organizationLocationHindi: getCell(row, 'organizationLocationHindi', 8),
                regionalOffice: getCell(row, 'regionalOffice', 9),
                regionalOfficeHindi: getCell(row, 'regionalOfficeHindi', 10),
                trainingName: getCell(row, 'trainingName', 11),
                workshopDetails: getCell(row, 'workshopDetails', 12),
                dates: getCell(row, 'dates', 13),
                duration: getCell(row, 'duration', 14),
                durationHindi: getCell(row, 'durationHindi', 15),
                year: getCell(row, 'year', 16),
                principalName: getCell(row, 'principalName', 17),
                principalSignature: getCell(row, 'principalSignature', 18),
                resourcePerson: getCell(row, 'resourcePerson', 19)
              };
            } catch (error) {
              console.error(`Error processing row ${index + 2}:`, error);
              return null;
            }
          })
          .filter(cert => cert !== null) as CertificateData[];
        
        resolve(certificates);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};