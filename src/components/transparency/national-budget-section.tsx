import { getNationalBudget, type NationalBudgetData } from "@/lib/sources/budget";

function formatPeso(n: number) {
  if (n >= 1_000_000_000_000) return `₱${(n / 1_000_000_000_000).toFixed(2)}T`;
  if (n >= 1_000_000_000) return `₱${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `₱${(n / 1_000_000).toFixed(1)}M`;
  return `₱${n.toLocaleString("en-PH")}`;
}

function Unavailable() {
  return (
    <section id="national-budget" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight">National Budget</h2>
      <p className="mt-1 text-on-surface-variant">
        Budget data is temporarily unavailable. Please try again later.
      </p>
    </section>
  );
}

export async function NationalBudgetSection() {
  let data: NationalBudgetData;
  try {
    data = await getNationalBudget();
  } catch {
    return <Unavailable />;
  }

  const maxTotal = Math.max(...data.nationalTotals.map((t) => t.amount));
  const years = [...data.nationalTotals].sort((a, b) => a.year - b.year);
  const lucenaShare =
    maxTotal > 0 ? (data.lucenaMatch.totalAmount / maxTotal) * 100 : 0;

  return (
    <section
      id="national-budget"
      aria-labelledby="national-budget-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6"
    >
      <h2 id="national-budget-heading" className="text-2xl font-semibold tracking-tight">
        National Budget
      </h2>
      <p className="mt-1 text-on-surface-variant">
        Enacted General Appropriations Act, FY{years[0]?.year}–FY{data.latestYear}, and the
        national programs that fund Lucena City — live from the BetterGov.ph PH Budget Data API.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-5 shadow-elevation-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            National appropriations by fiscal year
          </h3>
          <ul className="mt-4 space-y-2">
            {years.reverse().map((total) => (
              <li key={total.year} className="text-sm">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">{total.year}</span>
                  <span className="tabular-nums text-on-surface-variant">
                    {formatPeso(total.amount)}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mt-1 block h-1.5 rounded-full bg-primary/80"
                  style={{ width: `${Math.max((total.amount / maxTotal) * 100, 2)}%` }}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-5 shadow-elevation-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Programs for Lucena City · FY{data.latestYear}
          </h3>
          <p className="mt-4 text-sm">
            <span className="text-2xl font-semibold">{formatPeso(data.lucenaMatch.totalAmount)}</span>{" "}
            <span className="text-on-surface-variant">
              across {data.lucenaMatch.programCount} line items matching “{data.query}”
            </span>
          </p>
          <span
            aria-hidden
            className="mt-2 block h-1.5 rounded-full bg-secondary"
            style={{ width: `${Math.max(lucenaShare, 2)}%` }}
          />
          <ul className="mt-4 space-y-3 border-t border-outline-variant/40 pt-3">
            {data.lucenaMatch.topPrograms.map((program) => (
              <li key={`${program.agencyId}-${program.name}`} className="text-xs leading-snug">
                <span className="line-clamp-2">{program.name}</span>
                <span className="block text-on-surface-variant">
                  {formatPeso(program.amount)} · {program.department}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-xs text-on-surface-variant">
        Source:{" "}
        <a href={data.docsUrl} target="_blank" rel="noreferrer" className="underline hover:text-primary">
          BetterGov.ph PH Budget Data API
        </a>{" "}
        · Derived from DBM publications · Figures in exact pesos. Not an official government channel;
        verify against official DBM documents before citing in formal work.
      </p>
    </section>
  );
}
