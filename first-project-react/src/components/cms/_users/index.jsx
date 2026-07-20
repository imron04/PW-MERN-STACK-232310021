"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/cards";
import {
  HeaderDatatables,
  PaginationComponent,
  SearchInput,
} from "@/components/ui/datatables";
import { openModal, ModalResponse } from "@/components/ui/modals";
import {
  CREATE_USER,
  DELETE_USER,
  GET_ALL_USERS,
  UPDATE_USER,
  UPDATE_USER_STATUS,
} from "@/components/apis/UserServices";

const initialForm = {
  username: "",
  email: "",
  password: "",
  is_active: true,
};

function UserForm({ user, ReloadUsers }) {
  const [formData, setFormData] = useState(
    user
      ? {
          username: user.username || "",
          email: user.email || "",
          password: "",
          is_active: user.is_active !== false,
        }
      : initialForm,
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { ...formData };
    if (!user && !payload.password) {
      setError("Password is required for new user");
      return;
    }

    if (user && !payload.password) {
      delete payload.password;
    }

    const result = user
      ? await UPDATE_USER(user.id, payload)
      : await CREATE_USER(payload);

    if (result?.success) {
      ReloadUsers();
      openModal({
        message: (
          <ModalResponse
            title="Success"
            message={
              user ? "User updated successfully" : "User created successfully"
            }
          />
        ),
      });
    } else {
      setError(result?.message || "Failed to save user");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="d-flex align-items-start flex-column mb-4">
        <span className="text-secondary fs-6">
          {user
            ? "Update user details below"
            : "Fill in the user details below"}
        </span>
      </h3>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={user ? "Leave blank to keep current password" : ""}
          />
        </div>
        <div className="col-md-6 d-flex align-items-end">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <label className="form-check-label">Active User</label>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-3">
          <Alert message={error} variant="danger" />
        </div>
      )}
      <div className="mt-4 text-center">
        <Button
          variant="light"
          className="me-2"
          onClick={() => openModal({ open: false })}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          style={{ backgroundColor: "#437059", borderColor: "#437059" }}
          type="submit"
        >
          {user ? "Update User" : "Save User"}
        </Button>
      </div>
    </form>
  );
}

export function MUsers() {
  const [users, setUsers] = useState({ loading: false, data: [], message: "" });
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const ReloadUsers = async () => {
    setUsers({ loading: true, data: [], message: "" });
    const results = await GET_ALL_USERS();
    setUsers(results);
  };

  useEffect(() => {
    ReloadUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleToggleStatus = async (userId, currentStatus) => {
    setUsers((prev) => ({ ...prev, loading: true, message: "" }));
    const result = await UPDATE_USER_STATUS(userId, !currentStatus);

    if (result?.success) {
      ReloadUsers();
    } else {
      setUsers((prev) => ({
        ...prev,
        loading: false,
        message: result?.message || "Failed to update user status",
      }));
    }
  };

  const handleOpenCreate = () => {
    openModal({
      header: "Add New User",
      size: "lg",
      message: <UserForm ReloadUsers={ReloadUsers} />,
    });
  };

  const handleOpenEdit = (user) => {
    openModal({
      header: "Edit User",
      size: "lg",
      message: <UserForm user={user} ReloadUsers={ReloadUsers} />,
    });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;

    setUsers((prev) => ({ ...prev, loading: true, message: "" }));
    const result = await DELETE_USER(userId);

    if (result?.success) {
      ReloadUsers();
    } else {
      setUsers((prev) => ({
        ...prev,
        loading: false,
        message: result?.message || "Failed to delete user",
      }));
    }
  };

  const filteredUsers = useMemo(() => {
    const data = users?.data || [];
    let computedData = [...data];

    if (search) {
      const keyword = search.toLowerCase();
      computedData = computedData.filter((user) => {
        return `${user.username || ""} ${user.email || ""}`
          .toLowerCase()
          .includes(keyword);
      });
    }

    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedData = computedData.sort((a, b) => {
        const valueA = (a[sorting.field] || "").toString().toLowerCase();
        const valueB = (b[sorting.field] || "").toString().toLowerCase();
        return reversed * valueA.localeCompare(valueB);
      });
    }

    return computedData;
  }, [users?.data, search, sorting]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const table_headers = [
    { name: "No", field: "id", sortable: false, className: "text-center" },
    { name: "Username", field: "username", sortable: true },
    { name: "Email", field: "email", sortable: true },
    {
      name: "Status",
      field: "is_active",
      sortable: true,
      className: "text-center",
    },
    { name: "Actions", field: "id", sortable: false, className: "text-center" },
  ];

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="mb-1" style={{ color: "#437059" }}>
                <i className="bi bi-people me-2"></i>
                Users Management
              </h2>
              <p className="text-muted mb-0">Manage your user accounts</p>
            </div>
            <Button
              className="d-flex align-items-center gap-2"
              onClick={handleOpenCreate}
              style={{ backgroundColor: "#437059", borderColor: "#437059" }}
            >
              <i className="bi bi-plus-circle"></i>
              Add New User
            </Button>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Users</h6>
              <h2 className="mb-0">{users?.data?.length || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Active Users</h6>
              <h2 className="mb-0">
                {users?.data?.filter((user) => user.is_active).length || 0}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Inactive Users</h6>
              <h2 className="mb-0">
                {users?.data?.filter((user) => !user.is_active).length || 0}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {users.loading ? (
        <Skeleton />
      ) : users.message ? (
        <Alert message={users.message} variant="danger" />
      ) : (
        <Cards>
          <Cards.Header>
            <span className="card-label fw-bold fs-3">User Lists</span>
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
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td className="text-center">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td>
                          <strong>{user.username}</strong>
                        </td>
                        <td>{user.email}</td>
                        <td className="text-center">
                          <span
                            className={`badge ${user.is_active ? "bg-success" : "bg-secondary"}`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="warning"
                            outline
                            className="btn-sm me-2"
                            onClick={() => handleOpenEdit(user)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="danger"
                            outline
                            className="btn-sm me-2"
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                          <Button
                            variant={user.is_active ? "warning" : "success"}
                            outline
                            className="btn-sm"
                            onClick={() =>
                              handleToggleStatus(user.id, user.is_active)
                            }
                            title={user.is_active ? "Deactivate" : "Activate"}
                          >
                            <i
                              className={`bi ${user.is_active ? "bi-person-dash" : "bi-person-check"}`}
                            ></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                        <p className="text-muted mb-0">No users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {filteredUsers.length > 0 && (
                <div className="d-flex align-items-center justify-content-center">
                  <PaginationComponent
                    total={filteredUsers.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </div>
          </Cards.Body>
        </Cards>
      )}
    </div>
  );
}

export default MUsers;
