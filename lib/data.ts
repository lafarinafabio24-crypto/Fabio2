
import { Interest, NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Interessi', href: '#interessi' },
  { label: 'Chi Sono', href: '#about' },
  { label: 'Contatti', href: '#contatti' },
];

export const INTERESTS: Interest[] = [
  {
    id: 'basket',
    title: 'Basket',
    subtitle: 'Passione & Performance',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop',
    description: 'Il ritmo del parquet e la precisione tecnica. Per me il basket non è solo uno sport, è una filosofia di costanza e visione di gioco.',
    color: 'border-orange-400'
  },
  {
    id: 'calcio',
    title: 'Calcio',
    subtitle: 'Strategia & Squadra',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
    description: 'Dalla tattica pura alla foga competitiva. Il calcio rappresenta l\'essenza del gioco di squadra e la capacità di adattarsi a ogni scenario.',
    color: 'border-teal-400'
  },
  {
    id: 'anime',
    title: 'Anime',
    subtitle: 'Narrativa Visiva',
    image: 'https://lh3.googleusercontent.com/d/1DyffqzwyJjjV_lxnOOsxY8YRjWpxPxDc',
    description: 'Oltre l\'animazione: storie profonde, character design d\'autore e regie che sfidano i limiti del reale. Una fonte costante di ispirazione creativa.',
    color: 'border-purple-400'
  },
  {
    id: 'manga',
    title: 'Manga',
    subtitle: 'L\'Arte del Tratto',
    image: 'https://lh3.googleusercontent.com/d/1LTu6YPpQP-EUPuzp1yneRpcXydjIfaD9',
    description: 'L\'inchiostro su carta che prende vita. Studio la composizione delle tavole e la potenza narrativa racchiusa in un singolo frame in bianco e nero.',
    color: 'border-slate-400'
  }
];

export const ABOUT_TEXT = {
  name: "La Farina Fabio",
  tagline: "Dove la cultura sportiva incontra la pop culture moderna.",
  bio: "Sono Fabio, un professionista con una visione dinamica e moderna. Divido il mio tempo tra l'agonismo dello sport e la profondità estetica della cultura visiva contemporanea. Cerco l'eccellenza in ogni dettaglio, che si tratti di un'azione sul campo o della composizione di una scena creativa. Il mio approccio è diretto, pulito e focalizzato sull'obiettivo."
};
