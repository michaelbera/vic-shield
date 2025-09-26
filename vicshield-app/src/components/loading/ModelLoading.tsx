import { create } from "zustand";
import "./ModelLoading.css";

type ModelLoadingState = {
  isOpen: boolean;
  text: string;
  open: (text?: string) => void;
  close: () => void;
  setText: (text: string) => void;
};

export const useModelLoading = create<ModelLoadingState>((set) => ({
  isOpen: false,
  text: "loading...",
  open: (text) => set({ isOpen: true, text: text ?? "loading..." }),
  close: () => set({ isOpen: false }),
  setText: (text) => set({ text }),
}));

const ModelLoading = () => {
  const { isOpen } = useModelLoading();

  return (
    <dialog id="my_modal_1" className={`modal ${!isOpen ? "modal-open" : ""} `}>
      <div className="flex flex-col gap-2 items-center justify-center ">
        <div className="spinner">
          <div className="spinner1"></div>
        </div>
        <div className="loading-text loading04 flex gap-0.5">
          <span>T</span>
          <span>h</span>
          <span>i</span>
          <span>n</span>
          <span>k</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </dialog>
  );
};

export default ModelLoading;
