import Sidebar from "@/components/cms/components/sidebar";
import Modals from "@/components/ui/modals";
export default function CMSLayout({ children }) {
  return (
    <>
      {/* Mengunci container utama agar tingginya pas se-layar browser */}
      <div
        className="cms-container d-flex w-100"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        {/* Sidebar sudah terkunci 100vh di dalamnya */}
        <Sidebar />

        {/* PERBAIKAN: overflow-y-auto di sini membuat hanya area konten data buku saja yang bisa di-scroll */}
        <main
          className="main-content p-4 flex-grow-1 w-100 bg-light"
          style={{ overflowY: "auto" }}
        >
          {children}
        </main>
      </div>
      <Modals />
    </>
  );
}
