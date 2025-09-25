import { useState } from "react";

type Contract = {
  id: number;
  title: string;
  date: string;
  owner: string;
  img?: string;
  type: "doc" | "pdf" | "txt";
};

const mockContracts: Contract[] = [
  {
    id: 1,
    title: "PrimeVault WPP - 2.0",
    date: "22 Sep 2026",
    owner: "You",
    img: "https://lh3.googleusercontent.com/rd-d/ALs6j_FTsO7Xs0icyMc5fWVAK6t4V7xekaDIRplCGAoBZx26ARj35VP9pMKMfsN7oKmA7_fNBPqfBvk4THl8K9_0yzqieanJCTJPQcQSCWPT_9z5Y6K-F9LLNa8ybgNovoknppxVBDlm-xDoZ8-ODE4QrmY21uMSiB_BPAegMsR7aCJN2jY5lqBl8dVbKAYvusCqRgw_KHHxShKwz-ZP0HI_bWIfVnzGuEkzYvXQAmqcYKNm0vORZBxYefXWv73Av0AUhbT1HIM5ZFFjWQCvKLlOMGMlCTWqeKDTIgIiP889gYd3sty365U78IRos-CxwrZ4OvvokqYFtD_86CsRHTwrHCfSgsvKvvYEQi9flHMEMUwwuKDu_aqTocM57sKFt45k3MYKN_r3MGuFTN6SMIa_myHEFq15Hd-S_HKntSglFv4X_wK3Bpmtl2FS3GjVSeS1h3zjIytlo3UCxt9w7GRIZJ242AbRWNHnDeAiZ_LCCsx1unK9luyDhf_sUtTzbvD92n9IlHxsiWt4qZisJ2M4ndqHUEGTViRPunqoc9QYHY-1Wt21gAtvRAJYu_agvM4XfSeVcgEFp0Rq7R6jWJEV8XvvtpEP0Rru7KrKCead7IMeUy6KIV2bP4N9wxZmxYsOV4QxFln0z0trdG2owcSaF09gzOMVpoMriG3P0JEtJVublbsLohIEpx09HDZa2vB0uT8FXKO6VPmXFuhCwgNDLlEjgzZYCU10nLs_crvGnYeNN9qBBXpIrrIwRyQxqbgfMKbjpnR19mMhqPhpR7Gw2N7rLuu1matK2Rz09CJQwMjRewFV3d0tI7U8Y-758Onm46HpM1uLWTSHqChtQ47IMYfCG3hQ04btfj-9lPllu674kk3HVCJHVr7bFXsCGVcEs5F0ndWP_l3bo-ugCeFDjLFg3hmrWTwZhr87c1LN8gR4sQnoPCxWj40jYszKQKtAupyGiT_ITAB9YSNpPiraTwHy5mFdoklEfpW9EGc7=w416",
    type: "doc",
  },
  {
    id: 2,
    title: "Guild war",
    date: "21 Sep 2026",
    owner: "Guild Team",
    img: "https://lh3.googleusercontent.com/rd-d/ALs6j_FTsO7Xs0icyMc5fWVAK6t4V7xekaDIRplCGAoBZx26ARj35VP9pMKMfsN7oKmA7_fNBPqfBvk4THl8K9_0yzqieanJCTJPQcQSCWPT_9z5Y6K-F9LLNa8ybgNovoknppxVBDlm-xDoZ8-ODE4QrmY21uMSiB_BPAegMsR7aCJN2jY5lqBl8dVbKAYvusCqRgw_KHHxShKwz-ZP0HI_bWIfVnzGuEkzYvXQAmqcYKNm0vORZBxYefXWv73Av0AUhbT1HIM5ZFFjWQCvKLlOMGMlCTWqeKDTIgIiP889gYd3sty365U78IRos-CxwrZ4OvvokqYFtD_86CsRHTwrHCfSgsvKvvYEQi9flHMEMUwwuKDu_aqTocM57sKFt45k3MYKN_r3MGuFTN6SMIa_myHEFq15Hd-S_HKntSglFv4X_wK3Bpmtl2FS3GjVSeS1h3zjIytlo3UCxt9w7GRIZJ242AbRWNHnDeAiZ_LCCsx1unK9luyDhf_sUtTzbvD92n9IlHxsiWt4qZisJ2M4ndqHUEGTViRPunqoc9QYHY-1Wt21gAtvRAJYu_agvM4XfSeVcgEFp0Rq7R6jWJEV8XvvtpEP0Rru7KrKCead7IMeUy6KIV2bP4N9wxZmxYsOV4QxFln0z0trdG2owcSaF09gzOMVpoMriG3P0JEtJVublbsLohIEpx09HDZa2vB0uT8FXKO6VPmXFuhCwgNDLlEjgzZYCU10nLs_crvGnYeNN9qBBXpIrrIwRyQxqbgfMKbjpnR19mMhqPhpR7Gw2N7rLuu1matK2Rz09CJQwMjRewFV3d0tI7U8Y-758Onm46HpM1uLWTSHqChtQ47IMYfCG3hQ04btfj-9lPllu674kk3HVCJHVr7bFXsCGVcEs5F0ndWP_l3bo-ugCeFDjLFg3hmrWTwZhr87c1LN8gR4sQnoPCxWj40jYszKQKtAupyGiT_ITAB9YSNpPiraTwHy5mFdoklEfpW9EGc7=w416",
    type: "doc",
  },
  {
    id: 3,
    title: "PrimePoint",
    date: "12 Sep 2026",
    owner: "Prime Team",
    img: "https://lh3.googleusercontent.com/rd-d/ALs6j_FTsO7Xs0icyMc5fWVAK6t4V7xekaDIRplCGAoBZx26ARj35VP9pMKMfsN7oKmA7_fNBPqfBvk4THl8K9_0yzqieanJCTJPQcQSCWPT_9z5Y6K-F9LLNa8ybgNovoknppxVBDlm-xDoZ8-ODE4QrmY21uMSiB_BPAegMsR7aCJN2jY5lqBl8dVbKAYvusCqRgw_KHHxShKwz-ZP0HI_bWIfVnzGuEkzYvXQAmqcYKNm0vORZBxYefXWv73Av0AUhbT1HIM5ZFFjWQCvKLlOMGMlCTWqeKDTIgIiP889gYd3sty365U78IRos-CxwrZ4OvvokqYFtD_86CsRHTwrHCfSgsvKvvYEQi9flHMEMUwwuKDu_aqTocM57sKFt45k3MYKN_r3MGuFTN6SMIa_myHEFq15Hd-S_HKntSglFv4X_wK3Bpmtl2FS3GjVSeS1h3zjIytlo3UCxt9w7GRIZJ242AbRWNHnDeAiZ_LCCsx1unK9luyDhf_sUtTzbvD92n9IlHxsiWt4qZisJ2M4ndqHUEGTViRPunqoc9QYHY-1Wt21gAtvRAJYu_agvM4XfSeVcgEFp0Rq7R6jWJEV8XvvtpEP0Rru7KrKCead7IMeUy6KIV2bP4N9wxZmxYsOV4QxFln0z0trdG2owcSaF09gzOMVpoMriG3P0JEtJVublbsLohIEpx09HDZa2vB0uT8FXKO6VPmXFuhCwgNDLlEjgzZYCU10nLs_crvGnYeNN9qBBXpIrrIwRyQxqbgfMKbjpnR19mMhqPhpR7Gw2N7rLuu1matK2Rz09CJQwMjRewFV3d0tI7U8Y-758Onm46HpM1uLWTSHqChtQ47IMYfCG3hQ04btfj-9lPllu674kk3HVCJHVr7bFXsCGVcEs5F0ndWP_l3bo-ugCeFDjLFg3hmrWTwZhr87c1LN8gR4sQnoPCxWj40jYszKQKtAupyGiT_ITAB9YSNpPiraTwHy5mFdoklEfpW9EGc7=w416",
    type: "doc",
  },
];

export default function ContractsList() {
  const [contracts] = useState<Contract[]>(mockContracts);

  return (
    <div className="w-full mt-4">
      <h2 className="text-xl font-bold mb-4">Contracts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="card card-compact w-full bg-base-100 shadow hover:shadow-lg transition cursor-pointer"
          >
            <figure className="h-40 bg-base-200 flex items-center justify-center">
              {/* icon kiểu file */}
              <span className="text-5xl"></span>
              <img src={c.img} alt={c.title} className=" w-full object-cover" />
            </figure>
            <div className="card-body">
              <h3 className="card-title text-sm truncate">{c.title}</h3>
              <p className="text-xs opacity-70">{c.date}</p>
              <div className="card-actions justify-end">
                <div className="badge badge-outline">{c.owner}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
