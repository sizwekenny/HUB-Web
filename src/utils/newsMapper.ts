import { NewsItem } from '../types';

// Heuristic mapping of backend news payload to frontend NewsItem
// Attempts to discover attachment/download info across various possible field names.
export function mapBackendNewsItem(raw: any, campus: NewsItem['campus']): NewsItem {
  const id = (raw?.newsId ?? raw?.id ?? Math.random().toString(36).slice(2)) + '';
  const title = raw?.newsTitle ?? raw?.title ?? '';
  const summary = raw?.newsDescription ?? raw?.description ?? raw?.summary ?? '';
  const content = raw?.newsDescription ?? raw?.description ?? raw?.content ?? summary;
  const category = raw?.category ?? 'Announcement';
  const priority = raw?.priority ?? 'medium';
  const date = raw?.createdAt ?? raw?.date ?? new Date().toISOString();
  const isUrgent = !!raw?.isUrgent;
  const isVisible = !!raw?.isVisible || raw?.isVisible === undefined; // default true if undefined
  const department = raw?.department || undefined;

  // Attachment detection (URL-based + raw binary via backend 'docFile')
  // Accept a wide range of possible field names.
  let rawFile: any = raw?.file || raw?.attachment || raw?.document || raw?.newsFile || raw?.uploadedFile;
  let rawUrl: string | null = null;
  if (typeof rawFile === 'string') rawUrl = rawFile;
  if (!rawUrl && rawFile && typeof rawFile === 'object') {
    rawUrl = rawFile.url || rawFile.path || rawFile.downloadUrl || null;
  }
  // Direct url-ish fields
  rawUrl = rawUrl || raw?.fileUrl || raw?.filePath || raw?.attachmentUrl || raw?.attachmentPath || raw?.documentUrl || raw?.downloadUrl || raw?.downloadLink || raw?.fileDownloadUrl || raw?.newsFileUrl || raw?.storagePath || null;

  const fileName = raw?.fileName || raw?.originalFileName || raw?.documentName || raw?.attachmentName || (rawUrl ? (rawUrl.split(/[/\\]/).pop() || '') : '');
  const ext = fileName ? (fileName.split('.').pop() || '').toLowerCase() : undefined;
  const size = raw?.fileSize || raw?.documentSize || raw?.attachmentSize;

  let downloadFile: NewsItem['downloadFile'] | undefined;
  if (rawUrl && fileName) {
    const normalizedUrl = (rawUrl.startsWith('http') || rawUrl.startsWith('/')) ? rawUrl : `/${rawUrl}`;
    downloadFile = {
      filename: fileName,
      url: normalizedUrl,
      type: (['pdf','png','jpg','jpeg','docx','xlsx'].includes(ext || '') ? ext : 'pdf') as any,
      size
    };
  } else if (raw?.docFile) {
    // docFile can be:
    // 1) Base64 string
    // 2) Array (byte values)
    // 3) Object with data / base64 / bytes property
    try {
      let bytes: Uint8Array | null = null;
      if (typeof raw.docFile === 'string') {
        // Strip possible data URL prefix
        const b64 = raw.docFile.split(',').pop()!.trim();
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
        bytes = arr;
      } else if (Array.isArray(raw.docFile)) {
        bytes = new Uint8Array(raw.docFile);
      } else if (raw.docFile && typeof raw.docFile === 'object') {
        const candidate = raw.docFile.data || raw.docFile.base64 || raw.docFile.bytes;
        if (typeof candidate === 'string') {
          const b64 = candidate.split(',').pop()!.trim();
          const bin = atob(b64);
          const arr = new Uint8Array(bin.length);
          for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
          bytes = arr;
        } else if (Array.isArray(candidate)) {
          bytes = new Uint8Array(candidate);
        }
      }
      if (bytes) {
        const mimeMap: Record<string,string> = { pdf:'application/pdf', png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
        const mime = mimeMap[ext || 'pdf'] || 'application/octet-stream';
  // Ensure we pass a regular ArrayBuffer to Blob (avoid SAB typing edge cases)
  const safeBytes = bytes instanceof Uint8Array ? new Uint8Array(bytes) : new Uint8Array(bytes as any);
  const blob = new Blob([safeBytes.buffer], { type: mime });
        const url = URL.createObjectURL(blob);
        downloadFile = {
          filename: fileName || `document.${ext || 'pdf'}`,
          url,
          type: (['pdf','png','jpg','jpeg','docx','xlsx'].includes(ext || '') ? ext : 'pdf') as any,
          size: `${(blob.size/1024).toFixed(1)} KB`
        };
      }
    } catch {
      // swallow mapping errors; proceed without attachment
    }
  }

  return {
    id,
    title,
    summary,
    content,
    category,
    priority,
    campus,
    department,
    date,
    isUrgent,
    isVisible,
    downloadFile
  };
}

export function mapBackendNewsArray(data: any[], campus: NewsItem['campus']): NewsItem[] {
  return (data || []).map(d => mapBackendNewsItem(d, campus))
    .filter(n => n.title.trim() && n.isVisible)
    .sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
}
