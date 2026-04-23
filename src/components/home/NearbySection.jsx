import React from 'react';

const highlights = [
  { emoji: '⛪', label: 'Bourges', sublabel: '~30 min · Cité médiévale classée UNESCO' },
  { emoji: '🦁', label: 'Zoo de Beauval', sublabel: "~1h · L'un des plus beaux zoos de France" },
  { emoji: '🏰', label: 'Châteaux de la Loire', sublabel: '~1h30 · Chambord, Chenonceau...' },
  { emoji: '🌲', label: 'Sologne', sublabel: '~20 min · Forêts, étangs, randonnées' },
  { emoji: '🎣', label: 'Pêche & Nature', sublabel: 'Étangs privés à proximité' },
  { emoji: '🚴', label: 'Véloroute Berry', sublabel: 'Pistes cyclables depuis le gîte' },
];

export default function NearbySection() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Explorer</p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">Aux alentours</h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Idéalement situé au cœur de la France, le Gîte de l'Ormoy est une base parfaite
            pour explorer la Sologne, le Berry et bien plus encore.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Map embed */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-96">
            <iframe
              title="Localisation Gîte de l'Ormoy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2709.7689113947526!2d2.2031995121903676!3d47.221103771036844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47fac445a1d35b31%3A0xc91225407655d81f!2sLe%20G%C3%AEte%20de%20l'Ormoy!5e0!3m2!1sfr!2sfr!4v1776966632505!5m2!1sfr!2sfr"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-300"
              >
                <span className="text-2xl">{h.emoji}</span>
                <div>
                  <p className="font-body font-medium text-foreground text-sm">{h.label}</p>
                  <p className="font-body text-muted-foreground text-xs mt-0.5">{h.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
