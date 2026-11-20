/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  VISITING CARD — CONFIG                                     ║
 * ║  Saara content yahan badlo. Baaki code ko chhuna nahi padega.║
 * ╚══════════════════════════════════════════════════════════════╝
 */
"use strict";

const CONFIG = Object.freeze({
  /* ── Meta & OG ───────────────────────────────────── */
  siteTitle: "Sanjaybhai Satbhai — Digital Visiting Card",
  siteDescription: "Contact info, ghar ka pata aur Google Maps location — Sanjaybhai Satbhai, Amraiwadi, Ahmedabad.",
  siteUrl: "https://satbhai-address.vercel.app",
  ogImage: "", // optional social preview image URL

  /* ── Card Front ──────────────────────────────────── */
  ownerName: "Sanjaybhai Satbhai",
  tagline: "Amraiwadi · Ahmedabad",
  badgeText: "Digital\nVisiting Card",
  monogram: "S",

  /* Contact 1 (Primary) */
  contact1: {
    name: "Sanjaybhai",
    phone: "+91 87804 53658",
    email: "satbhaisanjay4@gmail.com",
  },

  /* Contact 2 (Son) */
  contact2: {
    name: "Darshan",
    fullName: "Darshan Satbhai",
    relation: "Son",
    phone: "+91 63510 15778",
    email: "darshansatbhai38@gmail.com",
  },

  /* ── Card Back ───────────────────────────────────── */
  address: "58, Vimalnagar, Opp. Ramnagar, Bhagwatinagar Road, Amraiwadi, Ahmedabad - 380026",
  landmark: "Ambe Mataji Temple, Vimalnagar",
  mapsUrl: "https://maps.app.goo.gl/1ZLVua1iEhd3Xt8j7",

  /* ── vCard (.vcf) download filename ──────────────── */
  vcardFilename: "Sanjaybhai_Satbhai_Family.vcf",

  /* ── Toast Messages ──────────────────────────────── */
  toastCopied: "Copy ho gaya ✓",
  toastSaved: "Contact file (.vcf) download ho gayi ✓",
  toastCopyFail: "Auto copy nahi hua. Neeche ka text select karke copy kar lo.",
});
