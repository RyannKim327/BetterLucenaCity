interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-outline-variant/40 bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-widest text-secondary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
