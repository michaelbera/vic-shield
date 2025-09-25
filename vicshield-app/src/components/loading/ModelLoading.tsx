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
  const { isOpen, text } = useModelLoading();

  return (
    <dialog id="my_modal_1" className={`modal ${isOpen ? "modal-open" : ""} `}>
      <div className="flex flex-col gap-2 items-center justify-center ">
        <div className="spinner">
          <div className="spinner1"></div>
        </div>
        <span className="text-lg font-medium">{text}</span>
      </div>
    </dialog>
  );
};

export default ModelLoading;
