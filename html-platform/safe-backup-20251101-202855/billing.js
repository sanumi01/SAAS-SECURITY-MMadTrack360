const Billing = (() => {
const Plans = {
basic: { key:'basic', name:'Basic', price: 14.99, staffLimit: 25, trialDays: 14 },
pro: { key:'pro', name:'Pro', price: 39.99, staffLimit: 100, trialDays: 0 },
advance: { key:'advance', name:'Advance', price: 49.99, staffLimit: 250, trialDays: 0 },
enterprise:{ key:'enterprise',name:'Enterprise',price: null, staffLimit: Infinity, trialDays:0 }
};
const OFFERS = {
LAUNCH50: { type:'percent', value:50, desc:'50% off first 3 months' },
ANNUAL20: { type:'percent', value:20, desc:'20% off annual plans' },
REFER100: { type:'credit', value:100, desc:'£100 account credit' }
};
const getSubscription = () => { try { return JSON.parse(localStorage.getItem('subscription') || 'null'); } catch { return null; } };
const saveSubscription = (sub) => localStorage.setItem('subscription', JSON.stringify(sub));
const startTrialBasic = (currency='GBP', intendedPlan=null) => {
const start = new Date(); const end = new Date(start); end.setDate(end.getDate() + 14);
const sub = { plan:'basic', status:'trial', trialStart:start.toISOString(), trialEnd:end.toISOString(), currency, offerCode:null, credits:0, billingPeriod:'monthly', intendedPlan };
saveSubscription(sub); return sub;
};
const daysLeft = () => {
const sub = getSubscription(); if (!sub?.trialEnd) return 0;
const diff = (new Date(sub.trialEnd) - new Date()) / 86400000; return Math.max(0, Math.ceil(diff));
};
const applyOffer = (code) => {
const sub = getSubscription(); if (!sub) return { success:false, message:'No subscription found' };
const key = (code||'').toUpperCase().trim(); const offer = OFFERS[key];
if (!offer) return { success:false, message:'Invalid code' };
sub.offerCode = key; if (offer.type === 'credit') sub.credits = (sub.credits || 0) + offer.value;
saveSubscription(sub); return { success:true, message:'Offer applied: ' + offer.desc, sub };
};
const amountDue = (planKey, period='monthly') => {
const sub = getSubscription(); const plans = Plans[planKey] || Plans.basic; if (!plans.price) return 0;
let base = plans.price; if (period === 'annual') base = +(plans.price * 12 * 0.85).toFixed(2);
if (sub?.offerCode && OFFERS[sub.offerCode]?.type==='percent') base = +(base * (1 - OFFERS[sub.offerCode].value/100)).toFixed(2);
if (sub?.credits) base = Math.max(0, +(base - sub.credits).toFixed(2)); return base;
};
const activatePlan = (planKey, period='monthly') => {
const plans = Plans[planKey] || Plans.basic; const sub = getSubscription() || {};
sub.plan = plans.key; sub.status = plans.price ? 'active' : 'contact'; sub.billingPeriod = period; sub.activatedAt = new Date().toISOString();
saveSubscription(sub); return sub;
};
const requireActiveOrTrial = () => {
const sub = getSubscription(); if (!sub) { location.href='pricing.html'; return false; }
if (sub.status === 'trial' && daysLeft() <= 0) { alert('Your Basic trial has ended. Please activate a plan to continue.'); location.href = 'billing.html'; return false; }
return true;
};
return { Plans, getSubscription, saveSubscription, startTrialBasic, daysLeft, applyOffer, amountDue, activatePlan, requireActiveOrTrial };
})();
window.Billing = Billing;
