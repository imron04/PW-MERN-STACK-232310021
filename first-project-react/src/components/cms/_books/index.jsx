"use client";

import React, { useEffect, useState } from "react";
import { openModal } from "@/components/ui/modals";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/loading";
import { GET_ALL_BOOK } from "@/components/apis/BookServices";
import { CardCalculates } from "../components/card_calculates";
import { Header } from "./components/header";
import Form from "./components/form";
import Tabledata from "./components/tabledata";

export function MBooks() {
  const [books, setBooks] = useState({ loading: false, data: [], message: "" });
  const ReloadBook = async () => {
    setBooks({ loading: true, data: [], message: "" });
    const results = await GET_ALL_BOOK();
    setBooks(results);
  };
  useEffect(() => {
    ReloadBook();
  }, []);

  return (
    <div className="container-fluid">
      <Header
        handleAdd={() =>
          openModal({ message: <Form ReloadBook={ReloadBook} />, size: "xl" })
        }
      />

      <div className="row">
        <div className="col-md-3">
          <CardCalculates
            title={`Total Books`}
            value={books?.data.length}
            icon={`book`}
          />
        </div>
        <div className="col-md-3">
          <CardCalculates
            title={`Free Book`}
            value={books?.data.filter((b) => !b.is_free).length || 0}
            icon={`grid`}
          />
        </div>
        <div className="col-md-3">
          <CardCalculates
            title={`Subscribe`}
            value={books?.data.filter((b) => b.is_free).length || 0}
            icon={`calendar-event`}
          />
        </div>
        <div className="col-md-3">
          <CardCalculates
            title={`Authors`}
            value={books?.data.filter((b) => b.author).length || 0}
            icon={`people`}
          />
        </div>
      </div>

      {books.loading ? (
        <Skeleton />
      ) : books.message ? (
        <Alert message={books.message} variant="danger" />
      ) : books.data && books.data.length > 0 ? (
        <Tabledata data={books.data} ReloadData={ReloadBook} />
      ) : (
        ""
      )}
    </div>
  );
}

export default MBooks;
