import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import axios from "axios";
import useContract from "~/hooks/useContract";

const SignContract = ({
  hash,
  size = "small",
}: {
  hash: string;
  size?: string;
}) => {
  const { primaryWallet } = useDynamicContext();
  const contract = useContract(hash!);

  const onSign = async (e: any) => {
    e.stopPropagation();
    if (!primaryWallet) {
      alert("Please connect your wallet first.");
      return;
    }

    const signature = await primaryWallet.signMessage(hash);
    await axios.post(
      `${import.meta.env.VITE_VICSHIELD_API_URL}/contracts/${hash}/sign`,
      {
        signer: primaryWallet.address,
        signature,
      }
    );
    contract.refetch();
  };

  const isSigned = contract.data?.signers?.includes(
    primaryWallet?.address || ""
  );
  if (isSigned) {
    return <div className="badge badge-success">You have signed</div>;
  }
  return (
    <button
      className={`btn btn-primary ${size === "small" ? "btn-sm" : "btn-lg"}`}
      onClick={onSign}
    >
      Sign Contract{" "}
    </button>
  );
};

export default SignContract;
