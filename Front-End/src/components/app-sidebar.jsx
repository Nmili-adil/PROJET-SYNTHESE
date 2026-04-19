import { useState } from "react";
import { ArrowDownUp, ChevronDown, FolderTree, Home, LogOut, Newspaper, Package, Plus, Tag, Trophy, User, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import Logo2 from "../../public/asset/logo2.jpeg";
import { useAdminContext } from "../../api/context/AdminContext";
import { ADMIN, ADMIN_CREATE, CATEGORIES, DASHBOARD, CREATE_ARTICLES, ORDERS, PLAYERS, PRODUCT, PRODUCT_CREATE, SUBCATEGORIES, TEAMS, USER_DETAIL, ARTICLES_CONTENT } from "../router/paths";

const NAV = [
  { group: "Overview", items: [{ icon: Home, label: "Dashboard", to: DASHBOARD }] },
  { group: "Administration", items: [
    { icon: Users, label: "Admins", to: ADMIN },
    { icon: Plus, label: "New Admin", to: ADMIN_CREATE },
  ]},
  { group: "Lakers", items: [
    { icon: User, label: "Players", to: PLAYERS },
    { icon: Trophy, label: "Teams", to: TEAMS },
  ]},
  { group: "Store", items: [
    { icon: Package, label: "Products", to: PRODUCT },
    { icon: Plus, label: "New Product", to: PRODUCT_CREATE },
    { icon: Tag, label: "Categories", to: CATEGORIES },
    { icon: FolderTree, label: "Sub-categories", to: SUBCATEGORIES },
  ]},
  { group: "Content", items: [
    { icon: Newspaper, label: "News Articles", to: ARTICLES_CONTENT },
    { icon: Plus, label: "New Article", to: CREATE_ARTICLES },
  ]},
  { group: "Users & Sales", items: [
    { icon: Users, label: "Clients", to: USER_DETAIL },
    { icon: ArrowDownUp, label: "Orders", to: ORDERS },
  ]},
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAdminContext();
  const [openGroups, setOpenGroups] = useState(NAV.map(() => true));

  const handleLogout = () => { logout(); navigate("/login"); };
  const toggleGroup = (i) => setOpenGroups(g => g.map((v, idx) => idx === i ? !v : v));

  return (
    <Sidebar
      style={{
        "--sidebar-background": "#100d24",
        "--sidebar-foreground": "#e2d9f3",
        "--sidebar-border": "rgba(255,255,255,0.06)",
        "--sidebar-accent": "rgba(85,37,130,0.4)",
        "--sidebar-accent-foreground": "#FDB927",
        "--sidebar-ring": "#552582",
        "--sidebar-width": "240px",
      }}
    >
      <SidebarHeader className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link to="/" className="flex items-center gap-3">
          <img
            src={Logo2}
            alt="Lakers"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            style={{ boxShadow: "0 0 0 2px #FDB927, 0 0 14px rgba(253,185,39,0.35)" }}
          />
          <div className="leading-tight">
            <p className="text-white font-bold text-sm tracking-wide">KINETIC COURT</p>
            <p className="font-semibold" style={{ color: "#FDB927", fontSize: "9px", letterSpacing: "0.22em" }}>
              ADMIN PANEL
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent style={{ scrollbarWidth: "none" }} className="py-3 px-2 gap-0">
        {NAV.map(({ group, items }, gi) => (
          <div key={gi} className="mb-1">
            <button
              onClick={() => toggleGroup(gi)}
              className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 rounded-md transition-colors hover:bg-white/5"
            >
              <span className="font-bold uppercase" style={{ color: "rgba(253,185,39,0.55)", fontSize: "9px", letterSpacing: "0.18em" }}>
                {group}
              </span>
              <ChevronDown size={11} style={{ color: "rgba(253,185,39,0.35)", transform: openGroups[gi] ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }} />
            </button>

            {openGroups[gi] && (
              <SidebarMenu>
                {items.map(({ icon: Icon, label, to }) => {
                  const active = location.pathname === to;
                  return (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link
                          to={to}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${!active ? "hover:bg-white/5" : ""}`}
                          style={active ? {
                            background: "linear-gradient(135deg, rgba(85,37,130,0.85), rgba(85,37,130,0.55))",
                            color: "#FDB927",
                            boxShadow: "0 2px 10px rgba(85,37,130,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                          } : { color: "rgba(226,217,243,0.6)" }}
                        >
                          <Icon size={15} style={{ color: active ? "#FDB927" : "rgba(226,217,243,0.4)", flexShrink: 0 }} />
                          <span>{label}</span>
                          {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FDB927", boxShadow: "0 0 6px #FDB927" }} />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {admin && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2" style={{ background: "rgba(85,37,130,0.15)", border: "1px solid rgba(85,37,130,0.28)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #552582, #7B2FBE)", color: "#FDB927", boxShadow: "0 2px 8px rgba(85,37,130,0.5)" }}>
              {(admin.first_name?.[0] || "").toUpperCase()}{(admin.last_name?.[0] || "").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate leading-tight">{admin.first_name} {admin.last_name}</p>
              <p className="text-xs truncate leading-tight capitalize" style={{ color: "rgba(253,185,39,0.55)" }}>{admin.role || "Admin"}</p>
            </div>
          </div>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-red-500/10" style={{ color: "rgba(248,113,113,0.7)" }}>
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out of Dashboard?</AlertDialogTitle>
              <AlertDialogDescription>You will need to log in again to access the admin panel.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Sign Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
