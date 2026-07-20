"use client";

import React, { useEffect, useState } from "react";
import {
  TextAreaInput,
  TextInput,
  InputImage,
  InputCheckbox,
} from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import { openModal, ModalResponse } from "@/components/ui/modals";
import { GET_BOOK_BY_ID } from "@/components/apis/BookServices";
import { Alert } from "@/components//ui/alert";
import { CREATE_BOOK, UPDATE_BOOK } from "@/components/apis/BookServices";

export default function Form({ book_id, ReloadBook }) {
  const obj_book = {
    title: "",
    author: "",
    sinopsis: "",
    story: "",
    is_free: false,
    image: null,
  };

  const [formData, setFormData] = useState(obj_book);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const ReloadBookByID = async () => {
    const result = await GET_BOOK_BY_ID(book_id);
    console.log("result", result);
    if (result.data && Object.values(result.data).length > 0) {
      setFormData(result.data);
      if (result.data.image) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URI}${result.data.image}`;
        setImagePreview(imageUrl);
      }
    } else {
      openModal({
        message: (
          <ModalResponse message={result.message} title={"No record found"} />
        ),
      });
      setFormData(obj_book);
    }
  };

  useEffect(() => {
    if (book_id) {
      ReloadBookByID();
    }
  }, [book_id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, or PNG)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const formDataToSend = new FormData();
      // Append all form fields to FormData
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("sinopsis", formData.sinopsis);
      formDataToSend.append("story", formData.story);
      formDataToSend.append("is_free", formData.is_free);

      // Append image file if exists
      if (formData.image instanceof File) {
        formDataToSend.append("coverImage", formData.image);
      }

      if (book_id) {
        formDataToSend.append("id", book_id);
        const result = await UPDATE_BOOK(book_id, formDataToSend);
        console.log(result);
        if (result.success) {
          openModal({
            message: (
              <ModalResponse
                message="Book has been successfully updated!"
                title="Success"
              />
            ),
          });
          ReloadBook();
          // Reset form
          setFormData(obj_book);
          setImagePreview(null);
        } else {
          setError(result.message || "Failed to create book");
          setImagePreview(null);
        }
      } else {
        const result = await CREATE_BOOK(formDataToSend);
        if (result.success) {
          openModal({
            message: (
              <ModalResponse
                message="Book has been successfully created!"
                title="Success"
              />
            ),
          });
          ReloadBook();
          // Reset form
          setFormData(obj_book);
          setImagePreview(null);
        } else {
          setError(result.message || "Failed to create book");
          setImagePreview(null);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="d-flex align-items-start flex-column">
        <span className="">Add New Book</span>
        <span className="text-secondary fs-6">
          Fill in the details for the new book.
        </span>
      </h3>
      <div className="row">
        <div className="col-lg-6">
          <TextInput
            title="Book Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <TextAreaInput
            title="Sinopsis"
            name="sinopsis"
            value={formData.sinopsis}
            onChange={handleInputChange}
            rows={2}
            required
          />
          <TextAreaInput
            title="Story"
            name="story"
            value={formData.story}
            onChange={handleInputChange}
            rows={3}
            required
          />
        </div>
        <div className="col-lg-6">
          <div className="row">
            <div className="col-8">
              <TextInput
                title="Author Name"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-4">
              <InputCheckbox
                title="Type Book"
                value="Is Free"
                name="is_free"
                is_switch={true}
                required={true}
                checked={formData.is_free}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <InputImage
            title="Cover Image"
            onChange={handleImageChange}
            required
            imagePreview={imagePreview}
          />
        </div>
      </div>
      {error && (
        <div className="mt-4">
          <Alert message={error} variant="danger" />
        </div>
      )}
      <div className="mt-4 text-center">
        <Button
          type="submit"
          variant="light"
          className="me-2 btn-lg"
          onClick={() => openModal({ open: false })}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="btn-lg">
          Submit Book
        </Button>
      </div>
    </form>
  );
}
