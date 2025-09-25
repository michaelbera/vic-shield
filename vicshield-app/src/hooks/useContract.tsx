import { useQuery } from "@tanstack/react-query";

const useContract = (hash: string) => {
  const data = useQuery({
    queryKey: ["contract", hash],
    enabled: !!hash,
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_VICSHIELD_API_URL}/contracts/${hash}`
      );
      return res.json();
    },
  });

  return data;
};

export default useContract;
