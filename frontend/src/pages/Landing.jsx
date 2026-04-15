import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const requestTypes = [
    { icon: 'bi bi-briefcase', title: 'Stages', desc: 'Demandes de stages professionnels', color: 'navy' },
    { icon: 'bi bi-newspaper', title: 'Presse', desc: 'Accréditations médias', color: 'navy' },
    { icon: 'bi bi-book', title: 'Bibliothèque', desc: 'Accès aux archives', color: 'navy' },
    { icon: 'bi bi-people', title: 'Visites', desc: 'Visites institutionnelles', color: 'navy' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Professional & Clean */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-3' 
          : 'bg-white/95 backdrop-blur-sm py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-800 rounded flex items-center justify-center">
                <i className="bi bi-bank2 text-white text-lg"></i>
              </div>
              <div>
                <span className="text-xl font-bold text-navy-900 tracking-tight">PARLEMENT</span>
                <span className="text-xs text-gray-500 block -mt-1">MAROC</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-700 hover:text-navy-800 transition-colors text-sm font-medium">Services</a>
              <a href="#process" className="text-gray-700 hover:text-navy-800 transition-colors text-sm font-medium">Processus</a>
              <a href="#about" className="text-gray-700 hover:text-navy-800 transition-colors text-sm font-medium">À propos</a>
              <a href="#contact" className="text-gray-700 hover:text-navy-800 transition-colors text-sm font-medium">Contact</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-5 py-2 text-gray-700 hover:text-navy-800 text-sm font-medium transition-colors"
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 bg-navy-800 text-white text-sm font-medium rounded hover:bg-navy-900 transition-colors"
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Professional & Institutional */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-navy-50 text-navy-800 text-xs font-semibold rounded-full mb-6">
                SERVICE OFFICIEL
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Gestion des Demandes
                <span className="block text-navy-800">Parlementaires</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Plateforme officielle de soumission et de suivi des requêtes parlementaires. 
                Simplifiez vos démarches administratives en toute transparence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-800 text-white font-medium rounded hover:bg-navy-900 transition-colors"
                >
                  Déposer une demande
                  <i className="bi bi-arrow-right text-sm"></i>
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:border-navy-800 hover:text-navy-800 transition-colors"
                >
                  Suivre ma demande
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-100">
                <div>
                  <div className="text-2xl font-bold text-navy-800">500+</div>
                  <div className="text-xs text-gray-500 mt-1">Demandes traitées</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-navy-800">98%</div>
                  <div className="text-xs text-gray-500 mt-1">Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-navy-800">24/7</div>
                  <div className="text-xs text-gray-500 mt-1">Support dédié</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-navy-800 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2000&auto=format&fit=crop"
                  alt="Parliament"
                  className="w-full h-80 object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="bi bi-check-lg text-green-600 text-lg"></i>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Traitement rapide</div>
                    <div className="text-xs text-gray-500">Sous 48h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Request Types */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Types de demandes</h2>
            <p className="text-gray-600">
              Notre plateforme couvre l'ensemble des besoins administratifs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requestTypes.map((type, index) => (
              <div key={index} className="text-center p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className={`${type.icon} text-navy-800 text-xl`}></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-500">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - 3 Steps */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Processus simplifié</h2>
            <p className="text-gray-600">
              Trois étapes simples pour déposer votre demande
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Inscription', desc: 'Créez votre compte et complétez votre profil' },
              { step: '02', title: 'Soumission', desc: 'Choisissez le type de demande et remplissez le formulaire' },
              { step: '03', title: 'Suivi', desc: 'Consultez l\'état d\'avancement de votre dossier' }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-bold text-navy-100 mb-4">{step.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
                {index < 2 && (
                  <div className="hidden lg:block absolute top-8 -right-4 text-gray-300">
                    <i className="bi bi-arrow-right text-2xl"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">À propos du service</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Le service de gestion des demandes parlementaires est une plateforme officielle 
                destinée à faciliter les échanges entre les citoyens, les institutions et le parlement.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Notre mission est de moderniser et d'accélérer le traitement des requêtes 
                administratives dans un cadre transparent et sécurisé.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <i className="bi bi-shield-check text-navy-800"></i>
                  <span className="text-sm text-gray-600">Données sécurisées</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="bi bi-clock text-navy-800"></i>
                  <span className="text-sm text-gray-600">Traitement rapide</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="bi bi-headset text-navy-800"></i>
                  <span className="text-sm text-gray-600">Support dédié</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <i className="bi bi-envelope-paper text-navy-800 text-2xl"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Contact administratif</h4>
                  <p className="text-sm text-gray-500">contact@parlement.ma</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="bi bi-telephone text-navy-800 text-2xl"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Support technique</h4>
                  <p className="text-sm text-gray-500">+212 537 76 00 00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-800">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Prêt à déposer votre demande ?</h2>
          <p className="text-navy-200 mb-6">
            Rejoignez notre plateforme et bénéficiez d'un traitement rapide et transparent
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy-800 font-medium rounded hover:bg-gray-100 transition-colors"
          >
            Créer un compte
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-navy-700 rounded flex items-center justify-center">
                  <i className="bi bi-bank2 text-white text-sm"></i>
                </div>
                <span className="text-white font-semibold">PARLEMENT</span>
              </div>
              <p className="text-sm">
                Service officiel de gestion des demandes parlementaires
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">Processus</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">À propos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <i className="bi bi-envelope text-xs"></i>
                  <span>contact@parlement.ma</span>
                </li>
                <li className="flex items-center gap-2">
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

      <style jsx>{`
        .bg-navy-50 { background-color: #e8edf5; }
        .bg-navy-100 { background-color: #d0d9eb; }
        .bg-navy-700 { background-color: #1e3a5f; }
        .bg-navy-800 { background-color: #0f2b4d; }
        .bg-navy-900 { background-color: #0a1e36; }
        .text-navy-100 { color: #d0d9eb; }
        .text-navy-200 { color: #a0b4d0; }
        .text-navy-800 { color: #0f2b4d; }
        .text-navy-900 { color: #0a1e36; }
        .border-navy-800 { border-color: #0f2b4d; }
        .hover\\:bg-navy-900:hover { background-color: #0a1e36; }
        .hover\\:border-navy-800:hover { border-color: #0f2b4d; }
        .hover\\:text-navy-800:hover { color: #0f2b4d; }
      `}</style>
    </div>
  );
};

export default Landing;