import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DynamicContextProvider
        settings={{
          environmentId: "a5204dbb-9392-401d-9857-c1370cf3d6b6",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <App />
      </DynamicContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
