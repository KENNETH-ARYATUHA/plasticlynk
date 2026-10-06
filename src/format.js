// ---------------------------------------------------------------------------
// format.js — small display helpers.
// Written by hand (no Intl) so output is identical on every Android phone.
// ---------------------------------------------------------------------------

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// 38500 -> "UGX 38,500"
export const formatUGX = (n) =>
  'UGX ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ISO string -> "05 Oct 2026, 10:42"
export const formatDateTime = (iso) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${dd} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
};

// True if an ISO string falls on today's date (used for "Today" stats)
export const isToday = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};