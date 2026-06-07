"use client";

import React, { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/buttons";
import { openModal } from "@/components/ui/modals";
import {
  InputCheckbox,
  InputImage,
  TextAreaInput,
  TextInput,
} from "@/components/ui/forms";

export default function Form({ book_id, onSubmit }) {
  const objBook = {
    title: "",
    author: "",
    sinopsis: "",
    story: "",
    is_free: false,
    image: null,
  };

  const [formData, setFormData] = useState(objBook);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, JPG, or PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    openModal({ open: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBook = {
      ...formData,
      id: book_id || Date.now(),
      rating: 0,
      views: 0,
      language: "English",
      img: imagePreview,
    };

    if (onSubmit) {
      onSubmit(newBook);
    }

    openModal({ open: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="d-flex align-items-start flex-column mb-4">
        <span>Add New Book</span>
        <span className="text-secondary fs-6">
          Fill in the details for the new book.
        </span>
      </h3>

      <div className="row col-sm">
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
                is_switch
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
          type="button"
          className="me-2 btn-lg btn-light"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="btn-lg btn-primary">
          Submit
        </Button>
      </div>
    </form>
  );
}
