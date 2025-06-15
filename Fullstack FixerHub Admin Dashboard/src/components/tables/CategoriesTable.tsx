
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSupabaseTable } from '@/hooks/useSupabaseTable';
import { Database } from '@/integrations/supabase/types';
import TablePagination from '@/components/ui/table-pagination';
import SearchBar from '@/components/ui/search-bar';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

const CategoriesTable = () => {
  const { 
    data: categories, 
    loading, 
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize,
    searchTerm,
    create, 
    update, 
    delete: deleteCategory,
    goToPage,
    search
  } = useSupabaseTable<Category>('categories', 10);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<CategoryInsert>>({});

  const handleCreate = async () => {
    const result = await create(formData);
    if (result.success) {
      setIsCreating(false);
      setFormData({});
    }
  };

  const handleUpdate = async (id: string) => {
    const result = await update(id, formData);
    if (result.success) {
      setIsEditing(null);
      setFormData({});
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  const startEdit = (category: Category) => {
    setIsCreating(false); // Close create form if open
    setIsEditing(category.category_id);
    setFormData({ category_name: category.category_name });
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setIsEditing(null);
    setFormData({});
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Categories Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <SearchBar
              value={searchTerm}
              onChange={search}
              placeholder="Search categories..."
              className="w-full sm:w-64"
            />
            <Button 
              onClick={() => {
                setIsEditing(null); // Close edit form if open
                setIsCreating(true);
                setFormData({});
              }} 
              className="w-full sm:w-auto"
            >
              Add Category
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {(isCreating || isEditing) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-4">
              {isCreating ? 'Create Category' : 'Edit Category'}
            </h3>
            <div>
              <Label htmlFor="category_name">Category Name</Label>
              <Input
                id="category_name"
                value={formData.category_name || ''}
                onChange={(e) => setFormData({...formData, category_name: e.target.value})}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                onClick={isCreating ? handleCreate : () => handleUpdate(isEditing!)} 
                className="w-full sm:w-auto"
              >
                {isCreating ? 'Create' : 'Update'}
              </Button>
              <Button 
                variant="outline" 
                onClick={cancelEdit} 
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell className="font-medium">{category.category_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(category.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => startEdit(category)} 
                        className="text-xs"
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(category.category_id)} 
                        className="text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={goToPage}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesTable;
