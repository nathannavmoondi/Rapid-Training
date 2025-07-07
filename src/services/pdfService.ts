// src/services/pdfService.ts
// Service to generate and download a PDF from HTML content using html2pdf.js

// Download PDF from an HTML string (creates a temporary element)
export async function downloadHtmlAsPdf(htmlContent: string | HTMLElement, filename: string = 'quiz-content.pdf', topicName?: string) {
  if (!htmlContent) {
    throw new Error('No HTML content provided for PDF generation.');
  }
  // Dynamically import html2pdf.js (so it doesn't bloat the main bundle)
  const html2pdf = (await import('html2pdf.js')).default;
  let element: HTMLElement;
  if (typeof htmlContent === 'string') {
    element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.background = '#000'; // Set PDF background to black
    element.style.color = '#fff'; // Set text color to white for contrast
    element.style.padding = '24px';
    // Hide quiz-status div if present
    const quizStatus = element.querySelector('.quiz-status') as HTMLElement | null;
    if (quizStatus) quizStatus.style.display = 'none';
    document.body.appendChild(element);
  } else {
    // Wrap the HTMLElement in a new div with header info
    const wrapper = document.createElement('div');
    wrapper.style.background = '#000';
    wrapper.style.color = '#fff';
    wrapper.style.padding = '24px';
    // Header content
    const now = new Date();
    // Format date as YYYY-MM-DD HH:MM (no seconds)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const h1 = document.createElement('h1');
    h1.textContent = `Rapid Skill Quiz${topicName ? ' - ' + topicName : ''}`;
    h1.style.fontSize = '2.2rem';
    h1.style.marginBottom = '0.5rem';
    const h2 = document.createElement('h2');
    h2.textContent = `Created: ${dateStr}`;
    h2.style.fontSize = '1.2rem';
    h2.style.marginBottom = '0.5rem';
    const h3 = document.createElement('h3');
    h3.innerHTML = '<a href="https://rapidskill.ca" style="color:#4FC3F7;text-decoration:underline;">rapidskill.ca - Learn Faster, Smart, Better</a>';
    h3.style.fontSize = '1.1rem';
    h3.style.marginBottom = '0.5rem';
    wrapper.appendChild(h1);
    wrapper.appendChild(h2);
    wrapper.appendChild(h3);
    wrapper.appendChild(document.createElement('br'));
    wrapper.appendChild(document.createElement('br'));
    // Add question label
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = 'Question:';
    questionDiv.style.fontWeight = 'bold';
    questionDiv.style.fontSize = '1.15rem';
    questionDiv.style.marginBottom = '0.7rem';
    wrapper.appendChild(questionDiv);
    // Hide quiz-status div if present in the htmlContent node
    if (htmlContent instanceof HTMLElement) {
      const quizStatus = htmlContent.querySelector('.quiz-status') as HTMLElement | null;
      if (quizStatus) quizStatus.style.display = 'none';
    }
    wrapper.appendChild(htmlContent);
    element = wrapper;
  }
  const opt = {
    margin: 0.5,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#000' },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  await html2pdf().set(opt).from(element).save();
  if (typeof htmlContent === 'string') {
    document.body.removeChild(element);
  }
}
