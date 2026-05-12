# Artistry Unisex Salon — Agra
## Luxury Website Package

---

## Files Included

```
artistry-salon/
├── index.html              ← Main homepage
├── booking.html            ← Slot booking page
├── css/
│   └── style.css           ← All styles (luxury editorial theme)
├── js/
│   ├── main.js             ← Navigation, tabs, sliders, animations
│   └── booking.js          ← Multi-step booking form + Sheets integration
└── pages/
    └── sheets-script.js    ← Google Apps Script (paste into Google Sheets)
```

---

## Quick Setup Guide

### Step 1 — Replace Placeholder Content
Open `index.html` and `booking.html` and update:

| Placeholder | Replace With |
|---|---|
| `+91 XXXXXXXXXX` | Salon's actual WhatsApp number |
| `Your Salon Address, Agra` | Real salon address |
| `artistryunisexsalon@gmail.com` | Owner's email (in sheets-script.js) |

### Step 2 — Add Hero & Service Photos
Replace the grey placeholder boxes with real images:
- **Hero image**: A cinematic editorial photo (dark background, rim lighting)
- **Bridal photo**: Best bridal transformation
- **Instagram gallery**: 6 best recent posts

### Step 3 — Connect Google Sheets (Booking Integration)

1. Create a new Google Sheet — name it "Artistry Bookings"
2. Go to **Extensions → Apps Script**
3. Delete all existing code
4. Open `pages/sheets-script.js` and copy the entire file
5. Paste it into Apps Script and click **Save**
6. Click **Deploy → New Deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**, authorize when asked
8. Copy the **Web App URL**
9. Open `js/booking.js` and replace:
   ```js
   const GOOGLE_SHEET_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
   with your actual URL.

### Step 4 — Update Social Links
In `index.html` and `booking.html`:
- Instagram: already set to `@artistryunisexsalon`
- Google Business: update the href with your GMB link

### Step 5 — Host the Website

**Option A — Free (GitHub Pages)**
1. Create a free GitHub account
2. Create a new repository named `artistry-salon`
3. Upload all files maintaining the folder structure
4. Go to Settings → Pages → Source: main branch
5. Your site will be live at `yourusername.github.io/artistry-salon`

**Option B — Professional (Hostinger / Bluehost)**
1. Purchase a domain like `artistryagra.com` (₹800–₹1,200/year)
2. Purchase hosting (₹2,000–₹3,000/year)
3. Upload files via cPanel File Manager
4. Site live at your custom domain

---

## Google Sheets Dashboard Columns

When bookings arrive, your sheet will have these columns:

| Timestamp | Name | WhatsApp | Service | Gender | Date | Slot | Notes | Status |
|---|---|---|---|---|---|---|---|---|

**Status values to use:**
- `New Lead` — just booked
- `Confirmed` — you've confirmed on WhatsApp
- `Visited` — client came in
- `Follow-up Pending` — needs follow-up
- `Cancelled` — cancelled

---

## Customisation Notes

### Colors (css/style.css line 1–20)
```css
--gold:   #C8A97E;   ← Champagne gold (accent)
--black:  #0E0E0E;   ← Matte black (primary)
--beige:  #F7F1EB;   ← Warm beige (backgrounds)
--nude:   #D8B4A0;   ← Soft nude (accents)
```

### Fonts
- Display: `Cormorant Garamond` (elegant serif for headings)
- Body: `Jost` (clean, modern for text)

### Service Prices
Update prices in `index.html` (services section) and `booking.html` (service dropdown)

---

## What's Already Working

✅ Full responsive design (mobile, tablet, desktop)  
✅ Sticky navigation with scroll effect  
✅ Animated hero section  
✅ Service tabs (Women / Men / Bridal)  
✅ Before/after draggable image sliders  
✅ Multi-step booking form (4 steps)  
✅ Google Sheets integration (via Apps Script)  
✅ Booking summary & confirmation screen  
✅ WhatsApp floating button  
✅ Email notification to salon owner on each booking  
✅ Scroll animations on all sections  
✅ Mobile sticky CTA bar  

---

## Brand Guidelines (from strategy document)

**Feel**: Luxury beauty studio meets fashion editorial  
**DO**: Minimal, cinematic, editorial, elegant, premium  
**DON'T**: Glitter, pink gradients, collage layouts, overcrowded sections  

**The website should make clients feel:**  
*"I am booking a premium beauty experience, not a normal parlour appointment."*

---

Designed for Artistry Unisex Salon · Agra · 2026
