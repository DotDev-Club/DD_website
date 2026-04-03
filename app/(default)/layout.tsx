import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Terminal from "@/components/Terminal";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Terminal />
    </div>
  );
}
