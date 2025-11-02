import { useState } from "react";
import { useZxing } from "react-zxing";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
import api from "../../services/api";

const AdminQRScanner = () => {
  const [result, setResult] = useState("No result");
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashState, setFlashState] = useState(null);

  const handleScan = async (token) => {
    if (!token || isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await api.post("/attendance/scan", { token });
      toast.success(response.data.message);

      setFlashState("success");
      setTimeout(() => setFlashState(null), 600);
    } catch (err) {
      const res = err.response;
      console.error("QR Scan Error:", res?.data || err);
      const detail =
        typeof res?.data?.detail === "string"
          ? res.data.detail
          : Array.isArray(res?.data?.detail)
          ? res.data.detail.map((d) => d.msg).join(", ")
          : "Failed to validate QR.";

      toast.error(detail);
    } finally {
      setIsProcessing(false);
    }
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      try {
        const parsed = JSON.parse(text);
        if (parsed.token) {
          setResult(parsed.token);
          handleScan(parsed.token);
        } else {
          toast.error("Invalid QR data.");
          setFlashState("error");
          setTimeout(() => setFlashState(null), 600);
        }
      } catch {
        toast.error("Invalid QR format.");
        setFlashState("error");
        setTimeout(() => setFlashState(null), 600);
      }
    },
    onError(error) {
      if (error.name === "NotAllowedError") {
        toast.error("Camera permission denied. Please allow camera access.");
      } else {
        console.debug(error.message);
      }
    },
  });

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      {flashState && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 pointer-events-none ${
            flashState === "success" ? "bg-green-500/40" : "bg-red-500/40"
          }`}
        >
          {flashState === "success" ? (
            <CheckCircle
              className="text-white w-28 h-28 animate-bounce drop-shadow-lg"
              strokeWidth={1.5}
            />
          ) : (
            <XCircle
              className="text-white w-28 h-28 animate-bounce drop-shadow-lg"
              strokeWidth={1.5}
            />
          )}
        </div>
      )}

      <h1 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
        QR Code Scanner
      </h1>

      <div className="relative w-full max-w-sm overflow-hidden bg-black rounded-lg aspect-square">
        <video
          ref={ref}
          className="object-cover w-full h-full"
          muted
          autoPlay
          playsInline
        />
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/50">
            Processing...
          </div>
        )}
      </div>

      <p className="mt-4 text-gray-700 dark:text-gray-300">
        {result && result !== "No result"
          ? `Scanned token: ${result}`
          : "Waiting for QR..."}
      </p>
    </div>
  );
};

export default AdminQRScanner;
