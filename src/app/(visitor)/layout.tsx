import { Navbar } from "~/app/(visitor)/navbar";

export default function VisitorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
