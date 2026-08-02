export default function EditorToolbar({ onCmd }) {
  const triggerImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const f = input.files && input.files[0];
      if (!f) return;
      if (f.size > 8 * 1024 * 1024) { alert('Image must be under 8MB.'); return; }
      const reader = new FileReader();
      reader.onload = () => insertImage(reader.result);
      reader.readAsDataURL(f);
    };
    input.click();
  };

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-px px-2 py-1.5 border-b border-wp-border flex-wrap">
        <select
          className="px-1.5 py-0.5 border border-wp-border font-sans text-[0.72rem] outline-none cursor-pointer bg-white h-7 focus:border-wp-blue"
          onChange={(e) => { onCmd('formatBlock', e.target.value); e.target.value = ''; }}
        >
          <option value="">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="p">Paragraph</option>
          <option value="pre">Preformatted</option>
        </select>
        <div className="w-px h-5 bg-wp-border mx-1 shrink-0" />
        <select
          className="px-1.5 py-0.5 border border-wp-border font-sans text-[0.72rem] outline-none cursor-pointer bg-white h-7 focus:border-wp-blue"
          style={{ width: 90 }}
          onChange={(e) => { onCmd('fontName', e.target.value); e.target.selectedIndex = 0; }}
        >
          <option value="">Font</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>
        <select
          className="px-1.5 py-0.5 border border-wp-border font-sans text-[0.72rem] outline-none cursor-pointer bg-white h-7 focus:border-wp-blue"
          style={{ width: 70 }}
          onChange={(e) => { onCmd('fontSize', e.target.value); e.target.selectedIndex = 0; }}
        >
          <option value="">Size</option>
          <option value="1">8pt</option>
          <option value="2">10pt</option>
          <option value="3">12pt</option>
          <option value="4">14pt</option>
          <option value="5">18pt</option>
          <option value="6">24pt</option>
          <option value="7">36pt</option>
        </select>
        <div className="w-px h-5 bg-wp-border mx-1 shrink-0" />
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('bold')} title="Bold (Ctrl+B)"><b>B</b></button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('italic')} title="Italic (Ctrl+I)"><i>I</i></button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('underline')} title="Underline (Ctrl+U)"><u>U</u></button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('strikeThrough')} title="Strikethrough"><s>S</s></button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('subscript')} title="Subscript" style={{ fontSize: '0.65rem' }}>X₂</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('superscript')} title="Superscript" style={{ fontSize: '0.65rem' }}>X²</button>
        <div className="w-px h-5 bg-wp-border mx-1 shrink-0" />
        <div className="" title="Text Color">
          <span style={{ marginRight: 2 }}>A</span>
          <input type="color" className="" defaultValue="#000000" onChange={(e) => onCmd('foreColor', e.target.value)} title="Text Color" />
        </div>
        <div className="" title="Highlight">
          <span style={{ marginRight: 2 }}>HL</span>
          <input type="color" className="" defaultValue="#ffff00" onChange={(e) => onCmd('hiliteColor', e.target.value)} title="Highlight Color" />
        </div>
      </div>
      <div className="flex items-center gap-px px-2 py-1.5 border-b border-wp-border flex-wrap">
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('justifyLeft')} title="Align Left">⬅</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('justifyCenter')} title="Align Center">⬌</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('justifyRight')} title="Align Right">➡</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('justifyFull')} title="Justify">☰</button>
        <div className="w-px h-5 bg-wp-border mx-1 shrink-0" />
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('insertUnorderedList')} title="Bullet List">•≡</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('insertOrderedList')} title="Numbered List">1≡</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('indent')} title="Indent">→|</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('outdent')} title="Outdent">|←</button>
        <div className="w-px h-5 bg-wp-border mx-1 shrink-0" />
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('formatBlock', 'blockquote')} title="Blockquote">❝</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('insertHorizontalRule')} title="Horizontal Line">—</button>
        <button className="w-auto px-2 text-[0.72rem] whitespace-nowrap h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={insertLink}>🔗 Link</button>
        <button className="w-auto px-2 text-[0.72rem] whitespace-nowrap h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('unlink')}>🔗✕</button>
        <button className="w-auto px-2 text-[0.72rem] whitespace-nowrap h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={triggerImage}>🖼 Image</button>
        <button className="w-auto px-2 text-[0.72rem] whitespace-nowrap h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={insertTable}>⊞ Table</button>
        <div className="w-px h-5 bg-wp-border mx-1 shrink-0" />
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('undo')} title="Undo (Ctrl+Z)">↩</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('redo')} title="Redo (Ctrl+Y)">↪</button>
        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent cursor-pointer text-sm text-[#444] transition-all duration-100 rounded hover:bg-wp-gray hover:border-wp-border hover:text-black" onClick={() => onCmd('removeFormat')} title="Clear Formatting">✕</button>
      </div>
    </div>
  );
}

function insertLink() {
  const url = prompt('Enter URL:', 'https://');
  if (!url) return;
  const sel = window.getSelection().toString();
  if (sel) {
    document.execCommand('createLink', false, url);
  } else {
    const txt = prompt('Link text:', url) || url;
    document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${txt}</a>`);
  }
}

function insertImage(src) {
  if (!src) {
    const u = prompt('Enter image URL:', 'https://');
    if (!u) return;
    src = u;
  }
  const alt = prompt('Alt text (for SEO):', '') || '';
  const cap = prompt('Caption (optional):', '') || '';
  let html = `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;margin:1rem 0">`;
  if (cap) html += `<span class="wp-caption">${cap}</span>`;
  document.execCommand('insertHTML', false, html);
}

function insertTable() {
  const rows = parseInt(prompt('Number of rows:', '3')) || 3;
  const cols = parseInt(prompt('Number of columns:', '3')) || 3;
  let html = '<table><thead><tr>';
  for (let c = 0; c < cols; c++) html += '<th>Header ' + (c + 1) + '</th>';
  html += '</tr></thead><tbody>';
  for (let r = 0; r < rows - 1; r++) {
    html += '<tr>';
    for (let cc = 0; cc < cols; cc++) html += '<td>Cell</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  document.execCommand('insertHTML', false, html);
}
