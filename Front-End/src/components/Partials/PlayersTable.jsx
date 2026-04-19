import { useEffect, useState } from "react";
import Players from "../../../service/Players";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";     
import { toast } from "react-hot-toast";
import { AlertDialog, AlertDialogTitle, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";
import { Link } from "react-router-dom";
import { PLAYERS_EDIT } from "../../router/paths";
  import Loading from "./loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PlayersTable({ filter = "" }) {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await Players.getPlayers();
      setPlayers(res.data);
    } catch (error) {}
    setLoading(false);
  };
  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (id) => {
    toast
      .promise(Players.deletePlayer(id), {
        loading: "Deleting player...",
        success: (data) =>
          `Player ${data.data.full_name} deleted successfully!`,
        error: (err) => `Could not delete player: ${err.message}`,
      })
      .then(() => {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.id !== id)
        );
      });
  };

  // Filtering logic
  const filteredPlayers = filter
    ? players.filter(player =>
        (player.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
         player.nickname?.toLowerCase().includes(filter.toLowerCase()) ||
         player.birth_place?.toLowerCase().includes(filter.toLowerCase()))
      )
    : players;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Players</h2>
        
      </div>
      
      {/* {loading ? (
        <Loading />
      ) : ( */}
        <Table>
          <TableCaption>List of Players</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead>Birth Place</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Championships</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <img src={backendUrl + '/' + player.image} alt={player.full_name} className="w-16 h-16 rounded-full object-cover shadow-md" />
                </TableCell>
                <TableCell>{player.full_name}</TableCell>
                <TableCell>{player.birth_date}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="max-w-[150px] truncate">
                          {player.birth_place}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[300px]">{player.birth_place}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{player.nickname}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="max-w-[200px] truncate">
                          {player.championships}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[300px]">{player.championships}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Link to={PLAYERS_EDIT(player.id)}>
                    <Button size="sm" className="mr-2" variant="outline">Edit</Button>
                  </Link>
                  <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(player.id)}
                      > 
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      {/* )} */}
    </div>
  );
}