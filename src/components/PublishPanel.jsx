export default function PublishPanel({ article, onSave }) {
  const formatDate = (d) => {
    if (!d) return 'Immediately';
    return new Date(d).toLocaleDateString();
  };

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center cursor-pointer">
        <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>📤</span> Publish</h3>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center py-1.5 border-b border-light-gray text-xs last:border-none">
          <span className="text-text-light">Status</span>
          <span className="text-[#1d2327] font-medium flex items-center gap-1.5" id="statusDisplay">{article?.status || 'Draft'}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 border-b border-light-gray text-xs last:border-none">
          <span className="text-text-light">Visibility</span>
          <span className="text-[#1d2327] font-medium flex items-center gap-1.5">Public</span>
        </div>
        <div className="flex justify-between items-center py-1.5 border-b border-light-gray text-xs last:border-none">
          <span className="text-text-light">Published</span>
          <span className="text-[#1d2327] font-medium flex items-center gap-1.5">{formatDate(article?.date)}</span>
        </div>
        {article?.modifiedAt && (
          <div className="flex justify-between items-center py-1.5 border-b border-light-gray text-xs last:border-none">
            <span className="text-text-light">Last Modified</span>
            <span className="text-[#1d2327] font-medium flex items-center gap-1.5">{formatDate(article.modifiedAt)}</span>
          </div>
        )}
        <div className="mt-4 flex gap-2 flex-col">
          <button className="bg-wp-blue text-white border-none py-2.5 px-4 font-sans text-xs font-semibold cursor-pointer w-full hover:bg-[#005a87]" onClick={() => onSave('published')}>✓ Publish</button>
          <button className="bg-white text-[#333] border border-wp-border py-2 px-4 font-sans text-xs cursor-pointer w-full hover:bg-wp-gray" onClick={() => onSave('draft')}>Save Draft</button>
          <button className="bg-white text-[#333] border border-wp-border py-2 px-4 font-sans text-xs cursor-pointer w-full hover:bg-wp-gray" onClick={() => onSave('preview')}>Preview</button>
        </div>
      </div>
    </div>
  );
}
