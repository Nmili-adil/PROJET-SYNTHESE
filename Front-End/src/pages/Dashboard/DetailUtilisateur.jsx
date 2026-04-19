import React, { useState, useEffect } from "react";
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
import Loading from "@/components/Partials/loading";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import ClientApi from "../../../service/Client";

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Component mounted, fetching clients...");
    fetchClients();
  }, []);

  useEffect(() => {
    console.log("Search query changed:", searchQuery);
    console.log("Current clients:", clients);
    // Filter clients based on search query
    if (searchQuery.trim() === "") {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.first_name?.toLowerCase().includes(query) ||
          client.last_name?.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, clients]);

  const fetchClients = async () => {
    try {
    
      const response = await ClientApi.getClient(); 
       setClients(response.data);
       console.log(response.data)
      setFilteredClients(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError(error.message || "Failed to fetch clients");
      toast.error(error.message || "Failed to fetch clients");
      // Initialize with empty arrays in case of error
      setClients([]);
      setFilteredClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting client:", id);
      await ClientApi.deleteClient(id);
      toast.success("Client deleted successfully");
      const updatedClients = clients.filter((client) => client.id !== id);
      setClients(updatedClients);
      setFilteredClients(updatedClients);
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };

  // Calculate pagination
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = Array.isArray(filteredClients) 
    ? filteredClients.slice(indexOfFirstClient, indexOfLastClient)
    : [];
  const totalPages = Math.ceil((Array.isArray(filteredClients) ? filteredClients.length : 0) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="rounded-2xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 p-8 text-center">
          <h2 className="text-red-500 font-semibold text-lg mb-2">Error Loading Clients</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{error}</p>
          <Button onClick={fetchClients} variant="outline" size="sm">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Clients</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage registered store clients</p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
        <div className="mb-5 pb-4 border-b border-slate-200 dark:border-slate-700/60">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-transparent dark:text-white border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              {filteredClients.length} client{filteredClients.length !== 1 ? "s" : ""} found
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.length === 0 ? (
                <TableRow>
                  <td colSpan={5} className="h-24 text-center text-sm text-slate-400">
                    {searchQuery ? "No clients match your search." : "No clients found."}
                  </td>
                </TableRow>
              ) : currentClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <TableCell className="font-medium text-slate-700 dark:text-slate-200">
                    {`${client.first_name || ""} ${client.last_name || ""}`.trim() || "—"}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">{client.email || "N/A"}</TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">{client.phone || "N/A"}</TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">
                    {[client.city, client.country].filter(Boolean).join(", ") || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this client and all their data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(client.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
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
