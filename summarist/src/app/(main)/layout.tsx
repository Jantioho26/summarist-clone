import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
    children,
}: {
    children: ReactNode;
}) {
return (
   <div className="main__layout">
  <Sidebar />
  <main className="main__content">{children}</main>
</div>
);
}