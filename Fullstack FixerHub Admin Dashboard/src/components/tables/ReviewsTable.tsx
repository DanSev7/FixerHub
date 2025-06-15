
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

type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

const ReviewsTable = () => {
  const { 
    data: reviews, 
    loading, 
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize,
    searchTerm,
    create, 
    update, 
    delete: deleteReview,
    goToPage,
    search
  } = useSupabaseTable<Review>('reviews', 10);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState<Partial<ReviewInsert>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviewFields = [
    { key: 'client_id', label: 'Client ID', type: 'text' as const, required: true },
    { key: 'professional_id', label: 'Professional ID', type: 'text' as const, required: true },
    { key: 'rating', label: 'Rating (1-5)', type: 'text' as const, required: true },
    { key: 'review_text', label: 'Review Text', type: 'textarea' as const, required: false },
  ];

  const handleCreate = () => {
    setEditingReview(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData(review);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let result;
      if (editingReview) {
        result = await update(editingReview.review_id, formData);
      } else {
        result = await create(formData);
      }
      
      if (result.success) {
        setIsDialogOpen(false);
        setFormData({});
        setEditingReview(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setFormData({});
    setEditingReview(null);
  };

  const handleDelete = async (id: string) => {
    await deleteReview(id);
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Reviews Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <SearchBar
              value={searchTerm}
              onChange={search}
              placeholder="Search reviews..."
              className="w-full sm:w-64"
            />
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead className="hidden sm:table-cell">Professional ID</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden md:table-cell">Review Text</TableHead>
                <TableHead className="hidden lg:table-cell">Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.review_id}>
                  <TableCell className="font-medium">{review.client_id}</TableCell>
                  <TableCell className="hidden sm:table-cell">{review.professional_id}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      {review.rating}/5
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{review.review_text || 'N/A'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{new Date(review.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(review)} className="text-xs">
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
                              This action cannot be undone. This will permanently delete this review.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(review.review_id)}>
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
          title={editingReview ? 'Edit Review' : 'Create Review'}
          fields={reviewFields}
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

export default ReviewsTable;
