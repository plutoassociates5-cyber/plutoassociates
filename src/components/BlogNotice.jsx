import { getArticles } from '../utils/storage';

/**
 * Blog & Publications page in the admin panel.
 *
 * Blog posts are authored in WordPress and pulled into the site at build
 * time (see WORDPRESS-BLOG.md). This page replaces the old localStorage
 * article editor: it explains where writing happens now and shows a
 * read-only view of the posts the last sync brought in.
 */
export default function BlogNotice() {
  const articles = getArticles()
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const published = articles.filter((a) => a.status === 'published').length;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Blog &amp; Publications</h1>
        <a
          href="https://wordpress.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87] no-underline"
        >
          Open WordPress →
        </a>
      </div>

      <div className="bg-white border-l-4 border-l-wp-blue shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 mb-6">
        <p className="text-sm text-[#1d2327] font-semibold mb-1.5">Articles are now written in WordPress</p>
        <p className="text-xs text-text-body leading-relaxed mb-3">
          Blog posts are created and edited at <strong>wordpress.com → Posts</strong>. Every time the website
          is built, the latest published posts are pulled in automatically and appear at{' '}
          <strong>/publications</strong> with the site's own design. Edits made here in the past lived only in
          this browser and never reached the live site — WordPress fixes that.
        </p>
        <p className="text-xs text-text-body leading-relaxed">
          After publishing in WordPress, the site updates within a few minutes
          (or instantly if you trigger a rebuild from the Cloudflare dashboard). See{' '}
          <code className="bg-wp-gray px-1 py-0.5">WORDPRESS-BLOG.md</code> in the project for the full setup guide.
        </p>
      </div>

      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-x-auto">
        <div className="px-4 py-3 border-b border-wp-border font-semibold text-[#1d2327] text-sm">
          Last synced from WordPress — {articles.length} post{articles.length === 1 ? '' : 's'}, {published} published
        </div>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Title</th>
              <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Status</th>
              <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Date</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-light-gray">
                <td className="px-4 py-3">
                  {a.status === 'published' ? (
                    <a
                      href={`/publications/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-sm text-wp-blue no-underline hover:underline"
                    >
                      {a.title || '(no title)'}
                    </a>
                  ) : (
                    <span className="font-semibold text-sm text-[#1d2327]">{a.title || '(no title)'}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 text-[0.65rem] font-bold rounded ${a.status === 'published' ? 'bg-green-50 text-accent-green' : 'bg-blue-50 text-blue-600'}`}>
                    {a.status || 'draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-light">{formatDate(a.date)}</td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-10 text-center text-text-light">
                  No posts synced yet. Run the WordPress import (see WORDPRESS-BLOG.md).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
