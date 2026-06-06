import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import LayoutRoute from "./LayoutRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30s
      gcTime: 1000 * 60 * 5, // 5 phút
      retry: false,
      refetchOnWindowFocus: false, // không refetch khi quay lại tab
      refetchOnMount: true,
      refetchOnReconnect: false, // không refetch khi mất mạng rồi có lại
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster />
        <ScrollToTop />
        <LayoutRoute />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
