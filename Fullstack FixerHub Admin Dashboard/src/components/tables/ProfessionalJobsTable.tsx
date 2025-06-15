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

type ProfessionalJob = Database['public']['Tables']['professional_jobs']['Row'];
type ProfessionalJobInsert = Database['public']['Tables']['professional_jobs']['Insert'];

interface JobFormData {
  user_id?: string;
  category_id?: string;
  category_price?: string;
  location?: string;
  is_active?: string;
}

const ProfessionalJobsTable = () => {
  const { 
    data: jobs, 
    loading, 
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize,
    searchTerm,
    create, 
    update, 
    delete: deleteJob,
    goToPage,
    search
  } = useSupabaseTable<ProfessionalJob>('professional_jobs', 10);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<ProfessionalJob | null>(null);
  const [formData, setFormData] = useState<JobFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobFields = [
    { key: 'user_id', label: 'User ID', type: 'text' as const, required: true },
    { key: 'category_id', label: 'Category ID', type: 'text' as const, required: true },
    { key: 'category_price', label: 'Category Price', type: 'text' as const, required: true },
    { key: 'location', label: 'Location', type: 'text' as const, required: false },
    { 
      key: 'is_active', 
      label: 'Status', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ]
    },
  ];

  const handleCreate = () => {
    setEditingJob(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (job: ProfessionalJob) => {
    setEditingJob(job);
    setFormData({
      ...job, 
      is_active: job.is_active ? 'true' : 'false',
      category_price: job.category_price.toString()
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData: Partial<ProfessionalJobInsert> = {
        ...formData, 
        is_active: formData.is_active === 'true',
        category_price: parseFloat(formData.category_price as string)
      };
      let result;
      if (editingJob) {
        result = await update(editingJob.job_id, submitData);
      } else {
        result = await create(submitData);
      }
      
      if (result.success) {
        setIsDialogOpen(false);
        setFormData({});
        setEditingJob(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setFormData({});
    setEditingJob(null);
  };

  const handleDelete = async (id: string) => {
    await deleteJob(id);
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Professional Jobs Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <SearchBar
              value={searchTerm}
              onChange={search}
              placeholder="Search jobs..."
              className="w-full sm:w-64"
            />
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Job
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead className="hidden sm:table-cell">Category ID</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.job_id}>
                  <TableCell className="font-medium">{job.user_id}</TableCell>
                  <TableCell className="hidden sm:table-cell">{job.category_id}</TableCell>
                  <TableCell>${job.category_price}</TableCell>
                  <TableCell className="hidden md:table-cell">{job.location || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(job)} className="text-xs">
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
                              This action cannot be undone. This will permanently delete this job.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(job.job_id)}>
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
          title={editingJob ? 'Edit Job' : 'Create Job'}
          fields={jobFields}
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

export default ProfessionalJobsTable;
