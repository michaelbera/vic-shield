import { useContracts } from "~/hooks/useContract";
import { Score } from "./ContractDetails";
import SignContract from "./SignContract";
import { useNavigate } from "react-router-dom";

export default function ContractsList() {
  const contracts = useContracts();
  const navigate = useNavigate();

  return (
    <div className="w-full mt-4">
      <h2 className="text-xl font-bold mb-4">Contracts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {contracts.data?.map((c: any) => (
          <div
            key={c.id}
            className="card card-compact w-full bg-base-100 shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/contracts/${c.hash}`)}
          >
            <figure className="h-40 bg-base-200 flex items-center justify-center">
              {/* icon kiểu file */}
              <span className="text-5xl"></span>
              <img
                src={"https://i.ibb.co/60fvtXtB/image.png"}
                alt={c.title}
                className=" w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title text-sm truncate ">
                {c.title.slice(0, 15)}... <Score value={c.score || 0} />
              </h3>
              <p className="text-xs text-base-content/70 h-12 overflow-hidden">
                {c.description}
              </p>
              <div className="card-actions justify-end mt-2">
                <SignContract hash={c.hash} size="small" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
