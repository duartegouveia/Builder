import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import ExperimentCalc from "@/pages/ExperimentCalc";
import LogicBuilder from "@/pages/LogicBuilder";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ExperimentCalc}/>
      <Route path="/logic" component={LogicBuilder}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
