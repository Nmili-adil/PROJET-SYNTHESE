import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import NewsForm from "../../components/Partials/NewsForm";
import ResultMatchsForm from "../../components/Partials/ResultMatchsForm";
import PlayerStatsForm from "../../components/Partials/PlayerStatsForm";
import MatchCalendarForm from '../../components/Partials/MatchCalendarForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { TeamInfoForm } from '../../components/Partials/TeamInfoForm';

const CreateArticles = () => {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Create Content</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Add news articles, match results, calendar events, and more</p>
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
          <TabsContent value="news"><NewsForm /></TabsContent>
          <TabsContent value="match"><ResultMatchsForm /></TabsContent>
          <TabsContent value="player"><PlayerStatsForm /></TabsContent>
          <TabsContent value="calendar">
            <div className="space-y-1 mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Create Match Calendar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add upcoming matches to the calendar</p>
            </div>
            <MatchCalendarForm />
          </TabsContent>
          <TabsContent value="team"><TeamInfoForm /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CreateArticles