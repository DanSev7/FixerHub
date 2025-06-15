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

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

interface MessageFormData {
  sender_id?: string;
  receiver_id?: string;
  message_text?: string;
  is_read?: string;
}

const MessagesTable = () => {
  const { 
    data: messages, 
    loading, 
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize,
    searchTerm,
    create, 
    update, 
    delete: deleteMessage,
    goToPage,
    search
  } = useSupabaseTable<Message>('messages', 10);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [formData, setFormData] = useState<MessageFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messageFields = [
    { key: 'sender_id', label: 'Sender ID', type: 'text' as const, required: true },
    { key: 'receiver_id', label: 'Receiver ID', type: 'text' as const, required: true },
    { key: 'message_text', label: 'Message Text', type: 'textarea' as const, required: true },
    { 
      key: 'is_read', 
      label: 'Read Status', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'false', label: 'Unread' },
        { value: 'true', label: 'Read' }
      ]
    },
  ];

  const handleCreate = () => {
    setEditingMessage(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setFormData({
      ...message, 
      is_read: message.is_read ? 'true' : 'false'
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData: Partial<MessageInsert> = {
        ...formData, 
        is_read: formData.is_read === 'true'
      };
      let result;
      if (editingMessage) {
        result = await update(editingMessage.message_id, submitData);
      } else {
        result = await create(submitData);
      }
      
      if (result.success) {
        setIsDialogOpen(false);
        setFormData({});
        setEditingMessage(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setFormData({});
    setEditingMessage(null);
  };

  const handleDelete = async (id: string) => {
    await deleteMessage(id);
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Messages Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <SearchBar
              value={searchTerm}
              onChange={search}
              placeholder="Search messages..."
              className="w-full sm:w-64"
            />
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Message
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender ID</TableHead>
                <TableHead className="hidden sm:table-cell">Receiver ID</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.message_id}>
                  <TableCell className="font-medium">{message.sender_id}</TableCell>
                  <TableCell className="hidden sm:table-cell">{message.receiver_id}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{message.message_text}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      message.is_read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {message.is_read ? 'Read' : 'Unread'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{new Date(message.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(message)} className="text-xs">
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
                              This action cannot be undone. This will permanently delete this message.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(message.message_id)}>
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
          title={editingMessage ? 'Edit Message' : 'Create Message'}
          fields={messageFields}
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

export default MessagesTable;
