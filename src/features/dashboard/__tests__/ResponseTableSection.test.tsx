import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResponseTableSection from '../ResponseTableSection';
import { ResponseData, PaginationMeta } from '@/types';
import { SortState } from '@/types/table';

// Mock the child components
jest.mock('@/features/dashboard/ResponseTable', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockResponseTable({ items, sort, onSort }: any) {
    return (
      <div data-testid="response-table">
        <div data-testid="sort-key">{sort.key}</div>
        <div data-testid="sort-order">{sort.order}</div>
        <button onClick={() => onSort('timestamp')}>Sort by timestamp</button>
        {items.length === 0 ? (
          <div>No responses yet.</div>
        ) : (
          <div>
            {items.map((item: ResponseData) => (
              <div key={item._id} data-testid={`response-${item._id}`}>
                <span data-testid={`status-${item._id}`}>{item.response.status}</span>
                <span data-testid={`timestamp-${item._id}`}>{item.timestamp}</span>
                <span data-testid={`latency-${item._id}`}>{item.response.latency}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
});

jest.mock('@/@components/ui/Card', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>{children}</div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

jest.mock('@/@components/ui/Skeleton', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));

// Helper function to create mock response data
const createMockResponse = (overrides?: Partial<ResponseData>): ResponseData => ({
  _id: '123',
  timestamp: '2025-10-08T10:00:00Z',
  requestPayload: { url: 'https://example.com' },
  response: {
    status: 200,
    statusText: 'OK',
    headers: {},
    data: {},
    latency: 150,
  },
  createdAt: '2025-10-08T10:00:00Z',
  updatedAt: '2025-10-08T10:00:00Z',
  ...overrides,
});

const createMockMeta = (overrides?: Partial<PaginationMeta>): PaginationMeta => ({
  page: 1,
  pageSize: 10,
  totalPages: 5,
  totalItems: 50,
  ...overrides,
});

describe('ResponseTableSection - Unit Tests', () => {
  const mockOnSort = jest.fn();
  const mockOnPrev = jest.fn();
  const mockOnNext = jest.fn();

  const defaultSort: SortState = {
    key: 'timestamp',
    order: 'desc',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders table with response data correctly', () => {
      const mockItems = [
        createMockResponse({ _id: '1', response: { ...createMockResponse().response, status: 200 } }),
        createMockResponse({ _id: '2', response: { ...createMockResponse().response, status: 404 } }),
        createMockResponse({ _id: '3', response: { ...createMockResponse().response, status: 500 } }),
      ];
      const mockMeta = createMockMeta();

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Check that the table is rendered
      expect(screen.getByTestId('response-table')).toBeInTheDocument();
      
      // Check that all items are rendered
      expect(screen.getByTestId('response-1')).toBeInTheDocument();
      expect(screen.getByTestId('response-2')).toBeInTheDocument();
      expect(screen.getByTestId('response-3')).toBeInTheDocument();

      // Check pagination info
      expect(screen.getByText('Page 1 / 5')).toBeInTheDocument();
    });

    it('displays correct status badges (200, 404, 500)', () => {
      const mockItems = [
        createMockResponse({ _id: '1', response: { ...createMockResponse().response, status: 200 } }),
        createMockResponse({ _id: '2', response: { ...createMockResponse().response, status: 404 } }),
        createMockResponse({ _id: '3', response: { ...createMockResponse().response, status: 500 } }),
      ];
      const mockMeta = createMockMeta();

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Verify status codes are displayed
      expect(screen.getByTestId('status-1')).toHaveTextContent('200');
      expect(screen.getByTestId('status-2')).toHaveTextContent('404');
      expect(screen.getByTestId('status-3')).toHaveTextContent('500');
    });

    it('formats timestamps correctly', () => {
      const timestamp1 = '2025-10-08T10:30:00Z';
      const timestamp2 = '2025-10-08T14:45:00Z';
      
      const mockItems = [
        createMockResponse({ _id: '1', timestamp: timestamp1 }),
        createMockResponse({ _id: '2', timestamp: timestamp2 }),
      ];
      const mockMeta = createMockMeta();

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Verify timestamps are displayed
      expect(screen.getByTestId('timestamp-1')).toHaveTextContent(timestamp1);
      expect(screen.getByTestId('timestamp-2')).toHaveTextContent(timestamp2);
    });
  });

  describe('Loading State', () => {
    it('shows loading state while fetching', () => {
      render(
        <ResponseTableSection
          items={[]}
          meta={undefined}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
          isLoading={true}
        />
      );

      // Check that skeleton loaders are displayed
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
      
      // Check that the actual table is not rendered
      expect(screen.queryByTestId('response-table')).not.toBeInTheDocument();
    });

    it('does not show loading state when data is loaded', () => {
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta();

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
          isLoading={false}
        />
      );

      // Check that skeleton loaders are not displayed
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      
      // Check that the actual table is rendered
      expect(screen.getByTestId('response-table')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no data', () => {
      render(
        <ResponseTableSection
          items={[]}
          meta={createMockMeta({ totalItems: 0, totalPages: 0 })}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // The empty state is handled by the ResponseTable mock
      expect(screen.getByText('No responses yet.')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('renders pagination controls when meta is provided', () => {
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta({ page: 2, totalPages: 5 });

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      expect(screen.getByText('Page 2 / 5')).toBeInTheDocument();
    });

    it('disables Previous button on first page', () => {
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta({ page: 1, totalPages: 5 });

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button on last page', () => {
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta({ page: 5, totalPages: 5 });

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });

    it('calls onPrev when Previous button is clicked', async () => {
      const user = userEvent.setup();
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta({ page: 2, totalPages: 5 });

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      const prevButton = screen.getByLabelText('Previous page');
      await user.click(prevButton);

      expect(mockOnPrev).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when Next button is clicked', async () => {
      const user = userEvent.setup();
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta({ page: 2, totalPages: 5 });

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      await user.click(nextButton);

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('does not render pagination controls when meta is undefined', () => {
      const mockItems = [createMockResponse()];

      render(
        <ResponseTableSection
          items={mockItems}
          meta={undefined}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('passes sort state to ResponseTable', () => {
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta();
      const sortState: SortState = { key: 'status', order: 'asc' };

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={sortState}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByTestId('sort-key')).toHaveTextContent('status');
      expect(screen.getByTestId('sort-order')).toHaveTextContent('asc');
    });

    it('calls onSort when sort is triggered', async () => {
      const user = userEvent.setup();
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta();

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      const sortButton = screen.getByText('Sort by timestamp');
      await user.click(sortButton);

      expect(mockOnSort).toHaveBeenCalledWith('timestamp');
    });
  });

  describe('Edge Cases', () => {
    it('handles single page correctly', () => {
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta({ page: 1, totalPages: 1 });

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('renders correctly with large dataset', () => {
      const mockItems = Array.from({ length: 100 }, (_, i) =>
        createMockResponse({ _id: `${i}` })
      );
      const mockMeta = createMockMeta({ page: 5, totalPages: 10, totalItems: 100 });

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByTestId('response-table')).toBeInTheDocument();
      expect(screen.getByText('Page 5 / 10')).toBeInTheDocument();
    });

    it('handles missing optional props gracefully', () => {
      const mockItems = [createMockResponse()];
      const mockMeta = createMockMeta();

      render(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={defaultSort}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByTestId('response-table')).toBeInTheDocument();
    });
  });
});
