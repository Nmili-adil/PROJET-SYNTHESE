import TeamForm from '../../components/Partials/TeamForm';

const Teams = () => {
  return (
    <div className="p-6 max-w-[1500px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Teams</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage Lakers team information and rosters</p>
      </div>
      <div className="w-full">
        <TeamForm />
      </div>
    </div>
  );
};

export default Teams;