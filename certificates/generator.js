const PDFDocument = require('pdfkit');

const BARANGAY_NAME = 'Barangay San Isidro';
const CITY_NAME = 'City of Santa Rosa, Laguna';

function drawHeader(doc) {
  doc.fontSize(10).font('Helvetica').text('Republic of the Philippines', { align: 'center' });
  doc.text(CITY_NAME, { align: 'center' });
  doc.fontSize(14).font('Helvetica-Bold').text(`OFFICE OF THE ${BARANGAY_NAME.toUpperCase()}`, { align: 'center' });
  doc.moveDown(0.3);
  doc.moveTo(60, doc.y).lineTo(535, doc.y).stroke();
  doc.moveDown(1);
}

function drawFooter(doc, controlNo) {
  doc.moveDown(3);
  doc.fontSize(10).font('Helvetica');
  doc.text('_____________________________', 320, doc.y);
  doc.text('Punong Barangay', 350, doc.y + 2);
  doc.moveDown(2);
  doc.fontSize(8).fillColor('gray').text(`Control No.: ${controlNo}`, 60);
  doc.text(`Date Issued: ${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}`, 60);
  doc.fillColor('black');
}

function titleBlock(doc, title) {
  doc.fontSize(16).font('Helvetica-Bold').text(title.toUpperCase(), { align: 'center' });
  doc.moveDown(1.5);
}

function bodyText(doc, text) {
  doc.fontSize(12).font('Helvetica').text(text, { align: 'justify', lineGap: 6 });
  doc.moveDown(1);
}

const templates = {
  barangay_clearance: (doc, r, req) => {
    titleBlock(doc, 'Barangay Clearance');
    bodyText(doc, `This is to certify that ${r.fullName.toUpperCase()}, of legal age, ${r.civilStatus}, and a resident of ${r.address}, ${BARANGAY_NAME}, is known to be of good moral character and a peaceful, law-abiding member of this community.`);
    bodyText(doc, `This CLEARANCE is issued upon the request of the above-named person for the purpose of "${req.purpose || 'whatever legal purpose it may serve'}".`);
    bodyText(doc, `This certifies further that he/she has no derogatory record on file in this Barangay as of this date.`);
  },
  certificate_of_residency: (doc, r, req) => {
    titleBlock(doc, 'Certificate of Residency');
    bodyText(doc, `This is to certify that ${r.fullName.toUpperCase()}, ${r.civilStatus}, is a bona fide resident of ${r.address}, ${BARANGAY_NAME}, for ${r.yearsOfResidency} year(s) up to the present.`);
    bodyText(doc, `This certification is issued upon the request of the above-named person for the purpose of "${req.purpose || 'whatever legal purpose it may serve'}".`);
  },
  certificate_of_indigency: (doc, r, req) => {
    titleBlock(doc, 'Certificate of Indigency');
    bodyText(doc, `This is to certify that ${r.fullName.toUpperCase()}, ${r.civilStatus}, and a resident of ${r.address}, ${BARANGAY_NAME}, belongs to an indigent family in this barangay based on the records and assessment of this office.`);
    bodyText(doc, `This certification is being issued upon the request of the above-named person for the purpose of "${req.purpose || 'availing of assistance/benefits'}".`);
  },
  certificate_of_good_moral: (doc, r, req) => {
    titleBlock(doc, 'Certificate of Good Moral Character');
    bodyText(doc, `This is to certify that ${r.fullName.toUpperCase()}, ${r.civilStatus}, and a resident of ${r.address}, ${BARANGAY_NAME}, is personally known to this office to be a person of good moral character and reputation, with no record of any violation of law or ordinance within this barangay.`);
    bodyText(doc, `Issued upon request for the purpose of "${req.purpose || 'whatever legal purpose it may serve'}".`);
  },
  certificate_of_cohabitation: (doc, r, req) => {
    titleBlock(doc, 'Certificate of Cohabitation');
    bodyText(doc, `This is to certify that ${r.fullName.toUpperCase()} and ${req.extra?.partnerName || '[Partner Name]'} are known to this office to have been living together as husband and wife without the benefit of marriage at ${r.address}, ${BARANGAY_NAME}, for ${req.extra?.years || 'a number of'} year(s).`);
    bodyText(doc, `This certification is issued upon the joint request of the above-named parties for the purpose of "${req.purpose || 'whatever legal purpose it may serve'}".`);
  },
  certificate_of_unemployment: (doc, r, req) => {
    titleBlock(doc, 'Certificate of Unemployment');
    bodyText(doc, `This is to certify that ${r.fullName.toUpperCase()}, ${r.civilStatus}, and a resident of ${r.address}, ${BARANGAY_NAME}, is currently unemployed and has no source of regular income as verified by this office.`);
    bodyText(doc, `This certification is issued upon the request of the above-named person for the purpose of "${req.purpose || 'whatever legal purpose it may serve'}".`);
  },
  business_clearance: (doc, r, req) => {
    titleBlock(doc, 'Barangay Business Clearance');
    bodyText(doc, `This is to certify that the business named "${req.extra?.businessName || '[Business Name]'}", owned and operated by ${r.fullName.toUpperCase()}, located at ${req.extra?.businessAddress || r.address}, ${BARANGAY_NAME}, is hereby granted clearance to operate within the jurisdiction of this barangay.`);
    bodyText(doc, `This clearance is valid for the current year and issued for the purpose of "${req.purpose || 'securing a business permit'}", subject to compliance with existing barangay ordinances.`);
  },
  first_time_jobseeker: (doc, r, req) => {
    titleBlock(doc, 'First-Time Job Seeker Certificate');
    bodyText(doc, `This is to certify that ${r.fullName.toUpperCase()}, ${r.civilStatus}, and a resident of ${r.address}, ${BARANGAY_NAME}, is a FIRST-TIME JOB SEEKER as defined under RA 11261 (First Time Jobseekers Assistance Act), and has not been previously employed since attaining working age.`);
    bodyText(doc, `This certification is issued for the purpose of availing of the benefits under the said Act, exempting the holder from payment of fees for documents required for employment application.`);
  }
};

const CERT_LABELS = {
  barangay_clearance: 'Barangay Clearance',
  certificate_of_residency: 'Certificate of Residency',
  certificate_of_indigency: 'Certificate of Indigency',
  certificate_of_good_moral: 'Certificate of Good Moral Character',
  certificate_of_cohabitation: 'Certificate of Cohabitation',
  certificate_of_unemployment: 'Certificate of Unemployment',
  business_clearance: 'Business Clearance',
  first_time_jobseeker: 'First-Time Job Seeker Certificate'
};

function generateCertificate(type, resident, request, res) {
  const doc = new PDFDocument({ size: 'A4', margin: 60 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${type}_${resident.fullName.replace(/\s+/g, '_')}.pdf"`);
  doc.pipe(res);

  drawHeader(doc);
  const fn = templates[type];
  if (!fn) {
    doc.text('Unknown certificate type.');
    doc.end();
    return;
  }
  fn(doc, resident, request);
  drawFooter(doc, `${type.toUpperCase()}-${request.id}`);
  doc.end();
}

module.exports = { generateCertificate, CERT_LABELS };
