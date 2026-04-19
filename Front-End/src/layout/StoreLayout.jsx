import StoreNav from "@/components/Partials/StoreNav"
import { Outlet } from "react-router-dom"
import Footer from "@/components/Partials/Footer"
import FooterNav from "@/components/Partials/FooterNav"



function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface">
      <StoreNav/>
      <main className="flex-1 w-full pt-16">
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}

export default StoreLayout