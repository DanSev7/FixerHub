
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSupabaseTable } from '@/hooks/useSupabaseTable';
import { Database } from '@/integrations/supabase/types';
import TablePagination from '@/components/ui/table-pagination';
import SearchBar from '@/components/ui/search-bar';
import CrudDialog from '@/components/ui/crud-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type JobSubCategoryPricing = Database['public']['Tables']['job_sub_category_pricing']['Row'];
type JobSubCategoryPricingInsert = Database['public']['Tables']['job_sub_category_pricing']['Insert'];

interface PricingFormData {
  job_id?: string;
  sub_category_id?: string;
  price?: string;
}

const JobSubCategoryPricingTable = () => {
  const { 
    data: pricing, 
    loading, 
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize,
    searchTerm,
    create, 
    update, 
    delete: deletePricing,
    goToPage,
    search
  } = useSupabaseTable<JobSubCategoryPricing>('job_sub_category_pricing', 10);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<JobSubCategoryPricing | null>(null);
  const [formData, setFormData] = useState<PricingFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricingFields = [
    { key: 'job_id', label: 'Job ID', type: 'text' as const, required: true },
    { key: 'sub_category_id', label: 'Sub Category ID', type: 'text' as const, required: true },
    { key: 'price', label: 'Price', type: 'text' as const, required: true },
  ];

  const handleCreate = () => {
    setEditingPricing(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (pricingItem: JobSubCategoryPricing) => {
    setEditingPricing(pricingItem);
    setFormData({
      job_id: pricingItem.job_id || '',
      sub_category_id: pricingItem.sub_category_id || '',
      price: String(pricingItem.price)
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData: Partial<JobSubCategoryPricingInsert> = {
        job_id: formData.job_id,
        sub_category_id: formData.sub_category_id,
        price: parseFloat(formData.price || '0')
      };
      let result;
      if (editingPricing) {
        result = await update(editingPricing.id, submitData);
      } else {
        result = await create(submitData);
      }
      
      if (result.success) {
        setIsDialogOpen(false);
        setFormData({});
        setEditingPricing(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setFormData({});
    setEditingPricing(null);
  };

  const handleDelete = async (id: string) => {
    await deletePricing(id);
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Job Sub Category Pricing Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <SearchBar
              value={searchTerm}
              onChange={search}
              placeholder="Search pricing..."
              className="w-full sm:w-64"
            />
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead className="hidden sm:table-cell">Sub Category ID</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.job_id}</TableCell>
                  <TableCell className="hidden sm:table-cell">{item.sub_category_id}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="text-xs">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="text-xs">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this pricing entry.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

        <CrudDialog
          title={editingPricing ? 'Edit Pricing' : 'Create Pricing'}
          fields={pricingFields}
          data={formData}
          onDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          isLoading={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default JobSubCategoryPricingTable;
