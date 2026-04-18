import React, { useState, useEffect, useMemo } from 'react';
import { Send, CheckCircle, Calculator } from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const FORMSPREE_ID = 'xdapyjbz';

const firebaseConfig = {
  apiKey: "AIzaSyBiGQKhFbak81_zVBBeHOLGjSpuJ68EKmg",
  authDomain: "resa-gite.firebaseapp.com",
  projectId: "resa-gite",
  storageBucket: "resa-gite.firebasestorage.app",
  messagingSenderId: "773467849323",
  appId: "1:773467849323:web:15eadc8bd0ea294061a72e"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const VACANCES_MOYENNES = [
  { start: '2024-10-19', end: '2024-11-04' },
  { start: '2025-02-08', end: '2025-02-24' },
  { start: '2025-04-05', end: '2025-04-22' },
  { start: '2025-10-18', end: '2025-11-03' },
  { start: '2026-02-14', end: '2026-03-02' },
  { start: '2026-04-04', end: '2026-04-20' },
  { start: '2026-10-17', end: '2026-11-02' },
  { start: '2027-02-13', end: '2027-03-01' },
  { start: '2027-04-10', end: '2027-04-26' },
  { start: '2027-10-23', end: '2027-11-08' },
  { start: '2028-02-19', end: '2028-03-04' },
  { start: '2028-04-08', end: '2028-04-24' },
];

function isHauteSaison(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 7 || m === 8) return true;
  if (m === 12 && d >= 20) return true;
  if (m === 1 && d <= 5) return true;
  return false;
}

function getSaison(date) {
  if (isHauteSaison(date)) return 'haute';
  const iso = date.toISOString().slice(0, 10);
  if (VACANCES_MOYENNES.some(v => iso >= v.start && iso < v.end)) return 'moyenne';
  return 'basse';
}

const TARIFS = {
  semaine: { basse: 740, moyenne: 840, haute: 930 },
  nuits: {
    2: { basse: 390, moyenne: 430, haute: 470 },
    3: { basse: 480, moyenne: 530, haute: 580 },
    4: { basse: 560, moyenne: 620, haute: 680 },
    5: { basse: 630, moyenne: 700, haute: 770 },
    6: { basse: 690, moyenne: 770, haute: 930 },
  },
};

const SAISON_LABEL = { basse: 'Basse saison', moyenne: 'Moyenne saison', haute: 'Haute saison' };
const SAISON_COLOR = { basse: 'text-blue-600', moyenne: 'text-amber-600', haute: 'text-primary' };

function toInputDate(date) {
  return date.toISOString().slice(0, 10);
}
function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return toInputDate(d);
}
function today() {
  return toInputDate(new Date());
}

