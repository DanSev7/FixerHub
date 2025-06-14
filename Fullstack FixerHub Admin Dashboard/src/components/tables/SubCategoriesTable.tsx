
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

type SubCategory = Database['public']['Tables']['sub_categories']['Row'];
type SubCategoryInsert = Database['public']['Tables']['sub_categories']['Insert'];

const SubCategoriesTable = () => {
  const { 
    data: subCategories, 
    loading, 
    error,
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize,
    searchTerm,
    create, 
    update, 
    delete: deleteSubCategory,
    goToPage,
    search
  } = useSupabaseTable<SubCategory>('sub_categories', 10);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<SubCategoryInsert>>({});

  const handleCreate = async () => {
    if (!formData.sub_category_name || !formData.category_id) {
      alert('Please fill in all required fields');
      return;
    }
    
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
    if (confirm('Are you sure you want to delete this sub-category?')) {
      await deleteSubCategory(id);
    }
  };

  const startEdit = (subCategory: SubCategory) => {
    setIsEditing(subCategory.sub_category_id);
    setFormData(subCategory);
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Sub Categories Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <SearchBar
              value={searchTerm}
              onChange={search}
              placeholder="Search sub categories..."
              className="w-full sm:w-64"
            />
            <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
              Add Sub Category
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        
        {(isCreating || isEditing) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-4">{isCreating ? 'Create Sub Category' : 'Edit Sub Category'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sub_category_name">Sub Category Name</Label>
                <Input
                  id="sub_category_name"
                  value={formData.sub_category_name || ''}
                  onChange={(e) => setFormData({...formData, sub_category_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="category_id">Category ID</Label>
                <Input
                  id="category_id"
                  value={formData.category_id || ''}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={isCreating ? handleCreate : () => handleUpdate(isEditing!)} className="w-full sm:w-auto">
                {isCreating ? 'Create' : 'Update'}
              </Button>
              <Button variant="outline" onClick={() => {
                setIsCreating(false);
                setIsEditing(null);
                setFormData({});
              }} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sub Category Name</TableHead>
                <TableHead className="hidden md:table-cell">Category ID</TableHead>
                <TableHead className="hidden lg:table-cell">Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories.map((subCategory) => (
                <TableRow key={subCategory.sub_category_id}>
                  <TableCell className="font-medium">{subCategory.sub_category_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{subCategory.category_id}</TableCell>
                  <TableCell className="hidden lg:table-cell">{new Date(subCategory.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(subCategory)} className="text-xs">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(subCategory.sub_category_id)} className="text-xs">
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

export default SubCategoriesTable;
