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
          environmentId: "fe25ede5-d350-4bea-ab45-8e903c5a3ccc",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <App />
      </DynamicContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
