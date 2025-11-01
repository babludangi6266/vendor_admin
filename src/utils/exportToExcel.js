import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'data', dataType = 'candidates') => {
  let excelData = [];

  if (dataType === 'candidates') {
    excelData = data.map(candidate => ({
      'ID': candidate.id,
      'Full Name': candidate.fullName,
      'Mobile': candidate.mobile,
      'Email': candidate.email || 'N/A',
      'Address': `${candidate.address?.villageTownCity || ''}, ${candidate.address?.pincode || ''}`,
      'Category': candidate.category,
      'Job Location': candidate.jobLocationCity,
      'Custom City': candidate.customCity || 'N/A',
      'Payment Status': candidate.paymentStatus || 'N/A',
      'Registration Status': candidate.registrationStatus,
      'Mobile Verified': candidate.isMobileVerified ? 'Yes' : 'No',
      'Registration Date': new Date(candidate.registrationDate).toLocaleDateString()
    }));
  } else {
    excelData = data.map(company => ({
      'ID': company.id,
      'Company Name': company.companyName,
      'Contact Person': company.contactPerson,
      'Mobile': company.mobile,
      'Email': company.email,
      'Address': `${company.address?.street || ''}, ${company.address?.city || ''}, ${company.address?.state || ''}`,
      'Categories': Array.isArray(company.categories) ? company.categories.join(', ') : 'N/A',
      'Candidate Quantity': company.candidateQuantity,
      'Experience Required': `${company.experience?.years || 0}y ${company.experience?.months || 0}m ${company.experience?.days || 0}d`,
      'Job Location': `${company.jobLocation?.city || ''}, ${company.jobLocation?.state || ''}`,
      'Registration Status': company.registrationStatus,
      'Mobile Verified': company.isMobileVerified ? 'Yes' : 'No',
      'Registration Date': new Date(company.registrationDate).toLocaleDateString()
    }));
  }

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, dataType === 'candidates' ? 'Candidates' : 'Companies');

  // Set column widths based on data type
  const colWidths = dataType === 'candidates' 
    ? [
        { wch: 8 },  // ID
        { wch: 20 }, // Full Name
        { wch: 15 }, // Mobile
        { wch: 25 }, // Email
        { wch: 30 }, // Address
        { wch: 20 }, // Category
        { wch: 15 }, // Job Location
        { wch: 15 }, // Custom City
        { wch: 15 }, // Payment Status
        { wch: 15 }, // Registration Status
        { wch: 15 }, // Mobile Verified
        { wch: 15 }  // Registration Date
      ]
    : [
        { wch: 8 },  // ID
        { wch: 25 }, // Company Name
        { wch: 20 }, // Contact Person
        { wch: 15 }, // Mobile
        { wch: 25 }, // Email
        { wch: 30 }, // Address
        { wch: 30 }, // Categories
        { wch: 15 }, // Candidate Quantity
        { wch: 20 }, // Experience Required
        { wch: 20 }, // Job Location
        { wch: 15 }, // Registration Status
        { wch: 15 }, // Mobile Verified
        { wch: 15 }  // Registration Date
      ];

  worksheet['!cols'] = colWidths;

  // Export to Excel
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};