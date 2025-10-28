import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import toast from "react-hot-toast";
import api from "../../services/api";

const AdminQRCheckIn = () => {
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    codeReader
      .decodeFromVideoDevice(null, videoRef.current, async (result, err) => {
        if (result && !isProcessing) {
          await handleScan(result.getText());
        }
      })
      .catch((err) => console.error("Camera error:", err));

    return () => {
      codeReader.reset();
    };
  }, []);

  const handleScan = async (data) => {
    setIsProcessing(true);
    setScannedData(data);
    toast.loading("Verifying QR code...");

    try {
      const parsed = JSON.parse(data);
      const res = await api.post("/checkin", { eventId: parsed.eventId });
      toast.dismiss();
      toast.success(`Checked in: ${res.data.userName || "Attendee"}`);
    } catch (err) {
      toast.dismiss();
      toast.error("Invalid or expired QR code.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 rounded-2xl border border-border shadow-lg bg-background">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Event QR Check-In
      </h2>

      <div className="flex justify-center mb-6">
        <video ref={videoRef} className="w-80 h-80 rounded-xl border" />
      </div>

      {scannedData && (
        <div className="text-center text-sm text-muted-foreground">
          Last scanned: <span className="font-medium">{scannedData}</span>
        </div>
      )}
    </div>
  );
};

export default AdminQRCheckIn;
