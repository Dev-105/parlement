import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1500);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const requestTypes = [
    { icon: 'bi bi-briefcase-fill', title: 'Stages Professionnels', desc: 'Opportunités de formation pratique au sein du parlement' },
    { icon: 'bi bi-newspaper', title: 'Accréditation Presse', desc: 'Couverture médiatique des sessions parlementaires' },
    { icon: 'bi bi-book-fill', title: 'Archives & Bibliothèque', desc: 'Accès aux documents historiques et recherches' },
    { icon: 'bi bi-people-fill', title: 'Visites Guidées', desc: 'Découverte des institutions parlementaires' }
  ];

  const stats = [
    { value: '2,500+', label: 'Demandes traitées', icon: 'bi bi-check-circle-fill' },
    { value: '99%', label: 'Taux de satisfaction', icon: 'bi bi-star-fill' },
    { value: '48h', label: 'Délai moyen', icon: 'bi bi-clock-fill' },
    { value: '24/7', label: 'Support disponible', icon: 'bi bi-headset' }
  ];

  const testimonials = [
    { name: 'Fatima Zahra', role: 'Journaliste', text: 'Plateforme exceptionnelle qui a grandement facilité mon accréditation pour couvrir les sessions importantes.', rating: 5 },
    { name: 'Mohamed Ali', role: 'Chercheur', text: 'Accès rapide aux archives parlementaires. Un gain de temps considérable pour mes recherches académiques.', rating: 5 },
    { name: 'Karim Benjelloun', role: 'Étudiant', text: 'Processus clair et suivi transparent. Mon dossier de stage a été traité en moins de 48 heures.', rating: 5 }
  ];

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="fixed top-0 w-full z-50 bg-white/95 py-6 animate-pulse border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="hidden sm:block space-y-2">
                 <div className="h-5 w-24 bg-gray-200 rounded-lg"></div>
                 <div className="h-3 w-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="hidden md:flex gap-8">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-4 w-16 bg-gray-100 rounded-lg"></div>)}
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-gray-100 rounded-full"></div>
              <div className="h-10 w-32 bg-orange-100 rounded-full"></div>
            </div>
          </div>
        </nav>

        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/50"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="h-8 w-32 bg-orange-100 rounded-full mb-6"></div>
                <div className="space-y-4 mb-8">
                  <div className="h-16 w-3/4 bg-gray-200 rounded-xl"></div>
                  <div className="h-16 w-1/2 bg-orange-100 rounded-xl"></div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 w-full bg-gray-100 rounded-lg"></div>
                  <div className="h-4 w-4/5 bg-gray-100 rounded-lg"></div>
                  <div className="h-4 w-3/5 bg-gray-100 rounded-lg"></div>
                </div>
                <div className="flex gap-4 mb-12">
                  <div className="h-14 w-48 bg-orange-100 rounded-full"></div>
                  <div className="h-14 w-48 bg-gray-100 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-orange-50/50 rounded-2xl border border-orange-100"></div>)}
                </div>
              </div>
              <div className="hidden lg:block h-[500px] w-full bg-gray-100 rounded-3xl border border-gray-200"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Top Banner with parlement.png - low opacity */}
      <div className="fixed top-0 left-0 w-full h-64 z-0 pointer-events-none">
        <img 
          src="/parlement.png" 
          alt="Parlement Background" 
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white shadow-lg py-3' 
          : 'bg-white/95 backdrop-blur-sm py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/royaumeDuMarocLogo.png" 
                alt="Royaume du Maroc Logo" 
                className="h-12 w-auto object-contain"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-orange-600">PARLEMENT</span>
                <span className="text-xs text-gray-400 block -mt-1">MAROC</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {['Services', 'Processus', 'Témoignages', 'Contact'].map((item, idx) => (
                <a 
                  key={idx}
                  href={`#${item.toLowerCase()}`} 
                  className="text-gray-700 hover:text-orange-500 transition-all duration-300 text-sm font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-5 py-2 text-gray-700 hover:text-orange-500 text-sm font-medium transition-all duration-300"
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-700 text-xs font-semibold tracking-wider">SERVICE OFFICIEL</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Gestion des
                <span className="block text-orange-500">
                  Demandes Parlementaires
                </span>
              </h1>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-lg">
                Plateforme officielle de soumission et de suivi des requêtes parlementaires. 
                Simplifiez vos démarches administratives en toute transparence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Déposer une demande
                  <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
                >
                  Suivre ma demande
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                {stats.map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="bg-orange-50 rounded-2xl p-4 text-center hover:bg-orange-100 transition-all duration-300"
                  >
                    <i className={`${stat.icon} text-orange-500 text-2xl mb-2 block`}></i>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/parlement.png"
                  alt="Parliament"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-orange-500 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 bg-orange-100 rounded-full mb-4">
              <span className="text-orange-700 text-sm font-semibold">Nos Services</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Types de demandes
            </h2>
            <p className="text-gray-600 text-lg">
              Notre plateforme couvre l'ensemble des besoins administratifs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {requestTypes.map((type, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                  <i className={`${type.icon} text-orange-500 text-2xl group-hover:text-white transition-colors duration-300`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processus" className="py-24 bg-orange-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 bg-orange-200 rounded-full mb-4">
              <span className="text-orange-800 text-sm font-semibold">Comment ça marche</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Processus simplifié
            </h2>
            <p className="text-gray-600 text-lg">
              Trois étapes simples pour déposer votre demande
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'Inscription', 
                desc: 'Créez votre compte et complétez votre profil en quelques minutes',
                icon: 'bi bi-person-plus-fill'
              },
              { 
                step: '02', 
                title: 'Soumission', 
                desc: 'Choisissez le type de demande et remplissez le formulaire détaillé',
                icon: 'bi bi-file-text-fill'
              },
              { 
                step: '03', 
                title: 'Suivi', 
                desc: 'Consultez l\'état d\'avancement de votre dossier en temps réel',
                icon: 'bi bi-graph-up'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <i className={`${step.icon} text-orange-500 text-2xl`}></i>
                  </div>
                  <div className="text-6xl font-bold text-orange-100 absolute top-0 right-0">{step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Redesigned */}
      <section id="témoignages" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 bg-orange-100 rounded-full mb-4">
              <span className="text-orange-700 text-sm font-semibold">Témoignages</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ce qu'ils disent
            </h2>
            <p className="text-gray-600 text-lg">
              Découvrez les retours d'expérience de nos utilisateurs
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Testimonial Cards Container */}
            <div className="relative min-h-[400px]">
              {testimonials.map((testimonial, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    activeTestimonial === idx 
                      ? 'opacity-100 translate-x-0 z-10' 
                      : 'opacity-0 translate-x-full z-0'
                  }`}
                >
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-10 shadow-xl border border-orange-100">
                    {/* Quote Icon */}
                    <div className="absolute top-8 right-8">
                      <i className="bi bi-quote text-7xl text-orange-200"></i>
                    </div>
                    
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-orange-400 text-lg"></i>
                      ))}
                    </div>
                    
                    {/* Testimonial Text */}
                    <p className="text-gray-700 text-xl leading-relaxed mb-8 relative z-10">
                      "{testimonial.text}"
                    </p>
                    
                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-6 border-t border-orange-100">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-orange-600 text-sm font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`transition-all duration-300 ${
                    activeTestimonial === idx 
                      ? 'w-10 h-2.5 bg-orange-500 rounded-full' 
                      : 'w-2.5 h-2.5 bg-gray-300 rounded-full hover:bg-orange-300'
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4">
              <button 
                onClick={() => setActiveTestimonial((activeTestimonial - 1 + testimonials.length) % testimonials.length)}
                className="pointer-events-auto w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-orange-500 hover:text-orange-600 transition-all duration-300 border border-orange-100"
              >
                <i className="bi bi-chevron-left text-xl"></i>
              </button>
              <button 
                onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)}
                className="pointer-events-auto w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-orange-500 hover:text-orange-600 transition-all duration-300 border border-orange-100"
              >
                <i className="bi bi-chevron-right text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="contact" className="py-24 relative z-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="/bannerParlement.png" 
            alt="Banner Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/95 to-orange-800/95"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">À propos du service</h2>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                Le service de gestion des demandes parlementaires est une plateforme officielle 
                destinée à faciliter les échanges entre les citoyens, les institutions et le parlement.
              </p>
              <p className="text-white/80 mb-8 leading-relaxed">
                Notre mission est de moderniser et d'accélérer le traitement des requêtes 
                administratives dans un cadre transparent et sécurisé.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <i className="bi bi-shield-check text-orange-300"></i>
                  <span className="text-sm text-white">Données sécurisées</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <i className="bi bi-clock text-orange-300"></i>
                  <span className="text-sm text-white">Traitement rapide</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <i className="bi bi-headset text-orange-300"></i>
                  <span className="text-sm text-white">Support dédié</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/20">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <i className="bi bi-envelope-paper text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1 text-lg">Contact administratif</h4>
                  <p className="text-white/70">contact@parlement.ma</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <i className="bi bi-telephone text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1 text-lg">Support technique</h4>
                  <p className="text-white/70">+212 537 76 00 00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Prêt à déposer votre demande ?
          </h2>
          <p className="text-white/90 text-xl mb-8">
            Rejoignez notre plateforme et bénéficiez d'un traitement rapide et transparent
          </p>
          <Link 
            to="/register" 
            className="group inline-flex items-center gap-2 px-10 py-5 bg-white text-orange-600 font-bold rounded-full hover:shadow-xl transition-all duration-300"
          >
            Créer un compte
            <i className="bi bi-arrow-right text-xl group-hover:translate-x-2 transition-transform duration-300"></i>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/royaumeDuMarocLogo.png" 
                  alt="Royaume du Maroc Logo" 
                  className="h-10 w-auto object-contain"
                />
                <span className="text-white font-semibold text-lg">PARLEMENT</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Service officiel de gestion des demandes parlementaires
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-orange-400 transition-colors duration-200">Services</a></li>
                <li><a href="#processus" className="hover:text-orange-400 transition-colors duration-200">Processus</a></li>
                <li><a href="#témoignages" className="hover:text-orange-400 transition-colors duration-200">Témoignages</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors duration-200">Mentions légales</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors duration-200">Confidentialité</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors duration-200">CGU</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                  <i className="bi bi-envelope text-xs"></i>
                  <span>contact@parlement.ma</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                  <i className="bi bi-telephone text-xs"></i>
                  <span>+212 537 76 00 00</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            <p>© 2026 Parlement du Maroc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Add bounce animation */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;