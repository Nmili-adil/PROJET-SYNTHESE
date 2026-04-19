import { useEffect, useState } from "react";
import AdminApi from "../../../service/Admins";
import Order from "../../../service/Order";
import Product from "../../../service/Product";
import ClientApi from "../../../service/Client";
import ProductAnalytics from "../../components/Analytics/ProductAnalytics";
import OrderAnalytics from "../../components/Analytics/OrderAnalytics";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowUpRight, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { ADMIN_CREATE, PRODUCT_CREATE, CREATE_ARTICLES, ORDERS } from "../../router/paths";

function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="w-20 h-7 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2" />
      <div className="w-28 h-3.5 bg-slate-100 dark:bg-slate-700/50 rounded-md" />
    </div>
  );
}

const STATUS = {
  waiting:   { bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-600 dark:text-amber-400",   dot: "bg-amber-400"   },
  delivered: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-400" },
  returned:  { bg: "bg-red-50 dark:bg-red-900/20",       text: "text-red-500 dark:text-red-400",       dot: "bg-red-400"     },
};

const QUICK = [
  { label: "Add Product",  to: PRODUCT_CREATE,  cls: "bg-purple-600 hover:bg-purple-700" },
  { label: "New Article",  to: CREATE_ARTICLES, cls: "bg-blue-600 hover:bg-blue-700"     },
  { label: "Add Admin",    to: ADMIN_CREATE,     cls: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "View Orders",  to: ORDERS,           cls: "bg-amber-600 hover:bg-amber-700"  },
];

const TABS = ["overview", "products", "orders"];

const Home = () => {
  const [stats, setStats]             = useState(null);
  const [recentOrders, setRecent]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState("overview");

  useEffect(() => {
    (async () => {
      try {
        const [a, p, o, c] = await Promise.allSettled([
          AdminApi.getAdmin(),
          Product.getAll(),
          Order.getAll(),
          ClientApi.getClient(),
        ]);
        const admins   = a.status === "fulfilled" ? a.value.data : [];
        const products = p.status === "fulfilled" ? p.value.data : [];
        const orders   = o.status === "fulfilled" ? o.value.data : [];
        const clients  = c.status === "fulfilled" ? c.value.data : [];

        const revenue = orders
          .filter(x => x.status === "delivered")
          .reduce((s, x) => s + parseFloat(x.total_amount || 0), 0);

        setStats({
          admins:  admins.filter(x => x.role === "admin").length,
          products: products.length,
          orders:   orders.length,
          clients:  clients.length,
          revenue,
          pending: orders.filter(x => x.status === "waiting").length,
        });
        setRecent(orders.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis = stats
    ? [
        {
          label: "Total Revenue", icon: TrendingUp,
          value: `$${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          badge: "Delivered",  badgeCls: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
          sub: "From completed orders",  iconCls: "text-emerald-500", iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
          label: "Total Orders", icon: ShoppingCart,
          value: stats.orders,
          badge: `${stats.pending} pending`, badgeCls: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
          sub: "All statuses",  iconCls: "text-blue-500", iconBg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
          label: "Products", icon: Package,
          value: stats.products,
          badge: "In store", badgeCls: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
          sub: "Active listings", iconCls: "text-purple-500", iconBg: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
          label: "Clients", icon: Users,
          value: stats.clients,
          badge: "Registered", badgeCls: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
          sub: "Total members", iconCls: "text-orange-500", iconBg: "bg-orange-50 dark:bg-orange-900/20",
        },
      ]
    : [];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back. Here's what's happening today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK.map(({ label, to, cls }) => (
            <Link
              key={to}
              to={to}
              className={`${cls} text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
          : kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5 hover:shadow-md dark:hover:shadow-slate-900/40 transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${k.iconBg} flex items-center justify-center`}>
                      <Icon size={18} className={k.iconCls} />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${k.badgeCls}`}>
                      {k.badge}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white mb-0.5">{k.value}</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{k.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{k.sub}</p>
                </div>
              );
            })}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700/60 flex gap-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[#552582] text-[#552582] dark:border-[#FDB927] dark:text-[#FDB927]"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Product Analytics</h3>
            <ProductAnalytics />
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Order Analytics</h3>
            <OrderAnalytics />
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Product Analytics</h3>
          <ProductAnalytics />
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-5">
          {/* Recent orders */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Recent Orders</h3>
              <Link
                to={ORDERS}
                className="text-xs font-semibold text-[#552582] dark:text-[#FDB927] hover:underline flex items-center gap-1"
              >
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-700/40 animate-pulse" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-slate-400">
                <AlertCircle size={30} className="mb-2 opacity-40" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentOrders.map((order) => {
                  const s = STATUS[order.status] || STATUS.waiting;
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center flex-shrink-0">
                          <ShoppingCart size={14} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white leading-tight">
                            {order.client
                              ? `${order.client.first_name} ${order.client.last_name}`
                              : `Order #${order.id}`}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            ${parseFloat(order.total_amount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {order.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Order Analytics</h3>
            <OrderAnalytics />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
