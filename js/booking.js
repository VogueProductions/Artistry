// ============================================================
// ARTISTRY UNISEX SALON — AGRA
// booking.js — Multi-step form + Google Sheets integration
//
// HOW TO CONNECT TO GOOGLE SHEETS:
// 1. Open your Google Sheet
// 2. Go to Extensions → Apps Script
// 3. Paste the Apps Script code from sheets-script.js into the editor
// 4. Click Deploy → New Deployment → Web App
// 5. Set "Execute as: Me" and "Who has access: Anyone"
// 6. Copy the Web App URL
// 7. Replace GOOGLE_SHEET_SCRIPT_URL below with your URL
// ============================================================

// ⚠️ REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SHEET_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

let currentStep = 1;
let selectedSlot = '';

// ─── STEP NAVIGATION ───
function nextStep(step) {
  if (!validateStep(currentStep)) return;
  goToStep(step);
}

function prevStep(step) {
  goToStep(step);
}

function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.booking-step').forEach(s => s.style.display = 'none');

  // Show target step
  const target = document.getElementById('step' + step);
  if (target) target.style.display = 'block';

  // Update step indicators
  for (let i = 1; i <= 4; i++) {
    const ind = document.getElementById('step-ind-' + i);
    if (!ind) continue;
    ind.classList.remove('active', 'done');
    if (i < step) ind.classList.add('done');
    if (i === step) ind.classList.add('active');
  }

  // If step 4 (review), build summary
  if (step === 4) buildSummary();

  currentStep = step;
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

// ─── VALIDATION ───
function validateStep(step) {
  if (step === 1) {
    const service = document.getElementById('service').value;
    const gender = document.getElementById('gender').value;
    if (!service || !gender) {
      alert('Please select your gender and a service to continue.');
      return false;
    }
  }
  if (step === 2) {
    const date = document.getElementById('apptDate').value;
    const slot = document.getElementById('timeSlot').value;
    if (!date) {
      alert('Please select a preferred date.');
      return false;
    }
    if (!slot) {
      alert('Please select a time slot.');
      return false;
    }
  }
  if (step === 3) {
    const name = document.getElementById('fullName').value.trim();
    const wp = document.getElementById('whatsapp').value.trim();
    if (!name) {
      alert('Please enter your full name.');
      return false;
    }
    if (!wp || wp.length < 10) {
      alert('Please enter a valid WhatsApp number.');
      return false;
    }
  }
  return true;
}

// ─── SLOT SELECTION ───
function selectSlot(btn, time) {
  if (btn.classList.contains('booked')) return;
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSlot = time;
  document.getElementById('timeSlot').value = time;
}

// ─── BUILD REVIEW SUMMARY ───
function buildSummary() {
  const summary = document.getElementById('bookingSummary');
  const service  = document.getElementById('service').value;
  const gender   = document.getElementById('gender').value;
  const date     = document.getElementById('apptDate').value;
  const slot     = document.getElementById('timeSlot').value;
  const name     = document.getElementById('fullName').value;
  const wp       = document.getElementById('whatsapp').value;
  const notes    = document.getElementById('notes').value;

  const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : '—';

  summary.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-family:var(--font-body);font-size:13px;">
      <tr>
        <td style="padding:8px 0;color:#888;width:40%;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Service</td>
        <td style="padding:8px 0;color:#0E0E0E;font-weight:500;">${service || '—'}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-top:1px solid rgba(0,0,0,0.07);">Gender</td>
        <td style="padding:8px 0;color:#0E0E0E;border-top:1px solid rgba(0,0,0,0.07);">${gender || '—'}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-top:1px solid rgba(0,0,0,0.07);">Date</td>
        <td style="padding:8px 0;color:#0E0E0E;border-top:1px solid rgba(0,0,0,0.07);">${formattedDate}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-top:1px solid rgba(0,0,0,0.07);">Time Slot</td>
        <td style="padding:8px 0;color:#C8A97E;font-weight:500;border-top:1px solid rgba(0,0,0,0.07);">${slot || '—'}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-top:1px solid rgba(0,0,0,0.07);">Name</td>
        <td style="padding:8px 0;color:#0E0E0E;border-top:1px solid rgba(0,0,0,0.07);">${name || '—'}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-top:1px solid rgba(0,0,0,0.07);">WhatsApp</td>
        <td style="padding:8px 0;color:#0E0E0E;border-top:1px solid rgba(0,0,0,0.07);">${wp || '—'}</td>
      </tr>
      ${notes ? `<tr>
        <td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-top:1px solid rgba(0,0,0,0.07);">Notes</td>
        <td style="padding:8px 0;color:#555;border-top:1px solid rgba(0,0,0,0.07);">${notes}</td>
      </tr>` : ''}
    </table>
  `;
}

// ─── FORM SUBMISSION → GOOGLE SHEETS ───
document.addEventListener('DOMContentLoaded', function () {
  // Set today as minimum date
  const dateInput = document.getElementById('apptDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateStep(3)) return;

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Collect form data
    const bookingData = {
      timestamp:    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name:         document.getElementById('fullName').value.trim(),
      whatsapp:     document.getElementById('whatsapp').value.trim(),
      service:      document.getElementById('service').value,
      gender:       document.getElementById('gender').value,
      date:         document.getElementById('apptDate').value,
      slot:         document.getElementById('timeSlot').value,
      notes:        document.getElementById('notes').value.trim(),
      status:       'New Lead'
    };

    try {
      // Send to Google Sheets via Apps Script Web App
      if (GOOGLE_SHEET_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        await fetch(GOOGLE_SHEET_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',  // Google Apps Script requires no-cors
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
      }

      // Show success state regardless (no-cors means we can't read the response)
      showSuccess();

    } catch (error) {
      // Even if fetch fails, show success to user (data may still go through with no-cors)
      console.error('Submission error:', error);
      showSuccess();
    }
  });
});

function showSuccess() {
  document.getElementById('bookingFormCard').querySelector('form').style.display = 'none';
  document.getElementById('bookingSuccess').classList.add('visible');
  document.querySelectorAll('.bstep').forEach(s => s.classList.add('done'));
  window.scrollTo({ top: 200, behavior: 'smooth' });
}
