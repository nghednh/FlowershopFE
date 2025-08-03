import React from 'react';
import { Button } from '../Button';

interface Props {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ total, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4 space-x-2">
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <Button
            key={page}
            className={`px-3 py-1 border rounded ${
              page === currentPage ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}
    </div>
  );
};

export default Pagination;
