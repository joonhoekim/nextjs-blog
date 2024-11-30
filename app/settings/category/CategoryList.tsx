// app/[handle]/CategoryList.tsx
"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useRef } from "react";
import { Category } from "@prisma/client";
import { createCategory, updateCategory, deleteCategory } from "./actions";

interface CategoryListProps {
  categories: Category[];
  isOwner: boolean;
  handle: string;
}

export default function CategoryList({
  categories: initialCategories,
  isOwner,
  handle,
}: CategoryListProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const toast = useRef<Toast>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = newCategory.toLowerCase().replace(/\s+/g, "-");
      const category = await createCategory({
        name: newCategory,
        slug,
        handle,
      });
      setCategories([category, ...categories]);
      setNewCategory("");
      setShowAddForm(false);
      showSuccess("Category created successfully");
    } catch (error) {
      showError("Failed to create category");
    }
  };

  const handleUpdate = async (id: string, newName: string) => {
    try {
      const slug = newName.toLowerCase().replace(/\s+/g, "-");
      const updatedCategory = await updateCategory({ id, name: newName, slug });
      setCategories(
        categories.map((cat) => (cat.id === id ? updatedCategory : cat)),
      );
      setEditingId(null);
      showSuccess("Category updated successfully");
    } catch (error) {
      showError("Failed to update category");
    }
  };

  const handleDelete = async (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      showSuccess("Category deleted successfully");
    } catch (error) {
      showError("Failed to delete category");
    }
    setDeleteConfirmVisible(false);
  };

  if (!isOwner) {
    return (
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="p-2 rounded hover:bg-gray-100">
            {category.name}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      <Toast ref={toast} />

      <ConfirmDialog
        visible={deleteConfirmVisible}
        onHide={() => setDeleteConfirmVisible(false)}
        message="Are you sure you want to delete this category?"
        header="Confirm Delete"
        icon="pi pi-exclamation-triangle"
        accept={confirmDelete}
        reject={() => setDeleteConfirmVisible(false)}
      />

      {showAddForm ? (
        <form onSubmit={handleAdd} className="flex gap-2">
          <InputText
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="flex-1"
          />
          <Button type="submit" icon="pi pi-check" />
          <Button
            type="button"
            icon="pi pi-times"
            severity="secondary"
            onClick={() => setShowAddForm(false)}
          />
        </form>
      ) : (
        <Button
          icon="pi pi-plus"
          label="Add Category"
          severity="secondary"
          text
          onClick={() => setShowAddForm(true)}
        />
      )}

      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-400"
          >
            {editingId === category.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector("input");
                  if (input) handleUpdate(category.id, input.value);
                }}
                className="flex gap-2 flex-1"
              >
                <InputText
                  defaultValue={category.name}
                  className="flex-1"
                  autoFocus
                  onBlur={(e) => handleUpdate(category.id, e.target.value)}
                />
                <Button type="submit" icon="pi pi-check" size="small" />
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="secondary"
                  size="small"
                  onClick={() => setEditingId(null)}
                />
              </form>
            ) : (
              <>
                <span className="flex-1">{category.name}</span>
                <Button
                  icon="pi pi-pencil"
                  text
                  severity="secondary"
                  size="small"
                  onClick={() => setEditingId(category.id)}
                />
                <Button
                  icon="pi pi-trash"
                  text
                  severity="danger"
                  size="small"
                  onClick={() => handleDelete(category)}
                />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
