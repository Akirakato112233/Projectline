function PageHeader({ title, description }) {
  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
      <p className="mt-2 text-base text-slate-400">{description}</p>
    </section>
  )
}

export default PageHeader
