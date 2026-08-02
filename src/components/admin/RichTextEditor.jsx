/**
 * Reusable visual rich-text editor for the Pluto Associates CMS.
 *
 * Supports headings, paragraphs, alignment, lists, blockquote, code block,
 * tables, links, colours, highlight, font size, undo/redo, image upload
 * (drag & drop) and YouTube embeds — with Visual / HTML / Preview modes.
 *
 * Controlled via `value` (HTML string) + `onChange`. Autosave is left to the
 * parent (pass `onAutosave` to be notified whenever the parent drafting timer
 * fires, for the UI hint).
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { readFileAsDataUrl, resizeDataUrl, isSvg } from '../../utils/image';
import { getSettings } from '../../utils/contentStore';

const GROUPS = {
  '': 'Paragraph',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
};

export default function RichTextEditor({ value, onChange, minHeight = 360 }) {
  const rootRef = useRef(null);
  const sourceRef = useRef(null);
  const fileRef = useRef(null);
  const site = getSettings();

  const [mode, setMode] = useState('visual'); // 'visual' | 'html' | 'preview'
  const [dirty, setDirty] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (el && el.innerHTML !== (value || '')) el.innerHTML = value || '';
  }, [mode]); // sync content-ref from source/preview when switching back to visual

  const emit = () => {
    const html = rootRef.current?.innerHTML || '';
    onChange(html);
    setDirty((d) => d + 1);
  };

  const execCmd = (cmd, val) => {
    rootRef.current?.focus();
    if (cmd === 'formatBlock' && val && val.charAt(0) !== '<') val = '<' + val + '>';
    document.execCommand(cmd, false, val || null);
    emit();
  };

  const insertHtml = (html) => {
    document.execCommand('insertHTML', false, html);
    emit();
  };

  const openSource = () => {
    if (sourceRef.current) sourceRef.current.value = rootRef.current?.innerHTML || '';
    setMode('html');
  };
  const toVisual = () => {
    if (rootRef.current && sourceRef.current) rootRef.current.innerHTML = sourceRef.current.value || '';
    setMode('visual');
  };

  const addTable = () => {
    const rows = parseInt(prompt('Number of rows:', '3')) || 3;
    const cols = parseInt(prompt('Number of columns:', '3')) || 3;
    let html = '<table><thead><tr>';
    for (let c = 0; c < cols; c++) html += `<th>Header ${c + 1}</th>`;
    html += '</tr></thead><tbody>';
    for (let r = 0; r < rows - 1; r++) {
      html += '<tr>';
      for (let cc = 0; cc < cols; cc++) html += '<td>Cell</td>';
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    insertHtml(html);
  };

  const addLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (!url) return;
    const sel = window.getSelection().toString();
    if (sel) document.execCommand('createLink', false, url);
    else insertHtml(`<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
    emit();
  };

  const addEmbed = () => {
    const url = prompt('YouTube video URL:', 'https://www.youtube.com/watch?v=');
    if (!url) return;
    const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/);
    if (!m) { alert('Please enter a valid YouTube URL.'); return; }
    insertHtml(
      `<div class="rich-video" style="position:relative;padding-top:56.25%;margin:1rem 0"><iframe src="https://www.youtube.com/embed/${m[1]}" style="position:absolute;inset:0;width:100%;height:100%;border:none" allowfullscreen title="YouTube video"></iframe></div>`
    );
  };

  const addImageUrl = () => {
    const url = prompt('Image URL:', 'https://');
    if (!url) return;
    insertHtml(`<div style="margin:1rem 0"><img src="${url}" alt="" style="max-width:100%;height:auto"></div>`);
  };

  const onFiles = async (files) => {
    for (const f of Array.from(files || [])) {
      if (!f.type.startsWith('image/')) continue;
      const dataUrl = await readFileAsDataUrl(f);
      let src = dataUrl;
      if (!isSvg(dataUrl)) {
        try {
          const r = await resizeDataUrl(dataUrl, { maxWidth: site?.imgMaxWidth || 1600, quality: (site?.imgQuality ?? 85) / 100 });
          src = r.dataUrl;
        } catch { /* keep original */ }
      }
      insertHtml(`<div style="margin:.75rem 0"><img src="${src}" alt="" style="max-width:100%;height:auto"></div>`);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  };

  const keydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault();
  };

  const tb = 'w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] rounded hover:bg-wp-gray hover:border-wp-border';
  const tbWide = 'px-2 text-[0.7rem] whitespace-nowrap h-7 flex items-center gap-1 bg-transparent border border-transparent cursor-pointer text-[#444] rounded hover:bg-wp-gray hover:border-wp-border';

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="border-b border-wp-border">
        <div className="flex items-center gap-1 px-2 py-1.5 flex-wrap">
          <select className="px-1.5 py-0.5 border border-wp-border text-[0.72rem] outline-none cursor-pointer bg-white h-7" defaultValue="" onChange={(e) => { execCmd('formatBlock', e.target.value); e.target.value = ''; }}>
            <option value="">Block</option>
            {Object.entries(GROUPS).map(([k, v]) => <option key={k || 'p'} value={k || 'p'}>{v}</option>)}
          </select>
          <span className="w-px h-5 bg-wp-border mx-1" />
          <button className={tb} onClick={() => execCmd('bold')} title="Bold (Ctrl+B)"><b>B</b></button>
          <button className={tb} onClick={() => execCmd('italic')} title="Italic (Ctrl+I)"><i>I</i></button>
          <button className={tb} onClick={() => execCmd('underline')} title="Underline"><u>U</u></button>
          <button className={tb} onClick={() => execCmd('strikeThrough')} title="Strikethrough"><s>S</s></button>
          <select className="border border-wp-border text-[0.72rem] outline-none cursor-pointer bg-white h-7 px-1" defaultValue="" onChange={(e) => { execCmd('fontName', e.target.value); e.target.value = ''; }}>
            <option value="">Font</option>
            <option value="Georgia">Georgia</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times</option>
            <option value="Courier New">Courier</option>
          </select>
          <select className="border border-wp-border text-[0.72rem] outline-none cursor-pointer bg-white h-7 px-1" defaultValue="" onChange={(e) => { execCmd('fontSize', e.target.value); e.target.value = ''; }}>
            <option value="">Size</option>
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
          <input type="color" defaultValue="#000000" className="w-6 h-7 border-none bg-transparent cursor-pointer" onChange={(e) => execCmd('foreColor', e.target.value)} title="Text color" />
          <input type="color" defaultValue="#fff9c4" className="w-6 h-7 border-none bg-transparent cursor-pointer" onChange={(e) => execCmd('hiliteColor', e.target.value)} title="Highlight" />
          <span className="w-px h-5 bg-wp-border mx-1" />
          <button className={tb} onClick={() => execCmd('justifyLeft')} title="Align left">⇤</button>
          <button className={tb} onClick={() => execCmd('justifyCenter')} title="Align center">⇔</button>
          <button className={tb} onClick={() => execCmd('justifyRight')} title="Align right">⇥</button>
          <button className={tb} onClick={() => execCmd('justifyFull')} title="Justify">☰</button>
          <span className="w-px h-5 bg-wp-border mx-1" />
          <button className={tb} onClick={() => execCmd('insertUnorderedList')} title="Bullet list">•≡</button>
          <button className={tb} onClick={() => execCmd('insertOrderedList')} title="Numbered list">1≡</button>
          <button className={tb} onClick={() => execCmd('formatBlock', 'blockquote')} title="Quote">❝</button>
          <button className={tb} onClick={() => execCmd('formatBlock', 'pre')} title="Code block">{'</>'}</button>
          <span className="w-px h-5 bg-wp-border mx-1" />
          <button className={tb} onClick={() => execCmd('undo')} title="Undo">↩</button>
          <button className={tb} onClick={() => execCmd('redo')} title="Redo">↪</button>
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 flex-wrap border-t border-wp-border">
          <button className={tbWide} onClick={() => { const f = fileRef.current; if (f) f.click(); }}>🖼 Image</button>
          <button className={tbWide} onClick={addImageUrl}>URL</button>
          <button className={tbWide} onClick={addEmbed}>▶ YouTube</button>
          <button className={tbWide} onClick={addTable}>⊞ Table</button>
          <button className={tbWide} onClick={addLink}>🔗 Link</button>
          <button className={tbWide} onClick={() => execCmd('unlink')}>🔗✕</button>
        </div>
      </div>

      <div className="flex border-b border-wp-border bg-wp-gray/40">
        {[['visual', 'Visual'], ['html', 'HTML'], ['preview', 'Preview']].map(([k, label]) => (
          <button
            key={k}
            className={`px-4 py-2 text-xs font-semibold cursor-pointer border-b-2 mb-[-1px] ${mode === k ? 'text-[#1d2327] border-b-[#1d2327] bg-white' : 'text-text-light border-transparent bg-transparent'}`}
            onClick={() => {
              if (k === 'html') openSource();
              else if (k === 'visual') toVisual();
              else setMode('preview');
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'visual' && (
        <div
          ref={rootRef}
          className="min-h-[400px] p-5 font-['Georgia',serif] text-sm leading-relaxed text-text-dark outline-none focus:outline-none"
          style={{ minHeight }}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onKeyDown={keydown}
          onPaste={(e) => {
            const items = e.clipboardData?.items;
            const files = [];
            if (items) {
              for (const it of items) if (it.kind === 'file') files.push(it.getAsFile());
            }
            if (files.length) { e.preventDefault(); onFiles(files); }
          }}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        />
      )}

      {mode === 'html' && (
        <textarea
          ref={sourceRef}
          className="w-full p-4 font-mono text-xs resize-y outline-none leading-relaxed text-[#333] bg-gray-50"
          style={{ minHeight }}
          defaultValue={value}
          onKeyDown={keydown}
        />
      )}

      {mode === 'preview' && (
        <div className="min-h-[400px] p-6 bg-white" style={{ minHeight }}>
          <article className="prose-rich" dangerouslySetInnerHTML={{ __html: value || '<p>Nothing to preview yet.</p>' }} />
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }} />

      <div className="px-4 py-1.5 bg-wp-gray border-t border-wp-border text-[0.7rem] text-text-light flex justify-between flex-wrap gap-2">
        <span>{dirty ? 'Editing — auto-saved by parent' : 'Ready'} · drag & drop images</span>
        <span>Shortcuts: Ctrl+B / I / U · Ctrl+S to save</span>
      </div>
    </div>
  );
}