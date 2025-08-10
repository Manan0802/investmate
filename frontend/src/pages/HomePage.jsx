// --- Imports ---
import { Link } from 'react-router-dom';
import { BarChart, BrainCircuit, ShieldCheck } from 'lucide-react';

/**
 * HomePage Component
 * A redesigned, visually engaging landing page for the application.
 */
function HomePage() {
  // Data for the feature cards.
  const features = [
    {
      icon: <BarChart className="h-8 w-8 text-cyan-300" />,
      title: 'Portfolio Tracking',
      description: 'Effortlessly monitor all your assets in one place with real-time data and beautiful visualizations.',
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-cyan-300" />,
      title: 'AI-Powered Insights',
      description: 'Receive personalized, data-driven advice and analysis to help you make smarter investment decisions.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-cyan-300" />,
      title: 'Secure & Reliable',
      description: 'Your data is encrypted and protected using industry-standard security measures you can trust.',
    },
  ];

  // Data for the testimonial cards.
  const testimonials = [
    {
      name: 'Priya S.',
      role: 'Active Trader',
      quote: "InvestMate has revolutionized how I track my portfolio. The AI insights are a game-changer and have genuinely improved my returns.",
      avatar: 'https://placehold.co/100x100/7dd3fc/0c4a6e?text=PS',
    },
    {
      name: 'Rahul K.',
      role: 'Long-term Investor',
      quote: "Finally, a clean and powerful app that doesn't overwhelm you with clutter. It's perfect for monitoring my long-term goals.",
      avatar: 'https://placehold.co/100x100/67e8f9/083344?text=RK',
    },
     {
      name: 'Anjali M.',
      role: 'New to Investing',
      quote: "As a beginner, I was intimidated by investing. InvestMate makes it so easy to understand my performance and learn as I go. Highly recommended!",
      avatar: 'https://placehold.co/100x100/a5f3fc/155e75?text=AM',
    },
  ];

  return (
    // --- Main Page Container ---
    // SPACING FIX: Negative margins (-mx-4 etc.) counteract parent padding, making the background full-width and removing white bars.
    <div className="flex-1 w-full bg-slate-900 text-white animate-fade-in -mx-4 sm:-mx-6 md:-mx-8">
      <div className="relative isolate overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
          <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0ea5e9] to-[#0891b2] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"></div>
        </div>

        {/* === HERO SECTION === */}
        {/* SPACING FIX: Reduced vertical padding (py-16) */}
        <div className="mx-auto max-w-4xl text-center py-16 px-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            Invest with Clarity & Confidence
          </h1>
          <p className="mt-6 text-lg max-w-2xl mx-auto text-slate-400">
            Your all-in-one platform for intelligent portfolio tracking and AI-powered financial insights. Take control of your wealth today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/register"
              className="rounded-md bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 transition-all duration-200 transform hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link to="/login" className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors">
              Login <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* === FEATURES SECTION === */}
        {/* SPACING FIX: Reduced vertical padding (py-12) and top margin (mt-12) */}
        <section className="py-12 bg-black/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-sky-400">Everything You Need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">A Smarter Way to Manage Your Investments</p>
            </div>
            <div className="mx-auto mt-12 max-w-2xl lg:mt-16 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.title} className="flex flex-col p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl transform transition-transform duration-300 hover:-translate-y-2">
                    <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                      <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/10">
                        {feature.icon}
                      </div>
                      {feature.title}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
        
        {/* === TESTIMONIALS SECTION === */}
        {/* SPACING FIX: Reduced vertical padding (py-12) */}
        <section className="py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-sky-400">Trusted by Investors</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">What Our Users Are Saying</p>
                </div>
                <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.name} className="flex flex-col p-8 bg-slate-800/50 border border-slate-700 rounded-2xl">
                            <div className="flex items-center gap-x-4">
                                <img className="h-12 w-12 rounded-full bg-slate-700" src={testimonial.avatar} alt="" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/1e293b/ffffff?text=User'; }}/>
                                <div>
                                    <div className="text-lg font-semibold text-white">{testimonial.name}</div>
                                    <div className="text-slate-400">{testimonial.role}</div>
                                </div>
                            </div>
                            <blockquote className="mt-6 text-slate-300">
                                <p>“{testimonial.quote}”</p>
                            </blockquote>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* === FINAL CTA SECTION === */}
        {/* SPACING FIX: Reduced vertical padding (py-12) */}
        <section className="py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to dive in?</h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">Start tracking your portfolio like a pro today.</p>
            <div className="mt-10">
              <Link to="/register" className="rounded-md bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 transition-all duration-200 transform hover:scale-105">
                Create your free account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;