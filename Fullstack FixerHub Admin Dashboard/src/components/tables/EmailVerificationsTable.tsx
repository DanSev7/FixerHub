
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

type EmailVerification = Database['public']['Tables']['email_verifications']['Row'];
type EmailVerificationInsert = Database['public']['Tables']['email_verifications']['Insert'];

const EmailVerificationsTable = () => {
  const { 
    data: verifications, 
    loading, 
    error,
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize,
    searchTerm,
    create, 
    update, 
    delete: deleteVerification,
    goToPage,
    search
  } = useSupabaseTable<EmailVerification>('email_verifications', 10);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<EmailVerificationInsert>>({});

  const handleCreate = async () => {
    if (!formData.email || !formData.otp) {
      alert('Please fill in all required fields');
      return;
    }
    
    const result = await create(formData);
    if (result.success) {
      setIsCreating(false);
      setFormData({});
    }
  };

  const handleUpdate = async (email: string) => {
    const result = await update(email, formData);
    if (result.success) {
      setIsEditing(null);
      setFormData({});
    }
  };

  const handleDelete = async (email: string) => {
    if (confirm('Are you sure you want to delete this verification?')) {
      await deleteVerification(email);
    }
  };

  const startEdit = (verification: EmailVerification) => {
    setIsEditing(verification.email);
    setFormData(verification);
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Email Verifications Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <SearchBar
              value={searchTerm}
              onChange={search}
              placeholder="Search verifications..."
              className="w-full sm:w-64"
            />
            <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
              Add Verification
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
            <h3 className="font-medium mb-4">{isCreating ? 'Create Verification' : 'Edit Verification'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  value={formData.otp || ''}
                  onChange={(e) => setFormData({...formData, otp: e.target.value})}
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
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell">OTP</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifications.map((verification) => (
                <TableRow key={verification.email}>
                  <TableCell className="font-medium">{verification.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{verification.otp}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(verification.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(verification)} className="text-xs">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(verification.email)} className="text-xs">
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

export default EmailVerificationsTable;
