"use client";
import React, { useMemo, useState } from "react";
import { Cards } from "@/components/ui/cards";
import { Button } from "@/components/ui/buttons";
import {
  HeaderDatatables,
  SearchInput,
  PaginationComponent,
} from "@/components/ui/datatables";

export default function Tabledata({ data = [] }) {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const table_headers = [
    { name: "No", field: "id", sortable: false },
    { name: "Title", field: "title", sortable: true },
    { name: "Author", field: "author", sortable: true },
    { name: "Language", field: "language", sortable: true },
    { name: "Rate/View", field: "rate", sortable: false },
    { name: "Subscribe", field: "is_free", sortable: true },
    { name: "Actions", field: "id", sortable: false },
  ];

  // Placeholder fungsi aksi agar tidak error
  const handleEdit = (book) => {
    console.log("Edit book:", book);
  };

  const handleDelete = (id) => {
    console.log("Delete book ID:", id);
  };

  // 1. Filter Data berdasarkan Search
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((listData) => {
      return Object.keys(listData).some((key) => {
        try {
          const value = listData[key];
          return (
            value != null &&
            String(value).toLowerCase().includes(search.toLowerCase())
          );
        } catch (error) {
          console.error(`Error processing key "${key}":`, error);
          return false;
        }
      });
    });
  }, [data, search]);

  // 2. Hitung Total Items dari hasil filter (menghindari infinite loop)
  const totalItems = filteredData.length;

  // Reset ke halaman 1 jika user mengetik pencarian baru
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // 3. Sort dan Paginate Data
  const ResultData = useMemo(() => {
    let computedData = [...filteredData]; // Gunakan spread operator agar tidak merusak data asli

    // Proses Sorting
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedData.sort((a, b) => {
        const valA = String(a[sorting.field] || "");
        const valB = String(b[sorting.field] || "");
        return reversed * valA.localeCompare(valB);
      });
    }

    // Proses Pagination
    return computedData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    );
  }, [filteredData, sorting, currentPage]);

  return (
    <Cards>
      <Cards.Header>
        <span className="card-label fw-bold fs-3">Book Lists</span>
        <div className="w-50">
          <SearchInput
            keyword={search}
            onAction={(e) => setSearch(e.target.value)}
          />
        </div>
      </Cards.Header>
      <Cards.Body className="px-0 pb-0">
        <div className="table-responsive">
          <table className="table table-hover">
            <HeaderDatatables
              headers={table_headers}
              onSorting={(field, order) => setSorting({ field, order })}
            />
            <tbody>
              {ResultData.length > 0 ? (
                ResultData.map((book, index) => (
                  <tr key={book.id || index}>
                    <td className="text-center">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td>
                      <strong>{book.title}</strong>
                    </td>
                    <td>{book.author}</td>
                    <td>{book.language}</td>
                    <td>
                      <div className="d-flex">
                        <div className="me-3">
                          <i className="bi bi-star-fill text-warning"></i>
                          <span className="text-dark ms-1">
                            {book.rating || 0}
                          </span>
                        </div>
                        <div className="me-3">
                          <i className="bi bi-eye text-info"></i>
                          <span className="text-dark ms-1">
                            {book.views || 0}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {book.is_free ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="warning"
                        outline
                        className="btn-sm me-2"
                        onClick={() => handleEdit(book)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="danger"
                        outline
                        className="btn-sm me-2"
                        onClick={() => handleDelete(book.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                    <p className="text-muted mb-0">No books found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalItems > 0 && (
            <div className="d-flex align-items-center justify-content-center my-4">
              <PaginationComponent
                total={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </Cards.Body>
    </Cards>
  );
}
