export function InfoPage({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-2xl border border-line bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-12">
        <h1 className="font-serif text-4xl leading-tight tracking-tight text-navy sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{lede}</p>
        <div className="page-prose mt-8">{children}</div>
      </div>
    </article>
  );
}
