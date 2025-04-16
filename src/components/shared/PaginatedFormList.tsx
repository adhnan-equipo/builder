import React, { useState, useEffect } from 'react';
import { Pagination } from '../ui/pagination';

interface PaginatedFormListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemsPerPage?: number;
  className?: string;
}

export function PaginatedFormList<T>({
  items,
  renderItem,
  itemsPerPage = 10,
  className = '',
}: PaginatedFormListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<T[]>([]);

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Update paginated items when page changes or items change
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedItems(items.slice(startIndex, endIndex));
  }, [currentPage, items, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optionally scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {paginatedItems.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>
      
      {items.length > itemsPerPage && (
        <Pagination
          totalItems={items.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
