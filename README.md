# 📇 Digital Visiting Card — Sanjaybhai Satbhai (Horizontal 3D Metal Card)

Ek modern, **horizontal (landscape) 3D metal credit-card style** digital visiting card — bina kisi framework ya build step ke (pure vanilla HTML, CSS, JavaScript). Static deploy ke liye ready hai (Vercel, Netlify, GitHub Pages waghera).

---

## 🎯 Concept

Hamare ghar ke bade log (parents) maps use nahi kar paate, aur mehmaano ko address manually baar-baar WhatsApp par text karna padta hai.
Ye ek shareable link hai jisme:
- **Front:** Name, city, aur dono contacts (+91 87804 53658 & +91 63510 15778). Tap par dialer khulega ya mailto khulega. Long press par number copy ho jayega.
- **Back:** Complete address, landmark, dark-style SVG map illustration aur scan karne ke liye Google Maps ka QR code.
- **Buttons:** Flip Card, Open in Maps, Copy Address, aur Save Contact (.vcf download).

---

## ✨ Design & Features

| Feature | Detail |
|---|---|
| **Orientation** | **Horizontal (Landscape)** — Standard credit-card ratio (`aspect-ratio: 1.586`) |
| **Material Look** | Black brushed metal (repeating linear lines + dynamic conic gradient angles) |
| **Interactive Lighting** | Pointer tracking glint + dynamic sweep shine on card rotation |
| **Embossed Decor** | Silver chip, do diagonal slashes, aur embossed 'S' monogram |
| **Free 3D Rotation** | Touch / mouse drag se kisi bhi direction me ghuma sakte hain, with inertia |
| **Lazy Drag Start** | 6px threshold ke baad hi drag start hota hai, taaki phone number/email par tap karne se link click miss na ho |
| **Tap to Flip** | Card par halka tap karne se front aur back switch ho jata hai |
| **Long Press Copy** | ~500ms tak hold karne par number/email/address copy ho jata hai, saath me toast aur haptic feedback |
| **Fallback Copy Modal** | Agar browser clipboard permission block kare to text box popup khulega |
| **Save Contact (vCard)** | `.vcf` file generate hoti hai jisme Sanjaybhai aur Darshan Satbhai dono ke contacts, address aur map link save hote hain |
| **PWA & Mobile Ready** | `manifest.json`, theme-color, touch icons, aur viewport-fit=cover |
| **WhatsApp Preview** | Open Graph meta tags jisse WhatsApp par link bhejne par proper card preview dikhta hai |
| **Keyboard Accessibility** | Enter / Space / F se flip, Arrow keys se nudge rotate |
| **Reduced Motion** | `prefers-reduced-motion` settings ka dhyan rakha gaya hai |

---

## 📁 File Structure

```text
visiting-card/
├── index.html          # Main web page (Semantic HTML, SVG, Meta tags)
├── manifest.json       # PWA manifest (Add to Home screen)
├── README.md           # Documentation & deploy guide
├── css/
│   └── style.css       # Horizontal card styles, brushed metal, lighting, responsive cqw
├── js/
│   ├── config.js       # ⚙️ SAARA CONTENT YAHAN HAI (Sirf ise edit karo)
│   └── app.js          # 3D physics, inertia, pointer events, QR code, vCard generator
└── icons/
    └── icon-192.svg    # PWA / shortcut icon
```

---

## ⚙️ Details Kaise Badlein?

Sirf **`js/config.js`** file kholo aur details edit kar lo:

```javascript
const CONFIG = Object.freeze({
  ownerName: "Sanjaybhai Satbhai",
  tagline: "Amraiwadi · Ahmedabad",
  badgeText: "Digital\nVisiting Card",
  monogram: "S",

  contact1: {
    name: "Sanjaybhai",
    phone: "+91 87804 53658",
    email: "satbhaisanjay4@gmail.com",
  },

  contact2: {
    name: "Darshan",
    fullName: "Darshan Satbhai",
    relation: "Son",
    phone: "+91 63510 15778",
    email: "darshansatbhai38@gmail.com",
  },

  address: "58, Vimalnagar, Opp. Ramnagar, Bhagwatinagar Road, Amraiwadi, Ahmedabad - 380026",
  landmark: "Ambe Mataji Temple, Vimalnagar",
  mapsUrl: "https://maps.app.goo.gl/1ZLVua1iEhd3Xt8j7",

  vcardFilename: "Sanjaybhai_Satbhai_Family.vcf",
});
```

---

## 🚀 Deployment Guide (Vercel & Netlify)

Ye ek **pure static site** hai, koi node build command ya framework nahi chahiye.

### Vercel par:
1. `visiting-card` folder ko GitHub repository me push karo, ya Vercel CLI use karo (`vercel deploy`).
2. Agar Vercel Dashboard use kar rahe ho:
   - **Framework Preset:** `Other`
   - **Build Command:** *(Khaali chhod do)*
   - **Output Directory:** `.` *(Root)*
3. **Deploy** button daba do! 10 second me link live ho jayega.

### Netlify par:
1. [app.netlify.com](https://app.netlify.com) par jao.
2. `visiting-card` folder ko drag and drop kardo **"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"** section me.
3. Done! Instant URL mil jayega.

---

## ✅ Testing Checklist

### 📱 Mobile Phone Test:
- [ ] Card horizontal (landscape aspect ratio) dikh raha hai.
- [ ] Number par halka tap karo -> Phone dialer khula.
- [ ] Email par tap karo -> Mail client khula.
- [ ] Number ya address par 500ms hold (long-press) karo -> "Copy ho gaya ✓" toast aaya.
- [ ] Card drag karne par smooth free-rotation aur inertia feel ho rahi hai.
- [ ] Card par tap karne par 180° flip ho raha hai.
- [ ] "Open in Maps" button dabane par Google Maps app/browser khula.
- [ ] Camera se QR code scan karne par Google Maps link khula.
- [ ] "Save contact" button dabane par `.vcf` file download hui aur phone contacts me dono number save hue.

### 💻 Laptop / Desktop Test:
- [ ] Mouse se drag karne par dynamic sweep shine aur glint light effect smoothly move ho raha hai.
- [ ] Right-click karne par default context menu card par disable hai.
- [ ] Keyboard: `Enter`, `Space`, ya `F` dabane par card flip hota hai.
- [ ] Arrow keys (`←`, `→`, `↑`, `↓`) dabane par card rotate hota hai.
