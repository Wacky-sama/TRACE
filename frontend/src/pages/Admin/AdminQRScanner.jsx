import { useState } from "react";
import { useZxing } from "react-zxing";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
import api from "../../services/api";
import { useTheme } from "../../hooks/useTheme";

const AdminQRScanner = () => {
  const { theme } = useTheme();  
  const isDark = theme === "dark"; 

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
    <div className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen p-6`}>
      <h2 className="mb-4 text-2xl font-bold">QR Code Scanner</h2>
      <p className="mb-4 text-lg font-semibold">
        On this page, you can scan QR codes for event attendance.
      </p>
      <p className="mb-6 text-sm">
        Point your camera at a valid QR code to mark attendance automatically.
      </p>
      <div className="mb-6 border-t"></div>
      <div className="flex flex-col items-center justify-center">
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

        <div className={`w-full max-w-sm overflow-hidden border rounded-lg shadow transition-colors duration-300 ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="relative bg-black rounded-lg aspect-square">
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
        </div>

        <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {result && result !== "No result"
            ? `Scanned token: ${result}`
            : "Waiting for QR..."}
        </p>
      </div>
    </div>
  );
};

export default AdminQRScanner;
