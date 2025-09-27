import { readAppContent } from "@/lib/appContentStore";
import { HomeClient } from "./_components/HomeClient";

export default async function HomePage() {
  const content = await readAppContent();
  return <HomeClient content={content.home} />;
}
