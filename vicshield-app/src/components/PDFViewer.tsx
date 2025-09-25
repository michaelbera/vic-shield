import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ hash }: { hash: string }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ height: "100vh" }}>
      <Viewer
        fileUrl={`${import.meta.env.VITE_VICSHIELD_API_URL}/files/${hash}`} // đường dẫn file pdf (có thể là url hoặc blob)
        plugins={[defaultLayoutPluginInstance]}
      />
    </div>
  );
}