// Génère toutes les dates entre arrival et departure (exclus)
function getDatesBetween(arrival, departure) {
  const dates = [];
  const current = new Date(arrival);
  const end = new Date(departure);
  while (current < end) {
    dates.push(toInputDate(new Date(current)));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    arrival: '', departure: '', guests: '', message: '',
  });
  const [status, setStatus] = useState('idle');
  const [bookedDates, setBookedDates] = useState([]);

  // Charge les dates réservées depuis Firestore
  useEffect(() => {
    async function fetchReservations() {
      const snap = await getDocs(collection(db, 'reservations'));
      const dates = [];
      snap.forEach(doc => {
        const { arrival, departure } = doc.data();
        if (arrival && departure) {
          dates.push(...getDatesBetween(arrival, departure));
        }
      });
      setBookedDates([...new Set(dates)]);
    }
    fetchReservations();
  }, []);

  // Première date disponible
  const firstAvailable = useMemo(() => {
    let d = today();
    while (bookedDates.includes(d)) {
      d = addDays(d, 1);
    }
    return d;
  }, [bookedDates]);

  const minArrival = firstAvailable;

  const minDeparture = useMemo(() => {
    if (!form.arrival) return today();
    return isHauteSaison(new Date(form.arrival))
      ? addDays(form.arrival, 6)
      : addDays(form.arrival, 1);
  }, [form.arrival]);

  // Prochaine date réservée après l'arrivée (pour bloquer le départ)
  const maxDeparture = useMemo(() => {
    if (!form.arrival) return '';
    const sorted = bookedDates
      .filter(d => d > form.arrival)
      .sort();
    return sorted.length > 0 ? sorted[0] : '';
  }, [form.arrival, bookedDates]);

  const isDateBooked = (dateStr) => bookedDates.includes(dateStr);

  const handleChange = (e) => {
    if (e.target.name === 'arrival') {
      const newArrival = e.target.value;
      if (isDateBooked(newArrival)) return; // bloque la sélection
      const minDep = isHauteSaison(new Date(newArrival))
        ? addDays(newArrival, 6)
        : addDays(newArrival, 1);
      setForm({ ...form, arrival: newArrival, departure: form.departure >= minDep ? form.departure : '' });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const hauteSaisonInfo = form.arrival && isHauteSaison(new Date(form.arrival));

  const prixInfo = useMemo(() => {
    if (!form.arrival || !form.departure || !form.guests) return null;
    const d1 = new Date(form.arrival);
    const d2 = new Date(form.departure);
    if (d2 <= d1) return null;
    const nuits = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    if (nuits < 1) return null;
    if (nuits > 6) return { surDemande: true, nuits };
    const saison = getSaison(d1);
    const base = TARIFS.nuits[nuits]?.[saison] ?? null;
    if (!base) return null;
    const nbPersonnes = parseInt(form.guests);
    const taxeSejour = Math.round(nbPersonnes * 0.22 * nuits * 100) / 100;
    return { surDemande: false, base, taxeSejour, total: base + taxeSejour, nuits, saison };
  }, [form.arrival, form.departure, form.guests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          _subject: `Demande de réservation — ${form.name}${prixInfo && !prixInfo.surDemande ? ` — ~${prixInfo.total.toFixed(0)}€` : ''}`,
          estimation_prix: prixInfo
            ? prixInfo.surDemande
              ? `Prix sur demande (${prixInfo.nuits} nuits)`
              : `${prixInfo.total.toFixed(2)}€ (${SAISON_LABEL[prixInfo.saison]}, ${prixInfo.nuits} nuits)`
            : 'Non calculé',
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', arrival: '', departure: '', guests: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-card rounded-2xl p-10 border border-border shadow-sm flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <CheckCircle className="w-14 h-14 text-primary" />
        <h3 className="font-heading text-2xl text-foreground">Message envoyé !</h3>
        <p className="font-body text-muted-foreground text-sm max-w-sm">
          Merci pour votre demande. Nous vous répondrons dans les meilleurs délais pour confirmer les disponibilités.
        </p>
        <button onClick={() => setStatus('idle')} className="mt-2 font-body text-sm text-primary hover:underline">
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block font-body text-sm font-medium text-foreground mb-1.5">Nom complet *</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Votre nom"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-1.5">Email *</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="votre@email.com"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block font-body text-sm font-medium text-foreground mb-1.5">Téléphone</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+33 6 00 00 00 00"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="arrival" className="block font-body text-sm font-medium text-foreground mb-1.5">Arrivée *</label>
          <input id="arrival" name="arrival" type="date" required
            min={minArrival}
            value={form.arrival}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
          {hauteSaisonInfo && (
            <p className="font-body text-xs text-primary mt-1">☀️ Haute saison — 6 nuits minimum</p>
          )}
        </div>
        <div>
          <label htmlFor="departure" className="block font-body text-sm font-medium text-foreground mb-1.5">Départ *</label>
          <input id="departure" name="departure" type="date" required
            min={minDeparture}
            max={maxDeparture || undefined}
            value={form.departure}
            onChange={handleChange}
            disabled={!form.arrival}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
          {hauteSaisonInfo && form.arrival && (
            <p className="font-body text-xs text-muted-foreground mt-1">
              Au plus tôt le {new Date(minDeparture).toLocaleDateString('fr-FR')}
            </p>
          )}
          {maxDeparture && form.arrival && (
            <p className="font-body text-xs text-muted-foreground mt-1">
              Au plus tard le {new Date(maxDeparture).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="guests" className="block font-body text-sm font-medium text-foreground mb-1.5">Personnes *</label>
          <select id="guests" name="guests" required value={form.guests} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
            <option value="">—</option>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
      </div>

      {prixInfo && (
        prixInfo.surDemande ? (
          <div className="rounded-xl bg-muted/50 border border-border p-4 flex items-center gap-3">
            <Calculator className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-foreground">{prixInfo.nuits} nuits — Prix sur demande</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Pour les séjours de plus de 6 nuits, nous vous enverrons un tarif personnalisé.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="font-body text-sm font-medium text-foreground">Estimation du prix</span>
              <span className={`font-body text-xs px-2 py-0.5 rounded-full bg-primary/10 ${SAISON_COLOR[prixInfo.saison]}`}>
                {SAISON_LABEL[prixInfo.saison]}
              </span>
            </div>
            <div className="flex justify-between font-body text-sm text-muted-foreground">
              <span>{prixInfo.nuits} nuit{prixInfo.nuits > 1 ? 's' : ''}</span>
              <span>{prixInfo.base}€</span>
            </div>
            <div className="flex justify-between font-body text-sm text-muted-foreground">
              <span>Taxe de séjour ({form.guests} pers. × {prixInfo.nuits} nuits × 0,22€)</span>
              <span>{prixInfo.taxeSejour.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between font-body text-sm font-semibold text-foreground border-t border-primary/20 pt-2">
              <span>Total estimé</span>
              <span className="text-primary">{prixInfo.total.toFixed(2)}€</span>
            </div>
            <p className="font-body text-xs text-muted-foreground">* Estimation indicative, tarif définitif confirmé par email.</p>
          </div>
        )
      )}

      <div>
        <label htmlFor="message" className="block font-body text-sm font-medium text-foreground mb-1.5">Message</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange}
          placeholder="Questions ou demandes particulières…" rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
      </div>

      {status === 'error' && (
        <p className="font-body text-sm text-red-500">Une erreur est survenue. Réessayez ou contactez-nous par email.</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-full font-body font-medium text-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-60">
        {status === 'sending' ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Envoyer la demande
            {prixInfo && !prixInfo.surDemande && (
              <span className="ml-1 opacity-90">({prixInfo.total.toFixed(2)}€ estimé)</span>
            )}
          </>
        )}
      </button>

      <p className="font-body text-xs text-muted-foreground text-center">
        * Champs obligatoires. Réponse sous 24–48h.
      </p>
    </form>
  );
}
