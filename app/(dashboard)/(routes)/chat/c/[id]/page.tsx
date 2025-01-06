"use client";
import { Message, useChat } from "ai/react";
import { useRef, useState, useEffect, useContext, FormEvent, use } from "react";
import Image from "next/image";
import { Html5Qrcode } from "html5-qrcode";
import { ChatContext } from "../../../../../../context/ChatContext";
import { useParams } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";

export default function Chat() {
  const initialMessages: Message[] = [];

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    maxSteps: 5,
    initialMessages,
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const params = useParams();
  const chatID = params.id;

  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("chat data not found");
  }
  const { prompt } = context;

  const startScanner = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ video: true });
      }
    } catch (err) {
      console.error("Camera permission denied:", err);
      return;
    }

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" }, // Use the back camera
        {
          fps: 10, // Frame per second
          qrbox: { width: 250, height: 250 }, // Scanning box size
        },
        (decodedText) => {
          handleInputChange({
            target: {
              value:
                "Product code is " + decodedText + ", is it harmful or not?",
            },
          } as React.ChangeEvent<HTMLInputElement>); // Append to the input field
          stopScanner();
        },
        (errorMessage) => {
          console.log("Scanning error:", errorMessage);
        }
      )
      .catch((err) => console.error("Scanner initialization error:", err));
    setIsScanning(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
        setIsScanning(false);
      });
    }
  };

  const { user } = useUser();
  const { userId } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID,
          username: user?.username,
          userID: userId,
        }),
      });

      const data = await response.json();

      // make toast notification
      if (data.hasAccess === false) {
        alert("You do not have access to this chat");
      } else {
        console.log(data);
        alert("You have access to this chat");
      }
    };
    if (prompt) {
      append({ role: "user", content: prompt });
    } else if (prompt === "") {
      checkAccess();
    }
  }, []);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? (
            <span className="font-bold text-blue-500">User:</span>
          ) : (
            <span className="font-bold text-green-500">AI:</span>
          )}{" "}
          {m.content || "Generating response..."}
          <div>
            {m.experimental_attachments &&
              m.experimental_attachments
                .filter((attachment) =>
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
          console.log(event);
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <input
          type="file"
          className=""
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="w-full p-2 bg-blue-500 text-white rounded mt-2"
          onClick={isScanning ? stopScanner : startScanner}
        >
          {isScanning ? "Stop Scanning" : "Start Barcode Scanner"}
        </button>
        <div id="reader" className="mt-2" />
      </form>
    </div>
  );
}
