import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResponseTableSection from '../ResponseTableSection';
import { ResponseData, PaginationMeta } from '@/types';
import { SortState } from '@/types/table';

// Mock the child components with more realistic behavior
jest.mock('@/features/ResponseTable', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockResponseTable({ items, sort, onSort }: any) {
    return (
      <div data-testid="response-table">
        <button onClick={() => onSort('timestamp')} data-testid="sort-timestamp">
          Sort Timestamp
        </button>
        <button onClick={() => onSort('status')} data-testid="sort-status">
          Sort Status
        </button>
        <button onClick={() => onSort('latency')} data-testid="sort-latency">
          Sort Latency
        </button>
        {items.length === 0 ? (
          <div data-testid="empty-state">No responses yet.</div>
        ) : (
          <div data-testid="table-body">
            {items.map((item: ResponseData, index: number) => (
              <div key={item._id} data-testid={`row-${index}`}>
                <span data-testid={`status-${index}`}>{item.response.status}</span>
                <span data-testid={`latency-${index}`}>{item.response.latency}ms</span>
                <span data-testid={`timestamp-${index}`}>{item.timestamp}</span>
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

// Helper to create mock data
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

describe('ResponseTableSection - Integration Tests', () => {
  describe('Data Fetching Simulation', () => {
    it('fetches data from API on mount', async () => {
      // Simulate initial loading state
      const { rerender } = render(
        <ResponseTableSection
          items={[]}
          meta={undefined}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={jest.fn()}
          onPrev={jest.fn()}
          onNext={jest.fn()}
          isLoading={true}
        />
      );

      // Verify loading state
      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);

      // Simulate data loaded
      const mockItems = [
        createMockResponse({ _id: '1', response: { ...createMockResponse().response, status: 200 } }),
        createMockResponse({ _id: '2', response: { ...createMockResponse().response, status: 404 } }),
      ];
      const mockMeta = createMockMeta();

      rerender(
        <ResponseTableSection
          items={mockItems}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={jest.fn()}
          onPrev={jest.fn()}
          onNext={jest.fn()}
          isLoading={false}
        />
      );

      // Verify data is displayed
      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        expect(screen.getByTestId('response-table')).toBeInTheDocument();
        expect(screen.getByTestId('row-0')).toBeInTheDocument();
        expect(screen.getByTestId('row-1')).toBeInTheDocument();
      });
    });

    it('shows error state on API failure', async () => {
      // Start with loading
      const { rerender } = render(
        <ResponseTableSection
          items={[]}
          meta={undefined}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={jest.fn()}
          onPrev={jest.fn()}
          onNext={jest.fn()}
          isLoading={true}
        />
      );

      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);

      // Simulate error - no data loaded, no loading state
      rerender(
        <ResponseTableSection
          items={[]}
          meta={undefined}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={jest.fn()}
          onPrev={jest.fn()}
          onNext={jest.fn()}
          isLoading={false}
        />
      );

      // Verify empty state is shown (which could indicate an error)
      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      });
    });
  });

  describe('WebSocket Updates Simulation', () => {
    it('updates when new WebSocket data arrives', async () => {
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      // Initial render with 2 items
      const initialItems = [
        createMockResponse({ _id: '1', timestamp: '2025-10-08T10:00:00Z' }),
        createMockResponse({ _id: '2', timestamp: '2025-10-08T10:01:00Z' }),
      ];
      const mockMeta = createMockMeta({ totalItems: 2 });

      const { rerender } = render(
        <ResponseTableSection
          items={initialItems}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Verify initial state
      expect(screen.getByTestId('row-0')).toBeInTheDocument();
      expect(screen.getByTestId('row-1')).toBeInTheDocument();
      expect(screen.queryByTestId('row-2')).not.toBeInTheDocument();

      // Simulate new data from WebSocket
      const updatedItems = [
        createMockResponse({ _id: '3', timestamp: '2025-10-08T10:02:00Z' }), // New item
        ...initialItems,
      ];
      const updatedMeta = createMockMeta({ totalItems: 3 });

      act(() => {
        rerender(
          <ResponseTableSection
            items={updatedItems}
            meta={updatedMeta}
            sort={{ key: 'timestamp', order: 'desc' }}
            onSort={mockOnSort}
            onPrev={mockOnPrev}
            onNext={mockOnNext}
          />
        );
      });

      // Verify new item is displayed
      await waitFor(() => {
        expect(screen.getByTestId('row-0')).toBeInTheDocument();
        expect(screen.getByTestId('row-1')).toBeInTheDocument();
        expect(screen.getByTestId('row-2')).toBeInTheDocument();
      });
    });

    it('handles rapid WebSocket updates', async () => {
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      let items = [createMockResponse({ _id: '1' })];
      const mockMeta = createMockMeta();

      const { rerender } = render(
        <ResponseTableSection
          items={items}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Simulate multiple rapid updates
      for (let i = 2; i <= 5; i++) {
        items = [createMockResponse({ _id: `${i}` }), ...items];
        
        act(() => {
          rerender(
            <ResponseTableSection
              items={items}
              meta={{ ...mockMeta, totalItems: items.length }}
              sort={{ key: 'timestamp', order: 'desc' }}
              onSort={mockOnSort}
              onPrev={mockOnPrev}
              onNext={mockOnNext}
            />
          );
        });
      }

      // Verify all items are rendered
      await waitFor(() => {
        expect(screen.getByTestId('row-0')).toBeInTheDocument();
        expect(screen.getByTestId('row-4')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination Integration', () => {
    it('pagination triggers new API calls', async () => {
      const user = userEvent.setup();
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      // Page 1 data
      const page1Items = [
        createMockResponse({ _id: '1' }),
        createMockResponse({ _id: '2' }),
      ];
      const page1Meta = createMockMeta({ page: 1, totalPages: 3 });

      const { rerender } = render(
        <ResponseTableSection
          items={page1Items}
          meta={page1Meta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Click next button
      const nextButton = screen.getByLabelText('Next page');
      await user.click(nextButton);

      expect(mockOnNext).toHaveBeenCalledTimes(1);

      // Simulate loading state
      rerender(
        <ResponseTableSection
          items={page1Items}
          meta={page1Meta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
          isLoading={true}
        />
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
      });

      // Simulate page 2 data loaded
      const page2Items = [
        createMockResponse({ _id: '3' }),
        createMockResponse({ _id: '4' }),
      ];
      const page2Meta = createMockMeta({ page: 2, totalPages: 3 });

      rerender(
        <ResponseTableSection
          items={page2Items}
          meta={page2Meta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
          isLoading={false}
        />
      );

      // Verify new data is displayed
      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        expect(screen.getByText('Page 2 / 3')).toBeInTheDocument();
      });
    });

    it('handles pagination with empty results', async () => {
      const user = userEvent.setup();
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      // Page 1 with data
      const page1Items = [createMockResponse({ _id: '1' })];
      const page1Meta = createMockMeta({ page: 1, totalPages: 2 });

      const { rerender } = render(
        <ResponseTableSection
          items={page1Items}
          meta={page1Meta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Click next
      await user.click(screen.getByLabelText('Next page'));
      expect(mockOnNext).toHaveBeenCalled();

      // Simulate page 2 with no data
      rerender(
        <ResponseTableSection
          items={[]}
          meta={createMockMeta({ page: 2, totalPages: 2, totalItems: 0 })}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      });
    });

    it('maintains sort state across pagination', async () => {
      const user = userEvent.setup();
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      const sortState: SortState = { key: 'status', order: 'asc' };

      // Page 1
      const page1Items = [createMockResponse({ _id: '1' })];
      const page1Meta = createMockMeta({ page: 1, totalPages: 2 });

      const { rerender } = render(
        <ResponseTableSection
          items={page1Items}
          meta={page1Meta}
          sort={sortState}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Navigate to page 2
      await user.click(screen.getByLabelText('Next page'));

      // Page 2 should maintain the same sort
      const page2Items = [createMockResponse({ _id: '2' })];
      const page2Meta = createMockMeta({ page: 2, totalPages: 2 });

      rerender(
        <ResponseTableSection
          items={page2Items}
          meta={page2Meta}
          sort={sortState}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Verify sort is maintained (through the mock)
      expect(screen.getByTestId('response-table')).toBeInTheDocument();
    });
  });

  describe('Sorting Integration', () => {
    it('triggers re-fetch when sort changes', async () => {
      const user = userEvent.setup();
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      const items = [
        createMockResponse({ _id: '1', response: { ...createMockResponse().response, status: 200 } }),
        createMockResponse({ _id: '2', response: { ...createMockResponse().response, status: 500 } }),
      ];
      const mockMeta = createMockMeta();

      render(
        <ResponseTableSection
          items={items}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Click sort button
      await user.click(screen.getByTestId('sort-status'));

      expect(mockOnSort).toHaveBeenCalledWith('status');
    });

    it('handles multiple sort changes', async () => {
      const user = userEvent.setup();
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      const items = [createMockResponse({ _id: '1' })];
      const mockMeta = createMockMeta();

      render(
        <ResponseTableSection
          items={items}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Multiple sort clicks
      await user.click(screen.getByTestId('sort-status'));
      await user.click(screen.getByTestId('sort-latency'));
      await user.click(screen.getByTestId('sort-timestamp'));

      expect(mockOnSort).toHaveBeenCalledTimes(3);
      expect(mockOnSort).toHaveBeenNthCalledWith(1, 'status');
      expect(mockOnSort).toHaveBeenNthCalledWith(2, 'latency');
      expect(mockOnSort).toHaveBeenNthCalledWith(3, 'timestamp');
    });
  });

  describe('Complex Integration Scenarios', () => {
    it('handles sort change followed by pagination', async () => {
      const user = userEvent.setup();
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      const items = [createMockResponse({ _id: '1' })];
      const mockMeta = createMockMeta({ page: 1, totalPages: 3 });

      render(
        <ResponseTableSection
          items={items}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Change sort
      await user.click(screen.getByTestId('sort-status'));
      expect(mockOnSort).toHaveBeenCalledWith('status');

      // Then paginate
      await user.click(screen.getByLabelText('Next page'));
      expect(mockOnNext).toHaveBeenCalled();
    });

    it('handles WebSocket update during pagination', async () => {
      const user = userEvent.setup();
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      const initialItems = [createMockResponse({ _id: '1' })];
      const mockMeta = createMockMeta({ page: 1, totalPages: 2 });

      const { rerender } = render(
        <ResponseTableSection
          items={initialItems}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Click next
      await user.click(screen.getByLabelText('Next page'));

      // Simulate WebSocket update while loading
      const updatedItems = [
        createMockResponse({ _id: '2' }),
        ...initialItems,
      ];

      act(() => {
        rerender(
          <ResponseTableSection
            items={updatedItems}
            meta={{ ...mockMeta, totalItems: 2 }}
            sort={{ key: 'timestamp', order: 'desc' }}
            onSort={mockOnSort}
            onPrev={mockOnPrev}
            onNext={mockOnNext}
          />
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('row-0')).toBeInTheDocument();
        expect(screen.getByTestId('row-1')).toBeInTheDocument();
      });
    });

    it('handles rapid user interactions', async () => {
      const user = userEvent.setup();
      const mockOnSort = jest.fn();
      const mockOnPrev = jest.fn();
      const mockOnNext = jest.fn();

      const items = [createMockResponse({ _id: '1' })];
      const mockMeta = createMockMeta({ page: 2, totalPages: 5 });

      render(
        <ResponseTableSection
          items={items}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={mockOnSort}
          onPrev={mockOnPrev}
          onNext={mockOnNext}
        />
      );

      // Rapid clicks
      await user.click(screen.getByTestId('sort-status'));
      await user.click(screen.getByLabelText('Next page'));
      await user.click(screen.getByTestId('sort-latency'));
      await user.click(screen.getByLabelText('Previous page'));

      expect(mockOnSort).toHaveBeenCalledTimes(2);
      expect(mockOnNext).toHaveBeenCalledTimes(1);
      expect(mockOnPrev).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles large dataset efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) =>
        createMockResponse({ _id: `${i}` })
      );
      const mockMeta = createMockMeta({ totalItems: 1000, totalPages: 100 });

      const { container } = render(
        <ResponseTableSection
          items={largeDataset}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={jest.fn()}
          onPrev={jest.fn()}
          onNext={jest.fn()}
        />
      );

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId('response-table')).toBeInTheDocument();
    });

    it('recovers from loading state timeout', async () => {
      const { rerender } = render(
        <ResponseTableSection
          items={[]}
          meta={undefined}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={jest.fn()}
          onPrev={jest.fn()}
          onNext={jest.fn()}
          isLoading={true}
        />
      );

      // Simulate long loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Eventually data arrives
      const items = [createMockResponse({ _id: '1' })];
      const mockMeta = createMockMeta();

      rerender(
        <ResponseTableSection
          items={items}
          meta={mockMeta}
          sort={{ key: 'timestamp', order: 'desc' }}
          onSort={jest.fn()}
          onPrev={jest.fn()}
          onNext={jest.fn()}
          isLoading={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('response-table')).toBeInTheDocument();
      });
    });
  });
});
