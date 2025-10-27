import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'

interface PaginationProps {
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({ total, page, limit, onPageChange, className = '' }) => {
  const pageCount = Math.max(1, Math.ceil(total / limit))

  const start = Math.max(1, page - 2)
  const end = Math.min(pageCount, page + 2)

  const pages = [] as number[]
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Pagination">
      <button
        className="px-3 py-1 rounded-md border disabled:opacity-50 flex items-center justify-center"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <IoIosArrowForward className="rotate-180" size={18} />
      </button>

      {pages[0] > 1 && (
        <button className="px-3 py-1 rounded-md border" onClick={() => onPageChange(1)}>1</button>
      )}

      {start > 2 && <span className="px-2">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-md border ${p === page ? 'bg-primary text-white' : ''}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {end < pageCount - 1 && <span className="px-2">…</span>}

      {pages[pages.length - 1] < pageCount && (
        <button className="px-3 py-1 rounded-md border" onClick={() => onPageChange(pageCount)}>{pageCount}</button>
      )}

      <button
        className="px-3 py-1 rounded-md border disabled:opacity-50 flex items-center justify-center"
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        <IoIosArrowForward size={18} />
      </button>
    </nav>
  )
}

export default Pagination