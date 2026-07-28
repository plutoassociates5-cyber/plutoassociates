export default function EditorToolbar({ onCmd }) {
  return (
    <div className="editor-toolbar-wrap">
      <div className="toolbar-row">
        <select
          className="tb-select"
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
        <div className="tb-sep" />
        <select
          className="tb-select"
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
          className="tb-select"
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
        <div className="tb-sep" />
        <button className="tb" onClick={() => onCmd('bold')} title="Bold (Ctrl+B)"><b>B</b></button>
        <button className="tb" onClick={() => onCmd('italic')} title="Italic (Ctrl+I)"><i>I</i></button>
        <button className="tb" onClick={() => onCmd('underline')} title="Underline (Ctrl+U)"><u>U</u></button>
        <button className="tb" onClick={() => onCmd('strikeThrough')} title="Strikethrough"><s>S</s></button>
        <button className="tb" onClick={() => onCmd('subscript')} title="Subscript" style={{ fontSize: '0.65rem' }}>X₂</button>
        <button className="tb" onClick={() => onCmd('superscript')} title="Superscript" style={{ fontSize: '0.65rem' }}>X²</button>
        <div className="tb-sep" />
        <div className="tb-color-wrap" title="Text Color">
          <span className="tb-color-label" style={{ marginRight: 2 }}>A</span>
          <input type="color" className="tb-color" defaultValue="#000000" onChange={(e) => onCmd('foreColor', e.target.value)} title="Text Color" />
        </div>
        <div className="tb-color-wrap" title="Highlight">
          <span className="tb-color-label" style={{ marginRight: 2 }}>HL</span>
          <input type="color" className="tb-color" defaultValue="#ffff00" onChange={(e) => onCmd('hiliteColor', e.target.value)} title="Highlight Color" />
        </div>
      </div>
      <div className="toolbar-row">
        <button className="tb" onClick={() => onCmd('justifyLeft')} title="Align Left">⬅</button>
        <button className="tb" onClick={() => onCmd('justifyCenter')} title="Align Center">⬌</button>
        <button className="tb" onClick={() => onCmd('justifyRight')} title="Align Right">➡</button>
        <button className="tb" onClick={() => onCmd('justifyFull')} title="Justify">☰</button>
        <div className="tb-sep" />
        <button className="tb" onClick={() => onCmd('insertUnorderedList')} title="Bullet List">•≡</button>
        <button className="tb" onClick={() => onCmd('insertOrderedList')} title="Numbered List">1≡</button>
        <button className="tb" onClick={() => onCmd('indent')} title="Indent">→|</button>
        <button className="tb" onClick={() => onCmd('outdent')} title="Outdent">|←</button>
        <div className="tb-sep" />
        <button className="tb" onClick={() => onCmd('formatBlock', 'blockquote')} title="Blockquote">❝</button>
        <button className="tb" onClick={() => onCmd('insertHorizontalRule')} title="Horizontal Line">—</button>
        <button className="tb tb-wide" onClick={insertLink}>🔗 Link</button>
        <button className="tb tb-wide" onClick={() => onCmd('unlink')}>🔗✕</button>
        <button className="tb tb-wide" onClick={insertImage}>🖼 Image</button>
        <button className="tb tb-wide" onClick={insertTable}>⊞ Table</button>
        <div className="tb-sep" />
        <button className="tb" onClick={() => onCmd('undo')} title="Undo (Ctrl+Z)">↩</button>
        <button className="tb" onClick={() => onCmd('redo')} title="Redo (Ctrl+Y)">↪</button>
        <button className="tb" onClick={() => onCmd('removeFormat')} title="Clear Formatting">✕</button>
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

function insertImage() {
  const url = prompt('Enter image URL:', 'https://');
  if (!url) return;
  const alt = prompt('Alt text (for SEO):', '') || '';
  const cap = prompt('Caption (optional):', '') || '';
  let html = `<img src="${url}" alt="${alt}" style="max-width:100%;height:auto;margin:1rem 0">`;
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