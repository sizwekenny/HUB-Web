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

  // Attachment detection
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
