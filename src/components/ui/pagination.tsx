import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import { Button } from './button'

interface PaginationProps {
  totalItems: number
  itemsPerPage?: number
  currentPage: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export function Pagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first page
    const firstPage = 1
    // Always show last page
    const lastPage = totalPages
    
    // Calculate range of pages to show around current page
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    // Determine if we need to show ellipses
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1

    // Generate the array of page numbers to display
    const pageNumbers = []

    if (shouldShowLeftDots) {
      pageNumbers.push(1)
      pageNumbers.push('leftDots')
    }

    // Add all page numbers in the middle range
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i)
    }

    if (shouldShowRightDots) {
      pageNumbers.push('rightDots')
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pages = generatePagination()

  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      
      {pages.map((page, index) => {
        if (page === 'leftDots' || page === 'rightDots') {
          return (
            <Button
              key={`dots-${index}`}
              variant="ghost"
              size="icon"
              disabled
              className="cursor-default"
            >
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          )
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </nav>
  )
}
