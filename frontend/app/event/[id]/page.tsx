import ClientPage from "./_ClientPage";
export const dynamic = "force-static";
export async function generateStaticParams() { return [{ id: "1" }]; }
export default function Page() { return <ClientPage />; }
