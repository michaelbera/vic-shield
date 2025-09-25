import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  const ctx = useDynamicContext();
  const address = ctx?.primaryWallet?.address;

  return useQuery({
    queryKey: ["user", address],
    enabled: !!address,
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_VICSHIELD_API_URL}/users/${address}`
      );
      return res.json();
    },
  });
};

export default useUser;
