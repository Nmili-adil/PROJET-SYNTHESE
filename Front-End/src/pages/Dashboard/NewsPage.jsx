import ArticlesTable from '../../components/Partials/ArticlesTable'
import MatchCalendarTable from '../../components/Partials/MatchCalendarTable'
import MatchResultsTable from '../../components/Partials/MatchResultsTable'
import PlayersTableNew from '../../components/Partials/PlayersTableNew'
import ResultMatchsForm from '../../components/Partials/ResultMatchsForm'
import TeamsTable from '../../components/Partials/TeamsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

const NewsPageDashboard = () => {
    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Content Library</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Browse and manage all published content</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
                <Tabs defaultValue="news" className="w-full">
                    <TabsList className="w-full mb-4">
                        <TabsTrigger value="news">News</TabsTrigger>
                        <TabsTrigger value="match">Match Results</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                        <TabsTrigger value="team">Teams</TabsTrigger>
                        <TabsTrigger value="player">Players</TabsTrigger>
                    </TabsList>
                    <TabsContent value="news"><ArticlesTable /></TabsContent>
                    <TabsContent value="match"><MatchResultsTable /></TabsContent>
                    <TabsContent value="calendar"><MatchCalendarTable /></TabsContent>
                    <TabsContent value="team"><TeamsTable /></TabsContent>
                    <TabsContent value="player"><PlayersTableNew /></TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default NewsPageDashboard