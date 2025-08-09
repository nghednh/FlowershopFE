import React from 'react';
import { Button } from '../Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ total, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
  <div className="w-full flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-2">
  <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex-grow min-w-[40px] p-3 rounded-xl transition-all duration-300 ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:text-pink-600 hover:scale-110'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mx-auto" />
          </button>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={index} className="px-3 py-2 text-gray-400">
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`flex-grow min-w-[40px] px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isCurrentPage
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-110 border-2 border-pink-300'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:text-pink-600 hover:scale-105'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex-grow min-w-[40px] p-3 rounded-xl transition-all duration-300 ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:text-pink-600 hover:scale-110'
            }`}
          >
            <ChevronRight className="w-4 h-4 mx-auto" />
          </button>
        </div>

        {/* Page Info */}
        <div className="text-center mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium text-pink-600">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-medium text-pink-600">
              {Math.min(currentPage * pageSize, total)}
            </span> of{' '}
            <span className="font-medium text-pink-600">{total}</span> beautiful flowers
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
