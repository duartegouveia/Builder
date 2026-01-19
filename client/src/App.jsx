import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found.jsx";
import ExperimentCalc from "@/pages/ExperimentCalc.jsx";
import LogicBuilder from "@/pages/LogicBuilder.jsx";

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
