import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ceoPhoto from '../../assets/ceo_wael_madi.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('residency');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Form, 2 = Success
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form State for Mock Checkout
  const [agencyName, setAgencyName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Dynamic CRM SaaS Plans State
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('saas_plans');
    if (saved) {
      try {
        setPlans(JSON.parse(saved));
        return;
      } catch (e) {
        console.error("Failed to parse saas_plans from localStorage", e);
      }
    }
    // Fallback default plans
    const defaultPlans = [
      {
        id: 'starter',
        name: 'Starter License',
        price: 99,
        billingPeriod: '/ month',
        description: 'For independent relocation agents.',
        features: [
          '3 Active Agents',
          '50 Active Cases / Leads',
          'Standard client intake portal',
          '❌ Cloud AWS back-ups',
          '❌ Verification dashboard'
        ],
        isRecommended: false
      },
      {
        id: 'growth',
        name: 'Growth License',
        price: 249,
        billingPeriod: '/ month',
        description: 'For growing immigration teams.',
        features: [
          '10 Active Agents',
          '200 Active Cases / Leads',
          'Intake Forms & Document verification',
          'AWS Secure Backups dashboard',
          'Team permissions manager'
        ],
        isRecommended: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise License',
        price: 499,
        billingPeriod: '/ month',
        description: 'For agency franchises.',
        features: [
          'Unlimited Agents',
          'Unlimited Cases',
          'Custom branding & subdomain',
          'Custom API Integrations',
          'Priority SLA Support'
        ],
        isRecommended: false
      }
    ];
    setPlans(defaultPlans);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenCheckout = (plan) => {
    setSelectedPlan(plan);
    setCheckoutStep(1);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!agencyName || !adminEmail || !cardNumber) {
      alert("Please fill in the required fields");
      return;
    }
    setCheckoutStep(2);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Helper function to scroll smoothly without breaking HashRouter
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-850 font-sans antialiased selection:bg-amber-400 selection:text-slate-900">

      {/* 1. Navbar - Royal Navy Blue Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-[#00205B] shadow-lg py-2 border-b border-[#D4AF37]/30'
            : 'bg-[#00205B]/95 py-3 border-b border-white/5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

          {/* Logo Brand Emblem */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-[#D4AF37]/45 transition-transform group-hover:scale-105">
              <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 75 L50 20 L75 75" stroke="#00205B" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M35 55 L65 55" stroke="#00205B" strokeWidth="10" strokeLinecap="round" />
                <path d="M15 50 C 35 25, 65 25, 85 50 C 65 75, 35 75, 15 50 Z" stroke="#D4AF37" strokeWidth="5.5" fill="none" opacity="0.9" />
                <circle cx="75" cy="40" r="7.5" fill="#D4AF37" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm lg:text-base tracking-wider text-white flex items-center leading-none">
                AAA <span className="text-amber-400 ml-1.5 text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded uppercase tracking-wider">CRM</span>
              </div>
              <div className="text-[7.5px] sm:text-[8px] text-amber-300 font-bold tracking-widest uppercase mt-0.5">
                ADVISE • ASSIST • ACHIEVE
              </div>
            </div>
          </div>

          {/* Desktop Navigation Buttons */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-[11px] font-bold text-slate-200">
            <button onClick={() => scrollToSection('about')} className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">About Us</button>
            <button onClick={() => scrollToSection('why-choose-us')} className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Why Choose Us</button>
            <button onClick={() => scrollToSection('services')} className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Core Services</button>
            <button onClick={() => scrollToSection('packages')} className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Visa Packages</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">CRM Plans</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Contact</button>
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={handleLoginClick}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-slate-950 font-bold rounded-md shadow-md transition-all duration-200 text-[10px] border border-amber-400/20 cursor-pointer"
            >
              Sign In to CRM
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-amber-400 focus:outline-none p-1"
            >
              <svg className="h-5.5 w-5.5 fill-none stroke-current" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#001D54] border-t border-white/5 py-3 px-4 space-y-2 shadow-xl">
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('about'); }}
              className="block w-full text-left text-slate-100 hover:text-amber-400 py-1 text-[11px] font-bold"
            >
              About Us
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('why-choose-us'); }}
              className="block w-full text-left text-slate-100 hover:text-amber-400 py-1 text-[11px] font-bold"
            >
              Why Choose Us
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('services'); }}
              className="block w-full text-left text-slate-100 hover:text-amber-400 py-1 text-[11px] font-bold"
            >
              Core Services
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('packages'); }}
              className="block w-full text-left text-slate-100 hover:text-amber-400 py-1 text-[11px] font-bold"
            >
              Visa Packages
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('pricing'); }}
              className="block w-full text-left text-slate-100 hover:text-amber-400 py-1 text-[11px] font-bold"
            >
              CRM SaaS Plans
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('contact'); }}
              className="block w-full text-left text-slate-100 hover:text-amber-400 py-1 text-[11px] font-bold"
            >
              Contact
            </button>
            <div className="pt-1.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLoginClick();
                }}
                className="w-full text-center py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[10px]"
              >
                Sign In to CRM Portal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section - Royal Navy with Spain split background imagery */}
      <section className="relative bg-[#00205B] text-white border-b border-[#D4AF37]/20">
        <div className="grid lg:grid-cols-2 min-h-[500px] items-stretch">

          {/* Left Column: Solid Navy content block */}
          <div className="flex items-center justify-center lg:justify-end py-12 px-4 sm:px-6 md:py-16 lg:px-12 bg-[#00205B] z-10">
            <div className="max-w-xl space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-amber-500/15 border border-amber-400/25 rounded text-[8.5px] font-extrabold text-amber-300 tracking-widest uppercase">
                <span>AAA BUSINESS CONSULTANCY</span>
              </div>

              <h1 className="text-2xl sm:text-3.5xl md:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.15] text-white uppercase">
                Spain Visa & <br className="hidden sm:inline" />
                <span className="text-[#D4AF37]">Relocation Experts</span>
              </h1>

              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="h-[1.5px] w-6 bg-amber-500"></div>
                <div className="w-2 h-2 rotate-45 border border-amber-400 bg-amber-500"></div>
                <div className="h-[1.5px] w-28 bg-amber-500"></div>
              </div>

              <p className="text-xxs sm:text-xs md:text-sm text-slate-200 font-normal leading-relaxed">
                Your Trusted Partner for a Better Future in Spain. Advise • Assist • Achieve. We process your visa, legal documentation, and post-arrival relocation tasks with complete transparency and dedicated legal managers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1.5">
                <button
                  onClick={() => scrollToSection('packages')}
                  className="w-full sm:w-auto px-5.5 py-2.5 bg-white text-[#00205B] font-bold text-center rounded shadow hover:bg-slate-100 transition-all hover:-translate-y-0.5 duration-200 text-xxs sm:text-xs cursor-pointer"
                >
                  Explore Relocation Packages
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="w-full sm:w-auto px-5.5 py-2.5 bg-amber-500 text-slate-950 font-extrabold text-center rounded shadow hover:bg-amber-600 transition-all hover:-translate-y-0.5 duration-200 text-xxs sm:text-xs border border-amber-400/20 cursor-pointer"
                >
                  View CRM Admin Plans
                </button>
              </div>

              {/* Connected details */}
              <div className="pt-3 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-[9.5px] sm:text-xs text-slate-300 border-t border-white/10">
                <span className="flex items-center"><span className="mr-1.5">📍</span>Dubai Headquarter Office</span>
                <span className="text-amber-500/40">•</span>
                <span className="flex items-center"><span className="mr-1.5">🌍</span>Serving Clients Worldwide</span>
              </div>
            </div>
          </div>

          {/* Right Column: Spain Cityscape Image (unblocked, clean, and perfectly aligned) */}
          <div className="relative min-h-[300px] lg:min-h-full w-full overflow-hidden border-t border-t-[#D4AF37]/20 lg:border-t-0 lg:border-l lg:border-l-[#D4AF37]/25 z-0 select-none">
            <img
              src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&auto=format&fit=crop&q=80"
              alt="Spain Madrid Cityscape"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Soft gradient accent for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00205B]/30 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 3. Core Pillars (Expert guidance row) */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 text-center">

            {[
              { emoji: '🌐', title: 'EXPERT GUIDANCE', text: 'Professional advice you can trust.' },
              { emoji: '👥', title: 'PERSONALIZED SOLUTIONS', text: 'Tailored visa and relocation plans.' },
              { emoji: '🛡️', title: 'TRANSPARENT PROCESS', text: 'Clear, simple & reliable support.' },
              { emoji: '🤝', title: 'END-TO-END SUPPORT', text: 'From documentation to settling.' },
              { emoji: '📈', title: 'BUILD YOUR FUTURE', text: 'Live, study & grow in beautiful Spain.' }
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white border border-[#D4AF37]/35 hover:border-[#D4AF37] rounded-lg flex flex-col items-center hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105">
                  <span className="text-lg">{pillar.emoji}</span>
                </div>
                <h5 className="font-bold text-[9px] sm:text-[10px] text-[#00205B] tracking-wider uppercase">{pillar.title}</h5>
                <p className="text-[8.5px] sm:text-[9.5px] text-slate-500 mt-1 font-light leading-normal">{pillar.text}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 4. About Us & Who We Are */}
      <section id="about" className="py-12 sm:py-16 bg-[#FAFBFD] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-10 space-y-1.5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#00205B] uppercase tracking-wide">About Us</h2>
            <div className="w-10 h-0.5 bg-[#D4AF37] mx-auto"></div>
            <p className="text-[10.5px] sm:text-xs text-slate-500 font-light">
              AAA Business Consultancy is Spain Visa & Relocation Experts.
            </p>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <p className="text-xxs sm:text-xs md:text-sm text-slate-750 leading-relaxed font-light">
                <strong className="font-semibold text-[#00205B]">AAA Business Consultancy</strong> is a professional consultancy firm specializing in Spain visa, residency, study, and relocation solutions. Based in Dubai and serving clients worldwide, we provide personalized guidance and professional support for individuals, families, remote workers, and investors planning their future in Spain.
              </p>
              <p className="text-xxs sm:text-xs md:text-sm text-slate-750 leading-relaxed font-light">
                With a modern approach powered by professional consultation, digital systems, and strategic partnerships, our mission is to make the Spain visa, residency, and relocation journey simple, transparent, and stress-free. At AAA, we don't just process applications — we help our clients build new opportunities, new lifestyles, and a better future in Spain.
              </p>
            </div>

            {/* Grid cards */}
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white border border-[#D4AF37]/25 rounded-xl shadow-xs hover:border-[#D4AF37]/60 hover:shadow-md transition-all duration-300">
                <div className="text-base">🎯</div>
                <h4 className="font-bold text-[#00205B] text-xxs sm:text-xs mt-1.5 mb-0.5 uppercase tracking-wider">Our Mission</h4>
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 leading-normal font-light">To make Spain immigration transparent, stress-free, and simple.</p>
              </div>
              <div className="p-4 bg-white border border-[#D4AF37]/25 rounded-xl shadow-xs hover:border-[#D4AF37]/60 hover:shadow-md transition-all duration-300">
                <div className="text-base">👁️</div>
                <h4 className="font-bold text-[#00205B] text-xxs sm:text-xs mt-1.5 mb-0.5 uppercase tracking-wider">Our Vision</h4>
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 leading-normal font-light">To be the most trusted Spain residency partner in the GCC.</p>
              </div>
              <div className="p-4 bg-white border border-[#D4AF37]/25 rounded-xl shadow-xs hover:border-[#D4AF37]/60 hover:shadow-md transition-all duration-300">
                <div className="text-base">💎</div>
                <h4 className="font-bold text-[#00205B] text-xxs sm:text-xs mt-1.5 mb-0.5 uppercase tracking-wider">Our Values</h4>
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 leading-normal font-light">Integrity, Honesty, Transparency, Excellence, and Client Focus.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4b. Our Founder & CEO - Dedicated Flyer Presentation */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Gold Tagline Banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center space-x-3 px-4 py-1.5 bg-[#00205B] border-b-2 border-b-[#D4AF37] text-white rounded shadow-xs">
              <span className="h-[1px] w-4 bg-[#D4AF37]/60"></span>
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                YOUR JOURNEY. OUR EXPERTISE. YOUR FUTURE IN SPAIN.
              </span>
              <span className="h-[1px] w-4 bg-[#D4AF37]/60"></span>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#00205B] tracking-wide uppercase">
              Our Founder & CEO
            </h2>
            {/* Diamond shape divider decoration from the flyer */}
            <div className="flex items-center justify-center space-x-3.5 mt-2">
              <div className="h-[1px] w-12 bg-slate-350"></div>
              <div className="w-2 h-2 rotate-45 bg-[#D4AF37]"></div>
              <div className="h-[1px] w-12 bg-slate-350"></div>
            </div>
          </div>

          <div className="space-y-6">

            {/* Top Row: Symmetrical 2-Column Grid (Info on Left, Photo on Right) */}
            <div className="grid md:grid-cols-12 gap-8 items-center">

              {/* Left Column: Introductory Information (Paragraphs 1, 2, 3) */}
              <div className="md:col-span-7 space-y-4 text-slate-700 text-xs sm:text-sm font-light leading-relaxed">
                <p className="text-[#00205B] font-bold text-xs sm:text-sm md:text-base leading-relaxed">
                  With more than 22 years of business experience in Dubai and international markets, AAA Business Consultancy was built on a strong foundation of trust, honesty, professionalism, and long-term relationships.
                </p>

                <p>
                  At AAA, we believe that our success comes from the success of our clients. That is why we are committed to providing reliable guidance, transparent support, and personalized solutions for every client we serve.
                </p>

                <p>
                  Our carefully selected professional team combines experience, dedication, and deep market understanding to support individuals, families, entrepreneurs, investors, and students in their journey to Spain and Europe.
                </p>
              </div>

              {/* Right Column: CEO Photo aligned to the right side */}
              <div className="md:col-span-5 flex justify-center md:justify-end">
                <div className="relative p-1 bg-white border-2 border-[#D4AF37] rounded-xl shadow-lg w-full max-w-[280px] sm:max-w-[320px] transition-transform duration-300 hover:scale-[1.01]">
                  <img
                    src={ceoPhoto}
                    alt="Wael Madi CEO sitting at desk"
                    className="w-full h-auto rounded-lg object-cover aspect-square"
                  />
                </div>
              </div>

            </div>

            {/* Bottom Row: Full-width wrapping information */}
            <div className="space-y-4 pt-6 border-t border-slate-100">

              {/* Gold core value box */}
              <div className="my-5 p-3.5 bg-[#00205B]/5 border border-[#D4AF37]/35 rounded-xl text-center max-w-xl">
                <span className="block font-bold text-[#00205B] uppercase text-[9px] tracking-wider mb-0.5">
                  The meaning behind AAA reflects our core values:
                </span>
                <span className="block font-extrabold text-amber-600 text-xs sm:text-sm tracking-widest uppercase">
                  Advise • Assist • Achieve
                </span>
              </div>

              <div className="text-slate-700 text-xs sm:text-sm font-light leading-relaxed space-y-4">
                <p>
                  We advise with knowledge, assist with dedication, and help our clients achieve their goals with confidence.
                </p>

                <p>
                  Our mission is not only to provide services, but to build lasting relationships based on trust, care, and real results.
                </p>
              </div>

              {/* Signature Block */}
              <div className="flex flex-col items-end pt-4">
                <span className="font-serif italic text-lg sm:text-xl text-[#00205B] font-extrabold tracking-wider leading-none">
                  Wael Madi
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Wael Madi
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section - Purely detailed from Screenshot 3 */}
      <section id="why-choose-us" className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-10 space-y-1.5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#00205B] uppercase tracking-wide">Why Choose Us</h2>
            <div className="w-10 h-0.5 bg-[#D4AF37] mx-auto"></div>
            <p className="text-[10.5px] sm:text-xs text-slate-500 font-light">
              We provide professional support for individuals, families, and teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Left side list */}
            <div className="space-y-3.5 flex flex-col justify-center">
              {[
                { title: "Professional guidance throughout every stage of the process", desc: "Our counselors are with you at every check-point." },
                { title: "Transparent communication and clear workflow", desc: "No hidden charges or unexpected steps." },
                { title: "Fast response and reliable customer support", desc: "We answer questions quickly and efficiently." },
                { title: "Al-powered systems & automation for efficient service management", desc: "Track your client documents and case process logs directly." },
                { title: "Specialized focus on Spain visa, residency & relocation pathways", desc: "Deeply specialized and local legal experts in Madrid/Barcelona." }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#D4AF37]/50 hover:shadow-xs transition-all duration-200">
                  <h4 className="font-bold text-slate-900 text-xxs sm:text-xs uppercase tracking-wide">{item.title}</h4>
                  <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 mt-1 leading-normal font-light">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Right side list */}
            <div className="space-y-3.5 flex flex-col justify-center">
              {[
                { title: "Professional document preparation & coordination support", desc: "Double check checklists before submission to avoid rejections." },
                { title: "Dedicated assistance for residency, study, and business pathways", desc: "Tailored to your specific profile (freelancer, study or retired)." },
                { title: "Long-term client relationship approach, not only application processing", desc: "We stay with you post-arrival to register Town Hall and SIM cards." },
                { title: "Dubai-based international consultancy serving UAE, GCC, Egypt & global clients", desc: "Local physical headquarters in Dubai Business Village." }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#D4AF37]/50 hover:shadow-xs transition-all duration-200">
                  <h4 className="font-bold text-slate-900 text-xxs sm:text-xs uppercase tracking-wide">{item.title}</h4>
                  <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 mt-1 leading-normal font-light">{item.desc}</p>
                </div>
              ))}

              <div className="p-4 bg-[#00205B] text-white rounded-xl space-y-1.5 border-t-4 border-t-[#D4AF37]">
                <h4 className="font-bold text-xxs sm:text-xs uppercase tracking-wider text-amber-400">Our Commitment:</h4>
                <p className="text-[9px] sm:text-[10px] text-slate-200 leading-normal font-light">
                  "At AAA Business Consultancy, we believe that every client deserves professional support, honest guidance, and a smooth relocation experience. Our goal is to simplify the Spain visa journey through structured processes, personalized assistance, and reliable professional support from consultation to settlement."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Core Services Grid - Flyer 4 */}
      <section id="services" className="py-12 sm:py-16 bg-[#FAFBFD] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-10 space-y-1.5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#00205B] uppercase tracking-wide">Spain Visa & Residency Services</h2>
            <div className="w-10 h-0.5 bg-[#D4AF37] mx-auto"></div>
            <p className="text-[10.5px] sm:text-xs text-slate-500 font-light">
              Our core Spanish visa and residency offerings.
            </p>
          </div>

          {/* 7 Core Services */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4.5 sm:gap-6 mb-10">
            {[
              { id: "01", title: "DIGITAL NOMAD VISA (DNV)", desc: "Remote work residency solutions for professionals and entrepreneurs." },
              { id: "02", title: "NON-LUCRATIVE VISA (NLV)", desc: "Residency options for retirees and financially independent individuals." },
              { id: "03", title: "SELF-EMPLOYED / BUSINESS RESIDENCY", desc: "Support for entrepreneurs and business owners relocating to Spain." },
              { id: "04", title: "STUDY VISA", desc: "University admissions, language schools, master's programs, and PCE preparation support." },
              { id: "05", title: "PARTNER & FAMILY REUNIFICATION", desc: "Residency support for spouses, partners, children, and relatives." },
              { id: "06", title: "TOURISM VISA & SCHENGEN GUIDANCE", desc: "Professional assistance for tourist applications and BLS/VFS files." },
              { id: "07", title: "PROPERTY INVESTMENT GUIDANCE", desc: "Support for property investors planning Spanish residency paths." }
            ].map((srv, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200/80 rounded-xl hover:border-[#D4AF37]/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <span className="text-[8px] sm:text-[9px] font-black text-amber-500 block mb-1">SERVICE {srv.id}</span>
                <h4 className="font-bold text-[#00205B] text-xxs sm:text-xs mb-0.5 uppercase tracking-wide">{srv.title}</h4>
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 leading-normal font-light">{srv.desc}</p>
              </div>
            ))}
          </div>

          {/* 10 Additional Support Services from Screenshot 4 */}
          <div className="border-t border-slate-200 pt-8">
            <div className="text-center max-w-3xl mx-auto mb-8 space-y-1.5">
              <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-[#00205B] uppercase tracking-wide">Additional Support Services</h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-light">We take care of every administrative requirement.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                { title: "NIE / NIF Assistance", icon: "🆔" },
                { title: "Digital Certificate", icon: "🔒" },
                { title: "Tax Registration Guidance", icon: "📊" },
                { title: "Empadronamiento Setup", icon: "🏠" },
                { title: "Accommodation Support", icon: "🏨" },
                { title: "Translation & Sworn Certs", icon: "📝" },
                { title: "Administrative Procedures", icon: "📂" },
                { title: "Appointment Booking Support", icon: "📅" },
                { title: "Relocation Guidance Desk", icon: "🗺️" },
                { title: "Local Integration Support", icon: "👥" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-100 rounded-lg text-center hover:border-[#D4AF37]/30 transition-all duration-200">
                  <span className="text-base sm:text-lg block mb-1.5">{item.icon}</span>
                  <h5 className="font-bold text-[#00205B] text-[9.5px] sm:text-[10.5px] uppercase tracking-wider">{item.title}</h5>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 7. Relocation Packages (Presents all details from screenshots) */}
      <section id="packages" className="py-12 sm:py-16 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-8 space-y-1.5">
            <span className="text-amber-500 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">Deliverables list</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#00205B] uppercase tracking-wide">Relocation Packages Specification</h2>
            <div className="w-10 h-0.5 bg-[#D4AF37] mx-auto"></div>
          </div>

          {/* Navigation tabs */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {[
              { id: 'residency', label: 'Residency Full Package' },
              { id: 'tourist', label: 'Schengen Tourist Visa' },
              { id: 'relocation', label: 'Relocation Assistant' },
              { id: 'premium', label: 'Premium Full Package' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg font-bold text-xxs sm:text-xs transition-all duration-200 shadow-xs cursor-pointer ${activeTab === tab.id
                    ? 'bg-[#00205B] text-white border-b-2 border-amber-500'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-[#D4AF37]/35'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Detailed Tab Body Content */}
          <div className="bg-white border border-[#D4AF37]/35 rounded-xl p-4.5 sm:p-6 md:p-8 shadow-md max-w-5xl mx-auto hover:shadow-lg transition-shadow duration-300">

            {activeTab === 'residency' && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="px-2 py-0.5 bg-[#00205B]/10 text-[#00205B] text-[8px] sm:text-[9px] font-bold rounded uppercase">Residency Applications</span>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#00205B] mt-0.5">Spain Residency Full Processing Package</h3>
                    <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 mt-0.5">Complete, Professional & End-to-End Support for Spain Residency Applications</p>
                  </div>
                  <span className="px-3 py-1 bg-[#D4AF37]/10 text-slate-900 border border-[#D4AF37]/30 text-xxs font-bold rounded">100% Comprehensive</span>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 space-y-3">
                    <h4 className="font-bold text-xxs sm:text-xs text-slate-900 uppercase tracking-wider">What's Included:</h4>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[9px] sm:text-[10.5px] text-slate-600">
                      {[
                        "Eligibility Verification & Initial Assessment",
                        "Professional Case Evaluation",
                        "Financial Profile Assessment",
                        "Risk & Weakness Analysis",
                        "Personalized Spain Residency Strategy",
                        "Customized Pathway Recommendation",
                        "Timeline & Roadmap Preparation",
                        "Full Application Preparation Support",
                        "Document Review & Verification",
                        "File Preparation & Organization",
                        "Application Quality Assessment",
                        "Identification of Missing or Weak Documents",
                        "Professional Recommendations to Strengthen the Application",
                        "Sworn Translation Support",
                        "Spain Residency Submission Coordination",
                        "Legal & Administrative Coordination Support",
                        "Collaboration with Specialized Partners in Spain",
                        "Guidance on Procedures & Compliance",
                        "One-to-One Consultation Throughout the Process",
                        "Communication Support on Required Documents",
                        "Follow-Up Coordination During the Process",
                        "Insurance Guidance Assistance",
                        "Resubmission Coordination (If applicable)",
                        "Appeal Coordination (If applicable)",
                        "Support Until Final Decision"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5 py-0.5">
                          <span className="text-[#D4AF37] font-bold">✔</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-4">
                    <div className="p-3.5 bg-slate-50 border border-slate-200/85 rounded-lg space-y-2.5">
                      <h4 className="font-bold text-xxs sm:text-xs text-[#00205B] uppercase tracking-wider">Residency Categories We Handle:</h4>
                      <ul className="space-y-1.5 text-[9px] sm:text-[10px] text-slate-600">
                        <li>👤 <b>Non-Lucrative Residence:</b> For individuals with sufficient financial means who wish to reside in Spain without engaging in employment.</li>
                        <li>💼 <b>Self-Employed / Business (Entrepreneur) Residence:</b> For entrepreneurs, freelancers, and self-employed professionals planning to run their own business.</li>
                        <li>💻 <b>Digital Nomad Residence:</b> For remote workers and professionals who work for companies outside Spain.</li>
                        <li>🎓 <b>Study Residence:</b> For students who wish to pursue academic studies in Spain.</li>
                        <li>👥 <b>Family Reunification / Partner Residence:</b> For spouses, partners, children, or relatives of legal residents or EU citizens.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] sm:text-[10px] text-amber-950 font-normal leading-snug">
                      ⚠️ <b>IMPORTANT NOTE:</b> Visa or residency approval, refusal decisions, processing timelines, and final decisions remain solely under the authority of the Spanish Government Authorities and Immigration Offices.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tourist' && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="px-2 py-0.5 bg-[#00205B]/10 text-[#00205B] text-[8px] sm:text-[9px] font-bold rounded uppercase">Schengen short stay</span>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#00205B] mt-0.5">Spain Schengen Tourist Visa Package</h3>
                    <p className="text-[9px] sm:text-[10.5px] text-slate-500 mt-0.5">Professional Visa Assistance & Application Support</p>
                  </div>
                  <span className="px-3 py-1 bg-[#D4AF37]/10 text-slate-900 border border-[#D4AF37]/30 text-xxs font-bold rounded">BLS / VFS Guidance</span>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 space-y-3">
                    <h4 className="font-bold text-xxs sm:text-xs text-slate-900 uppercase tracking-wider">What's Included in Visa Support:</h4>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[9px] sm:text-[10.5px] text-slate-600">
                      {[
                        "Initial Consultation & Eligibility Assessment (Evaluate profile, recommend approach)",
                        "Personalized Document Checklist (Customized list of required documents)",
                        "Document Review & Verification (Ensure accuracy and completeness)",
                        "Identification of Missing Documents (Identify missing or weak documents before submission)",
                        "Travel Itinerary Plan (Flight reservation & route plan guidance)",
                        "Travel Insurance Coordination Assistance (Cost not included)",
                        "Financial Documents Guidance (Support with financial proofs)",
                        "Accommodation Guidance (Hotel booking or invitation support)",
                        "Supporting Documents Guidance (Passport, cover letter, bank statement guidance)",
                        "Application Preparation Support (Assist in form completion)",
                        "Appointment Booking Assistance (Subject to availability)",
                        "Submission Guidance & Coordination (Step-by-step guidance)",
                        "Communication Support During Processing (Updates with visa center)",
                        "Resubmission Assistance (If applicable)",
                        "Support Until Final Decision"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5 py-0.5">
                          <span className="text-[#D4AF37] font-bold">✔</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-4">
                    <div className="p-3.5 bg-slate-50 border border-slate-200/85 rounded-lg space-y-2.5">
                      <h4 className="font-bold text-xxs sm:text-xs text-[#00205B] uppercase tracking-wider">Why Choose AAA:</h4>
                      <ul className="space-y-1.5 text-[9px] sm:text-[10px] text-slate-600">
                        <li>👤 <b>Professional Visa Guidance:</b> Professional advice you can trust.</li>
                        <li>👥 <b>One-to-One Consultation:</b> Tailored solutions for your Spain visa needs.</li>
                        <li>🛡️ <b>Transparent Process:</b> Clear, simple & reliable support.</li>
                        <li>📞 <b>Dedicated Support:</b> Constant updates and follow-ups.</li>
                        <li>🔒 <b>Confidential & Secure:</b> High encryption & safety of files.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] sm:text-[10px] text-amber-950 font-normal leading-snug">
                      ℹ️ <b>IMPORTANT NOTE:</b> Visa approvals, appointment availability, processing timelines, and final decisions remain solely under the authority of the relevant embassy, consulate, or government authorities.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'relocation' && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="px-2 py-0.5 bg-[#00205B]/10 text-[#00205B] text-[9px] font-bold rounded uppercase">Post Arrival Setup</span>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#00205B] mt-0.5">Spain Relocation Assistant Administrative Package</h3>
                    <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 mt-0.5">Professional Assistance & Guidance for Essential Administrative Procedures in Spain</p>
                  </div>
                  <span className="px-3 py-1 bg-[#D4AF37]/10 text-slate-900 border border-[#D4AF37]/30 text-xxs font-bold rounded">10 Steps Settled</span>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-8 space-y-3.5">
                    <h4 className="font-bold text-xxs sm:text-xs text-slate-900 uppercase tracking-wider">10 Core Administrative Relocation Steps Included:</h4>

                    <div className="grid sm:grid-cols-2 gap-3 text-[9px] sm:text-[10px] text-slate-600">
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">1. NIE Assistance & Guidance</span>
                        <p className="text-[9px] text-slate-500">Support with NIE-related requirements and local Spanish registry procedures.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">2. TIE & Fingerprint Appointment</span>
                        <p className="text-[9px] text-slate-500">Assistance throughout TIE fingerprints (Huellas) card collection.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">3. Empadronamiento Assistance</span>
                        <p className="text-[9px] text-slate-500">Support with local town hall registration (Padrón) requirements.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">4. Digital Certificate Assistance</span>
                        <p className="text-[9px] text-slate-500">Assistance with obtaining and activating a Digital Certificate.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">5. Cl@ve Registration Assistance</span>
                        <p className="text-[9px] text-slate-500">Support with Cl@ve registration and activation procedures.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">6. NIF & Tax Registration</span>
                        <p className="text-[9px] text-slate-500">Guidance regarding tax registration requirements in Spain.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">7. Social Security Registration</span>
                        <p className="text-[9px] text-slate-500">Support with Social Security registration and local affiliation bookings.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">8. SIP Health Card Assistance</span>
                        <p className="text-[9px] text-slate-500">Guidance regarding public healthcare registration SIP card.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">9. Spanish Bank Account Setup</span>
                        <p className="text-[9px] text-slate-500">Support with the requirements and procedures for opening a local bank.</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                        <span className="font-extrabold text-[#00205B]">10. SIM Card Assistance</span>
                        <p className="text-[9px] text-slate-500">Support with obtaining and activating a local Spanish SIM card.</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-4">
                    <div className="p-3.5 bg-[#00205B] text-white rounded-lg text-center space-y-1.5">
                      <span className="text-amber-400 font-bold text-[9px] sm:text-[10px] tracking-wider block uppercase">Post-Arrival Setup</span>
                      <h4 className="text-xs font-bold">10/10 Admin Tasks Done</h4>
                      <p className="text-[9.5px] text-slate-250">Our relocation assistant ensures you avoid language barriers and local booking delays.</p>
                    </div>

                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] text-amber-950 leading-relaxed">
                      💡 <b>NOTICE:</b> To avoid local delays, clients are required to provide all requested documents, information, and supporting documentation in a complete and timely manner.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'premium' && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="px-2 py-0.5 bg-[#00205B]/10 text-[#00205B] text-[9px] font-bold rounded uppercase">VIP All-Inclusive</span>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#00205B] mt-0.5">Spain Relocation Premium Full Package</h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Complete Residency Processing + Relocation Administrative Assistance combined</p>
                  </div>
                  <span className="px-3 py-1 bg-[#D4AF37]/10 text-slate-900 border border-[#D4AF37]/30 text-xxs font-bold rounded">Full Handholding</span>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-8 space-y-3.5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/60 space-y-2">
                        <h4 className="font-bold text-[#00205B] text-xxs sm:text-xs">Phase 1: Full Residency Processing</h4>
                        <ul className="space-y-1 text-[9.5px] sm:text-[10px] text-slate-600">
                          <li>✔ Initial Consultation & Eligibility</li>
                          <li>✔ Sworn Translations support</li>
                          <li>✔ File Preparation & Submission</li>
                          <li>✔ Communication & Resubmission Check</li>
                          <li>✔ Appeals Coordination support</li>
                        </ul>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/60 space-y-2">
                        <h4 className="font-bold text-[#00205B] text-xxs sm:text-xs">Phase 2: Administrative Relocation</h4>
                        <ul className="space-y-1 text-[9.5px] sm:text-[10px] text-slate-600">
                          <li>✔ NIE & physical TIE card support</li>
                          <li>✔ Empadronamiento Town Hall Padrón</li>
                          <li>✔ Spanish Bank Account Setup</li>
                          <li>✔ Local Public Health SIP Card</li>
                          <li>✔ Digital Certificate & SIM card setup</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-4 bg-gradient-to-br from-[#00205B] to-slate-950 text-white rounded-xl p-4.5 sm:p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-amber-400 text-xxs sm:text-xs tracking-wider uppercase">Premium Benefits</h4>
                      <ul className="space-y-1.5 text-[9.5px] sm:text-[10px] text-slate-300 mt-2.5">
                        <li className="flex items-center space-x-1.5">
                          <span>⭐</span>
                          <span>Dedicated Senior Case Manager</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span>⭐</span>
                          <span>Priority document translations</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span>⭐</span>
                          <span>Legal Immigrant Coordination</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span>⭐</span>
                          <span>Timeline & Roadmap prep</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => scrollToSection('contact')}
                      className="w-full text-center py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xxs sm:text-xs rounded transition-colors shadow-sm cursor-pointer"
                    >
                      Book VIP Consultation
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 8. SaaS CRM Pricing Section - Light Theme with Gold borders */}
      <section id="pricing" className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-10 space-y-1.5">
            <span className="px-2 py-0.5 bg-[#00205B]/10 border border-[#00205B]/20 text-[#00205B] text-[8.5px] font-bold rounded">
              CRM SaaS LICENSE PLANS
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#00205B] uppercase tracking-wide">Partner CRM Licenses</h2>
            <div className="w-10 h-0.5 bg-[#D4AF37] mx-auto"></div>
            <p className="text-xs sm:text-sm text-slate-500 font-light">
              Are you an independent relocation agent or agency? Buy our CRM system license to manage client cases, verify document uploads, and track transactions in one secure portal.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 relative ${
                  plan.isRecommended
                    ? 'border-2 border-[#D4AF37] shadow-sm hover:shadow-lg'
                    : 'border border-[#D4AF37]/35 shadow-xs hover:shadow-md'
                }`}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-slate-950 text-[8.5px] font-extrabold px-2.5 py-0.5 uppercase rounded-bl-lg tracking-wider">
                    RECOMMENDED
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#00205B]">{plan.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-light">
                      {plan.description || (plan.id === 'starter' ? 'For independent relocation agents.' : plan.id === 'growth' ? 'For growing immigration teams.' : 'For agency franchises.')}
                    </p>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-lg sm:text-xl font-bold text-[#00205B]">€{plan.price}</span>
                    <span className="text-[9px] text-slate-500 font-medium ml-1">{plan.billingPeriod || '/ month'}</span>
                  </div>

                  <hr className="border-slate-100" />

                  <ul className="space-y-2 text-[10px] sm:text-xs text-slate-600">
                    {(plan.features || []).map((feature, idx) => {
                      const isNegative = feature.startsWith('❌');
                      return (
                        <li key={idx} className={`flex items-center space-x-1.5 ${isNegative ? 'text-slate-350 line-through' : ''}`}>
                          {!isNegative && <span className="text-[#00205B] font-bold">✔</span>}
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="pt-4.5">
                  <button
                    onClick={() => handleOpenCheckout({ name: plan.name, price: `€${plan.price}`, code: plan.id })}
                    className={`w-full py-2 px-3 font-extrabold text-xxs sm:text-xs rounded-md transition-all duration-200 shadow-xs cursor-pointer border ${
                      plan.isRecommended
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 border-amber-400/25'
                        : 'bg-slate-50 hover:bg-[#00205B] hover:text-white text-[#00205B] border-slate-200'
                    }`}
                  >
                    {plan.id === 'enterprise' ? 'Request Enterprise' : plan.id === 'growth' ? 'Buy Growth Plan' : plan.id === 'starter' ? 'Get Starter Plan' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact Desk - Royal Navy Background */}
      <section id="contact" className="py-12 sm:py-16 bg-[#00205B] text-white relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid md:grid-cols-12 gap-8 items-start">

            {/* Left Block info */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-amber-400">Communication Desk</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">CONTACT US</h2>
                <div className="w-10 h-[1.5px] bg-amber-500"></div>
                <p className="text-slate-200 font-light text-xxs sm:text-xs max-w-md leading-relaxed">
                  We are committed to providing professional guidance, transparent communication, and personalized support throughout every stage of your Spain visa and residency application.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-lg space-y-0.5 hover:bg-white/10 transition-colors">
                  <span className="text-amber-400 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider">Calling & WhatsApp</span>
                  <div className="flex items-center space-x-1.5 text-slate-100 font-bold text-xs sm:text-sm">
                    <span className="text-[10px]">🟢</span>
                    <a href="tel:+971509554142" className="hover:underline">+971 50 955 4142</a>
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/10 rounded-lg space-y-0.5 hover:bg-white/10 transition-colors">
                  <span className="text-amber-400 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider">Email Address</span>
                  <div className="flex items-center space-x-1.5 text-slate-100 font-semibold text-xxs sm:text-xs">
                    <span>📧</span>
                    <a href="mailto:info@aaaconsultancy.com" className="hover:underline">info@aaaconsultancy.com</a>
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/10 rounded-lg space-y-0.5 sm:col-span-2 hover:bg-white/10 transition-colors">
                  <span className="text-amber-400 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider">Office Address (Dubai Headquarter)</span>
                  <p className="text-[10px] sm:text-xs text-slate-200 leading-normal font-light">
                    🏢 Business Village, Block B, 4th Floor, Office F09 Port Saeed, Deira, Dubai, UAE
                  </p>
                </div>
              </div>
            </div>

            {/* Right Block social */}
            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-xl p-5 space-y-3.5">
              <h4 className="text-amber-400 font-bold text-xxs sm:text-xs uppercase tracking-wider">Social Channels</h4>

              <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
                <a href="#" className="flex items-center space-x-1.5 p-1.5 rounded hover:bg-white/5 text-slate-200 transition-colors">
                  <span>🔵</span>
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center space-x-1.5 p-1.5 rounded hover:bg-white/5 text-slate-200 transition-colors">
                  <span>📸</span>
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex items-center space-x-1.5 p-1.5 rounded hover:bg-white/5 text-slate-200 transition-colors">
                  <span>🐦</span>
                  <span>Twitter / X</span>
                </a>
                <a href="#" className="flex items-center space-x-1.5 p-1.5 rounded hover:bg-white/5 text-slate-200 transition-colors">
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
              </div>

              <div className="pt-2.5 border-t border-white/10 text-center space-y-1">
                <p className="text-[9px] text-slate-300">Scan to submit details directly</p>
                <div className="w-16 h-16 bg-white mx-auto rounded p-1 flex items-center justify-center">
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_4px)] opacity-80"></div>
                </div>
                <span className="text-[8px] uppercase tracking-widest text-amber-400 font-bold block">SCAN QR</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-[#001745] text-slate-400 text-[9px] sm:text-[10px] py-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start space-y-0.5">
            <p className="text-white font-bold text-xxs sm:text-xs">AAA BUSINESS CONSULTANCY FZC LLC</p>
            <p className="text-[8.5px] sm:text-[9px] text-slate-400">© {new Date().getFullYear()} AAA Business Consultancy. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-[8.5px] sm:text-[9.5px]">
            <span>Trade License: <b>4429675.01</b></span>
            <span>TRN: <b>105469065400001</b></span>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
            <a href="#" className="hover:text-white transition-colors">Payment Policy</a>
          </div>
        </div>
      </footer>

      {/* 10. Mock Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-5 relative overflow-hidden transition-all duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#00205B]">Complete CRM License Order</h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {checkoutStep === 1 ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                {/* Plan details info card */}
                <div className="bg-[#00205B]/5 border border-[#00205B]/10 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-[#00205B]">{selectedPlan?.name}</h4>
                    <span className="text-[9px] text-slate-500">Full CRM admin capabilities</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900">{selectedPlan?.price}</span>
                    <span className="block text-[7px] text-slate-400 uppercase">Monthly</span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                      Agency Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Valencia Relocation Group"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00205B]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@agency.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00205B]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                      Card Details (Mock billing) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00205B]/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00205B]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00205B]/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-start space-x-1.5">
                  <span className="text-emerald-600 text-xs">🛡️</span>
                  <p className="text-[9px] text-emerald-950 font-medium">
                    This is a secure billing checkout simulation. No real funds will be processed.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  Create Agency CRM Tenant
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900">Payment Successful!</h4>
                  <p className="text-[11px] text-slate-500 leading-normal font-light">
                    Your agency subscription to <b>{selectedPlan?.name}</b> is active for <b>{agencyName}</b>.
                  </p>
                  <p className="text-[11px] text-slate-500 leading-normal font-light">
                    Use your login credentials <b>{adminEmail}</b> to access the internal workspace dashboard.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false);
                      navigate('/login');
                    }}
                    className="w-full py-2.5 bg-[#00205B] text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                  >
                    Go to Portal Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
