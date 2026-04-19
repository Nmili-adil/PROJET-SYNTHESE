import ArticlesTable from '../../components/Partials/ArticlesTable';

const Articles = () => {
    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Articles</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage all published and draft articles</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
                <ArticlesTable />
            </div>
        </div>
    );
};

export default Articles; 