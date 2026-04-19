import { useState } from "react";
import PlayersTable from "@/components/Partials/PlayersTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PLAYERS_CREATE } from "@/router/paths";

const Players = () => {
  const [filter, setFilter] = useState("");
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Players</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage Lakers roster and player profiles</p>
        </div>
        <Link to={PLAYERS_CREATE}>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold">Add Player</Button>
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, nickname, or birth place..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="pl-9 max-w-md bg-transparent dark:text-white border-slate-300 dark:border-slate-700"
          />
        </div>
        <PlayersTable filter={filter} />
      </div>
    </div>
  );
};

export default Players;
