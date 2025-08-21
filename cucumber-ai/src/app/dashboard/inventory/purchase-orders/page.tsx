"use client"
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/chatbot/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'File conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SiteHeader title="Purchase Orders" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="max-w-md mx-auto py-10 px-4">
            <h2 className="text-xl font-semibold mb-4">Upload Excel File to Convert to PDF</h2>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleUpload}
              className="block mb-4"
            />
            {loading && <p className="text-blue-500">Processing, please wait...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}