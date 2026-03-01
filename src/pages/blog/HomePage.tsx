import { useState, useRef, useCallback } from 'react';
import { Pagination, Empty, Skeleton } from 'antd';
import { CalendarOutlined, FolderOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { fromNow } from '@/utils/date';

const PAGE_SIZE = 10;

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>();
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { posts, loading: postsLoading, refetch } = usePosts({
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: search || undefined,
    category_id: activeCategoryId,
  });
  const { categories, loading: catsLoading } = useCategories();

  const handleSearch = useCallback((value: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
      refetch({ skip: 0, limit: PAGE_SIZE, search: value || undefined, category_id: activeCategoryId });
    }, 300);
  }, [activeCategoryId, refetch]);

  const handleCategoryClick = (categoryId?: number) => {
    setActiveCategoryId(categoryId);
    setPage(1);
    refetch({ skip: 0, limit: PAGE_SIZE, search: search || undefined, category_id: categoryId });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    refetch({ skip: (p - 1) * PAGE_SIZE, limit: PAGE_SIZE, search: search || undefined, category_id: activeCategoryId });
  };

  const hasMore = posts.length === PAGE_SIZE;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 drop-shadow-sm decoration-clone">
          探索博客
        </h1>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchOutlined className="text-slate-400 text-lg" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-xl"
            placeholder="搜索你感兴趣的文章..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Horizontal Pills */}
      <div className="mb-12">
        {catsLoading ? (
          <Skeleton active paragraph={{ rows: 1 }} />
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleCategoryClick(undefined)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${!activeCategoryId
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-slate-800/30 text-slate-300 border-slate-700/50 hover:bg-slate-700/50 hover:text-white'
                }`}
            >
              全部文章
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${activeCategoryId === cat.id
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                  : 'bg-slate-800/30 text-slate-300 border-slate-700/50 hover:bg-slate-700/50 hover:text-white'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div>
        {postsLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/20 backdrop-blur-lg border border-slate-700/30 rounded-2xl p-6">
                <Skeleton active />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-slate-800/20 backdrop-blur-lg border border-slate-700/30 rounded-2xl shadow-xl">
            <Empty description={<span className="text-slate-400">找不到相关文章</span>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="group relative bg-slate-800/30 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-6 md:p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.4)] hover:bg-slate-800/50 hover:border-indigo-500/50"
              >
                {/* Background Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <h2 className="relative text-2xl font-bold text-slate-100 mb-4 group-hover:text-indigo-300 transition-colors">
                  {post.title}
                </h2>

                <p className="relative text-slate-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-3">
                  {post.content}
                </p>

                <div className="relative flex items-center justify-between mt-auto">
                  {post.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600/50 text-xs font-medium text-slate-300 backdrop-blur-sm">
                      <FolderOutlined />
                      {post.category.name}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <CalendarOutlined />
                    {fromNow(post.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!postsLoading && posts.length > 0 && (
        <div className="mt-16 flex justify-center">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={hasMore ? page * PAGE_SIZE + 1 : page * PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
