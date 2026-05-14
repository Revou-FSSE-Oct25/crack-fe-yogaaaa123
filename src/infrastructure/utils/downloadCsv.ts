// ---
// CSV Download Utility
// Downloads CSV file from BE endpoint with export=csv query param
// ---

export async function downloadCsv(url: string, filename: string): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    const response = await fetch(`${baseUrl}${url}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('CSV download error:', error);
    throw error;
  }
}
