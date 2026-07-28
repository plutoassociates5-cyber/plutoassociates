import { useState } from 'react';

export default function FeaturedImagePanel({ image, onChange }) {
  const [url, setUrl] = useState(image || '');

  const handleClick = () => {
    const u = prompt('Enter image URL:', 'https://');
    if (u) {
      setUrl(u);
      onChange(u);
    }
  };

  const handleRemove = () => {
    setUrl('');
    onChange(null);
  };

  if (!url) {
    return (
      <div className="side-panel">
        <div className="side-panel-head">
          <h3><span className="ph-icon">🖼</span> Featured Image</h3>
        </div>
        <div className="side-panel-body">
          <div className="feat-img-placeholder" onClick={handleClick}>
            <div style={{ fontSize: '2rem' }}>🖼</div>
            <p>Click to enter image URL</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="side-panel">
      <div className="side-panel-head">
        <h3><span className="ph-icon">🖼</span> Featured Image</h3>
      </div>
      <div className="side-panel-body">
        <div className="feat-img-preview" style={{ display: 'block' }}>
          <img src={url} alt="Featured" />
        </div>
        <div className="feat-img-actions" style={{ display: 'flex' }}>
          <a onClick={handleClick}>Change image</a>
          <a className="remove-img" onClick={handleRemove}>Remove</a>
        </div>
      </div>
    </div>
  );
}