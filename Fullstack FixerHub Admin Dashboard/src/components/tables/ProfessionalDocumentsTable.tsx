
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

type ProfessionalDocument = Database['public']['Tables']['professional_documents']['Row'];
type ProfessionalDocumentInsert = Database['public']['Tables']['professional_documents']['Insert'];

const ProfessionalDocumentsTable = () => {
  const { 
    data: documents, 
    loading, 
    error,
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize,
    searchTerm,
    create, 
    update, 
    delete: deleteDocument,
    goToPage,
    search
  } = useSupabaseTable<ProfessionalDocument>('professional_documents', 10);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfessionalDocumentInsert>>({});

  const handleCreate = async () => {
    if (!formData.user_id) {
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
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
    }
  };

  const startEdit = (document: ProfessionalDocument) => {
    setIsEditing(document.document_id);
    setFormData(document);
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Professional Documents Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <SearchBar
              value={searchTerm}
              onChange={search}
              placeholder="Search documents..."
              className="w-full sm:w-64"
            />
            <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
              Add Document
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
            <h3 className="font-medium mb-4">{isCreating ? 'Create Document' : 'Edit Document'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user_id">User ID</Label>
                <Input
                  id="user_id"
                  value={formData.user_id || ''}
                  onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="verified_name">Verified Name</Label>
                <Input
                  id="verified_name"
                  value={formData.verified_name || ''}
                  onChange={(e) => setFormData({...formData, verified_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="status">Verification Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.verification_status || ''}
                  onChange={(e) => setFormData({...formData, verification_status: e.target.value as 'pending' | 'verified' | 'failed'})}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <Label htmlFor="national_id_url">National ID Document URL</Label>
                <Input
                  id="national_id_url"
                  value={formData.national_id_document_url || ''}
                  onChange={(e) => setFormData({...formData, national_id_document_url: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="work_clearance_url">Work Clearance URL</Label>
                <Input
                  id="work_clearance_url"
                  value={formData.work_clearance_document_url || ''}
                  onChange={(e) => setFormData({...formData, work_clearance_document_url: e.target.value})}
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
                <TableHead>User ID</TableHead>
                <TableHead className="hidden sm:table-cell">Verified Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">National ID</TableHead>
                <TableHead className="hidden lg:table-cell">Work Clearance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.document_id}>
                  <TableCell className="font-medium">{doc.user_id}</TableCell>
                  <TableCell className="hidden sm:table-cell">{doc.verified_name || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      doc.verification_status === 'verified' ? 'bg-green-100 text-green-800' : 
                      doc.verification_status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.verification_status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{doc.national_id_document_url ? 'Available' : 'N/A'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{doc.work_clearance_document_url ? 'Available' : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(doc)} className="text-xs">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(doc.document_id)} className="text-xs">
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

export default ProfessionalDocumentsTable;
