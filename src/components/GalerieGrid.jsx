import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496846/Extrtiot_gjxge4.png", alt: "Vue extérieure du domaine" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496829/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--4-min_ks62ta.jpg", alt: "Façade du gîte" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496827/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--12-min_txmvr9.jpg", alt: "Chambre principale" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496825/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--7-min_lwdl1c.jpg", alt: "Espace de vie" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496824/-min_arzzxi.jpg", alt: "Détail intérieur" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496824/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--2-min_d7q72t.jpg", alt: "Salon" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496824/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--5-min_r1rhsh.jpg", alt: "Véranda" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496823/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--6-min_ubvych.jpg", alt: "Cuisine équipée" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496823/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--8-min_zqfv9u.jpg", alt: "Chambre 2" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496822/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--11-min_qpwouh.jpg", alt: "Salle de bain" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496822/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--9-min_xuheyg.jpg", alt: "Terrasse" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496821/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--13-min_ojckex.jpg", alt: "Jardin" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496821/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--10-min_njkvk2.jpg", alt: "Vue sur le parc" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496821/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--14-min_axmqnm.jpg", alt: "Détail architectural" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496819/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--min_yjpdiv.jpg", alt: "Vue générale" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496818/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--16-min_ripw4z.jpg", alt: "Chambre 3" },
  { src: "https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496818/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--17-min_vdtfyt.jpg", alt: "Vue du domaine" },
];

export default function GalerieGrid() {
  const [selected, setSelected] = useState(null);
  const selectedIdx = selected !== null ? images.findIndex(i => i.src === selected.src) : -1;

  const prev = (e) => {
    e.stopPropagation();
    setSelected(images[(selectedIdx - 1 + images.length) % images.length]);
  };
  const next = (e) => {
    e.stopPropagation();
    setSelected(images[(selectedIdx + 1) % images.length]);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!selected) return;
      if (e.key === 'ArrowLeft') setSelected(images[(selectedIdx - 1 + images.length) % images.length]);
      if (e.key === 'ArrowRight') setSelected(images[(selectedIdx + 1) % images.length]);
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, selectedIdx]);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <>
      <div className="gallery-grid">
        {images.map((img, i) => (
          <div key={i} className="gallery-item" onClick={() => setSelected(img)}>
            <img
              src={img.src}
              alt={img.alt}
              loading={i < 6 ? 'eager' : 'lazy'}
              decoding="async"
              className="gallery-img"
            />
            <div className="gallery-overlay">
              <span className="gallery-caption">{img.alt}</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <button className="lightbox-close" onClick={() => setSelected(null)}>
            <X size={20} />
          </button>
          <div className="lightbox-counter">{selectedIdx + 1} / {images.length}</div>
          <button className="lightbox-prev" onClick={prev}><ChevronLeft size={32} /></button>
          <img
            src={selected.src}
            alt={selected.alt}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
          <button className="lightbox-next" onClick={next}><ChevronRight size={32} /></button>
          <div className="lightbox-caption">{selected.alt}</div>
          <div className="lightbox-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`lightbox-dot${i === selectedIdx ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelected(images[i]); }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .gallery-grid {
          columns: 3;
          column-gap: 10px;
          line-height: 0;
        }
        .gallery-item {
          break-inside: avoid;
          margin-bottom: 10px;
          cursor: pointer;
          overflow: hidden;
          border-radius: 3px;
          position: relative;
          display: block;
        }
        .gallery-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .gallery-item:hover .gallery-img { transform: scale(1.05); }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20,35,25,0.55) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: flex-end;
          padding: 14px;
        }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-caption {
          color: white;
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-style: italic;
          letter-spacing: 0.05em;
        }
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(8,12,10,0.97);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 80px;
        }
        .lightbox-close {
          position: absolute; top: 20px; right: 20px;
          color: rgba(255,255,255,0.6);
          background: none;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .lightbox-close:hover { color: white; border-color: rgba(255,255,255,0.4); }
        .lightbox-counter {
          position: absolute; top: 26px; left: 50%; transform: translateX(-50%);
          font-family: 'Inter', sans-serif; font-size: 10px;
          letter-spacing: 0.25em; color: rgba(255,255,255,0.35); text-transform: uppercase;
        }
        .lightbox-prev, .lightbox-next {
          position: absolute; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.45); background: none; border: none;
          cursor: pointer; padding: 16px; transition: color 0.2s;
        }
        .lightbox-prev { left: 12px; }
        .lightbox-next { right: 12px; }
        .lightbox-prev:hover, .lightbox-next:hover { color: white; }
        .lightbox-img {
          max-width: 100%; max-height: 80vh; object-fit: contain;
          border-radius: 2px; box-shadow: 0 50px 150px rgba(0,0,0,0.9);
        }
        .lightbox-caption {
          position: absolute; bottom: 42px; left: 50%; transform: translateX(-50%);
          font-family: 'Cormorant Garamond', serif; font-size: 15px;
          font-style: italic; color: rgba(255,255,255,0.45); white-space: nowrap;
        }
        .lightbox-dots {
          position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 5px;
        }
        .lightbox-dot {
          height: 4px; border-radius: 2px; background: rgba(255,255,255,0.25);
          border: none; cursor: pointer; transition: all 0.3s ease; padding: 0; width: 16px;
        }
        .lightbox-dot.active { background: rgba(255,255,255,0.85); width: 28px; }
        @media (max-width: 900px) {
          .gallery-grid { columns: 2; }
          .lightbox { padding: 50px; }
        }
        @media (max-width: 500px) {
          .gallery-grid { columns: 1; }
          .lightbox { padding: 50px 10px; }
          .lightbox-prev { left: 2px; }
          .lightbox-next { right: 2px; }
        }
      `}</style>
    </>
  );
}
