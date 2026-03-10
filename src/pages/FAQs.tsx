import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is the SPE?',
    answer:
      'The Society of Professional Economists (SPE) is the leading organisation serving professional economists in the UK and Europe. Founded in 1953, the Society provides a forum for economists to debate questions of economics, extend their professional competency and interact with key economic policymakers.',
  },
  {
    question: 'Who can join?',
    answer:
      'Membership is open to anyone with a professional interest in economics. This includes economists working in business, finance, government, academia and consultancy. The Society welcomes applications from economists at all stages of their career.',
  },
  {
    question: 'What are the benefits of membership?',
    answer:
      'Members enjoy access to a wide range of activities including monthly speaker meetings, the annual conference and dinner, professional development courses, the salary survey, networking opportunities with fellow economists, and access to the Society\'s publications including the Reading Room.',
  },
  {
    question: 'How much does membership cost?',
    answer:
      'Membership rates vary depending on the category of membership. Full membership is £110 per year, student membership is £40, and graduate membership is £40. For current rates and to join, visit the membership page or contact the SPE office.',
  },
  {
    question: 'How do I attend events?',
    answer:
      'Details of upcoming events are published on the Events page. Most events are open to members, and some are open to non-members as well. Registration details are included in the event listings.',
  },
  {
    question: 'What is the Rybczynski Prize?',
    answer:
      'The Rybczynski Prize is an annual award for the best piece of writing on economics, inaugurated in 2000 in memory of Tadeusz Rybczynski. The prize of £5,000 is sponsored by KPMG.',
  },
  {
    question: 'How can I contact the SPE?',
    answer:
      'You can reach the SPE office by emailing admin@spe.org.uk or by visiting the Contact page.',
  },
]

function AccordionItem({ item, isOpen, onToggle, index }: { item: FAQItem; isOpen: boolean; onToggle: () => void; index: number }) {
  return (
    <div className="border border-spe-divider/30 rounded-xl bg-white overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-6 text-left group"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-btn-${index}`}
      >
        <span className="font-serif font-bold text-lg text-spe-ink group-hover:text-spe-blue transition-colors">
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-spe-blue text-white rotate-180' : 'bg-spe-cream text-spe-muted'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        id={`faq-panel-${index}`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-spe-muted leading-relaxed">
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQs() {
  useSEO({
    title: 'FAQs',
    description: 'Frequently asked questions about SPE membership, events, and the economics profession.',
    type: 'website',
  })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-blue to-spe-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Help & Support</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Find answers to the most commonly asked questions about the Society of Professional Economists.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              index={i}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-spe-cream mb-6">
            <svg className="w-8 h-8 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="editorial-heading text-2xl text-spe-ink mb-3">Still have questions?</h2>
          <p className="text-spe-muted mb-8 max-w-md mx-auto">
            Can't find what you're looking for? Get in touch with the SPE team and we'll be happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-spe-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-spe-deep transition-colors"
            >
              Contact Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="mailto:admin@spe.org.uk"
              className="inline-flex items-center gap-2 text-spe-blue font-medium hover:text-spe-deep transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              admin@spe.org.uk
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
