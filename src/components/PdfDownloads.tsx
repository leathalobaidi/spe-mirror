interface PdfLink {
  href: string
  text: string
}

interface Props {
  pdfs?: PdfLink[]
  heading?: string
}

export default function PdfDownloads({ pdfs, heading = 'Downloads' }: Props) {
  if (!pdfs || pdfs.length === 0) return null

  return (
    <section className="mt-10 border-t border-spe-border/20 pt-8">
      <h2 className="editorial-heading text-xl text-spe-dark mb-4">{heading}</h2>
      <ul className="space-y-3">
        {pdfs.map((pdf, i) => (
          <li key={i}>
            <a
              href={pdf.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-spe-blue hover:text-spe-deep transition-colors group"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 text-spe-error-light/70"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                <path d="M12 18l4-4h-3v-4h-2v4H8l4 4z" />
              </svg>
              <span className="group-hover:underline">{pdf.text}</span>
              <span className="text-xs text-spe-grey uppercase">PDF</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
