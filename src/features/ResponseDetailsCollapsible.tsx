"use client";

import { useState } from "react";
import { ResponseData } from "@/types";
import { Eye } from "lucide-react";
import Modal from "@/@components/ui/Modal";
import ResponseDetailsContent from "./ResponseDetailsContent";
import { format } from "date-fns";

interface ResponseDetailsModalProps {
  response: ResponseData;
  showMetadata?: boolean;
}

export default function ResponseDetailsModal({ 
  response, 
  showMetadata = false 
}: ResponseDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "PPpp");
    } catch {
      return timestamp;
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs underline inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Eye className="h-3 w-3" /> Details
      </button>
      
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Response Details"
        description={`Status: ${response.response.status} • ${formatTimestamp(response.timestamp)}`}
      >
        <ResponseDetailsContent response={response} showMetadata={showMetadata} />
      </Modal>
    </>
  );
}
