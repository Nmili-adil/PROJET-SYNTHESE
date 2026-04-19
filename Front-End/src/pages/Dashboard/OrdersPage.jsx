import React, { useState, useEffect } from "react";
import Order from "../../../service/Order";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Loading from "@/components/Partials/loading";
import DialogProductOrder from "../../components/Partials/DialogProductOrder";
import { Search } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await Order.getAll();
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      const response = await Order.update(orderId, { status: newStatus });
      console.log('Update response:', response);
      
      // Update the local state with the new status
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(`Failed to update order status: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Order.delete(id);
      setOrders(orders.filter(order => order.id !== id));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = 
      searchQuery === "" ||
      (order.products && order.products.length > 0 && 
        order.products.some(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
      `${order.client?.first_name} ${order.client?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate pagination
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const statusStyle = (s) => ({
    waiting:   "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    delivered: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    returned:  "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400",
  }[s] || "bg-slate-100 text-slate-500");

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage and track all customer orders</p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5 pb-4 border-b border-slate-200 dark:border-slate-700/60">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by product or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-transparent dark:text-white border-slate-300 dark:border-slate-700"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <Table>
            <TableCaption>
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="h-24 text-center text-sm text-slate-400">No orders match your filters.</td>
                </TableRow>
              ) : currentOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <TableCell className="font-mono text-xs text-slate-400">{order.id}</TableCell>
                  <TableCell className="font-medium text-slate-700 dark:text-slate-200">
                    {order.client ? `${order.client.first_name} ${order.client.last_name}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DialogProductOrder products={order.products || []} />
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700 dark:text-slate-200">
                    ${parseFloat(order.total_amount || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                      <SelectTrigger className="w-[130px] h-8 text-xs border-0 p-0 shadow-none focus:ring-0">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(order.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          {order.status}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(order.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-5 pt-4 border-t border-slate-200 dark:border-slate-700/60">
            <Button variant="outline" size="sm" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button key={n} size="sm" variant={currentPage === n ? "default" : "outline"} onClick={() => paginate(n)}>
                {n}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 