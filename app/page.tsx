"use client";

import { useChat } from "ai/react";
import { useRef, useState } from "react";
import Image from "next/image";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 10,
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  const startScanning = async () => {
    try {
      setIsScanning(true);
      const videoInputDevices =
        await codeReader.current.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0].deviceId;

      if (videoRef.current) {
        codeReader.current.decodeFromConstraints(
          {
            video: { deviceId: selectedDeviceId },
          },
          videoRef.current,
          (result, error) => {
            if (result) {
              // Create a synthetic event to simulate input change
              const syntheticEvent = {
                target: { value: result.getText() },
              } as React.ChangeEvent<HTMLInputElement>;

              handleInputChange(syntheticEvent);
              stopScanning();
            }
          }
        );
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopScanning = () => {
    codeReader.current.reset();
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
          <div>
            {m?.experimental_attachments
              ?.filter((attachment) =>
                attachment?.contentType?.startsWith("image/")
              )
              .map((attachment, index) => (
                <Image
                  key={`${m.id}-${index}`}
                  src={attachment.url}
                  width={500}
                  height={500}
                  alt={attachment.name ?? `attachment-${index}`}
                />
              ))}
          </div>
        </div>
      ))}

      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={(event) => {
          handleSubmit(event, {
            experimental_attachments: files,
          });
          setFiles(undefined);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        {isScanning && (
          <video ref={videoRef} className="w-full h-48 object-cover mb-2" />
        )}
        <div className="flex gap-2 mb-2">
          <input
            type="file"
            onChange={(event) => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
            multiple
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={isScanning ? stopScanning : startScanning}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isScanning ? "Stop Scanning" : "Scan Barcode"}
          </button>
        </div>
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
