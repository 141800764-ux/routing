export default async function ProjectPage({ params }) {
  const { name } = await params

  return (
    <main>
      <h1>Project {name}</h1>
    </main>
  )
}