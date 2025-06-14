import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseTable<T extends Record<string, any>>(tableName: string, pageSize: number = 10) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from(tableName as any).select('*', { count: 'exact' });
      
      // Apply search if provided
      if (search) {
        // Get the first text column for search (this is a simple approach)
        const searchColumns = getSearchColumns(tableName);
        if (searchColumns.length > 0) {
          const searchConditions = searchColumns.map(col => `${col}.ilike.%${search}%`).join(',');
          query = query.or(searchConditions);
        }
      }

      // Get total count
      const { count, error: countError } = await query;
      if (countError) throw countError;
      setTotalCount(count || 0);

      // Get paginated data
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let dataQuery = supabase.from(tableName as any).select('*').order('created_at', { ascending: false });
      
      if (search) {
        const searchColumns = getSearchColumns(tableName);
        if (searchColumns.length > 0) {
          const searchConditions = searchColumns.map(col => `${col}.ilike.%${search}%`).join(',');
          dataQuery = dataQuery.or(searchConditions);
        }
      }

      const { data: result, error: dataError } = await dataQuery.range(from, to);

      if (dataError) throw dataError;
      setData((result || []) as unknown as T[]);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSearchColumns = (tableName: string): string[] => {
    const searchColumnMap: Record<string, string[]> = {
      'users': ['username', 'email', 'phone_number'],
      'categories': ['category_name'],
      'sub_categories': ['sub_category_name'],
      'professional_documents': ['verified_name'],
      'professional_jobs': ['location'],
      'job_sub_category_pricing': ['job_id', 'sub_category_id'],
      'messages': ['message_text'],
      'reviews': ['review_text'],
      'email_verifications': ['email'],
    };
    return searchColumnMap[tableName] || [];
  };

  const createRecord = async (record: Partial<T>) => {
    try {
      setError(null);
      const { data: result, error } = await supabase
        .from(tableName as any)
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh current page to show new data
      await fetchData(currentPage, searchTerm);
      return { success: true, data: result };
    } catch (err) {
      console.error('Error creating record:', err);
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateRecord = async (id: string, updates: Partial<T>) => {
    try {
      setError(null);
      
      // Find the correct ID column for this table
      let idColumn = 'id';
      if (tableName === 'users') idColumn = 'user_id';
      else if (tableName === 'categories') idColumn = 'category_id';
      else if (tableName === 'sub_categories') idColumn = 'sub_category_id';
      else if (tableName === 'professional_documents') idColumn = 'document_id';
      else if (tableName === 'professional_jobs') idColumn = 'job_id';
      else if (tableName === 'messages') idColumn = 'message_id';
      else if (tableName === 'reviews') idColumn = 'review_id';
      else if (tableName === 'email_verifications') idColumn = 'email';

      const { data: result, error } = await supabase
        .from(tableName as any)
        .update(updates)
        .eq(idColumn, id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh current page to show updated data
      await fetchData(currentPage, searchTerm);
      return { success: true, data: result };
    } catch (err) {
      console.error('Error updating record:', err);
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      setError(null);
      
      // Find the correct ID column for this table
      let idColumn = 'id';
      if (tableName === 'users') idColumn = 'user_id';
      else if (tableName === 'categories') idColumn = 'category_id';
      else if (tableName === 'sub_categories') idColumn = 'sub_category_id';
      else if (tableName === 'professional_documents') idColumn = 'document_id';
      else if (tableName === 'professional_jobs') idColumn = 'job_id';
      else if (tableName === 'messages') idColumn = 'message_id';
      else if (tableName === 'reviews') idColumn = 'review_id';
      else if (tableName === 'email_verifications') idColumn = 'email';

      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq(idColumn, id);

      if (error) throw error;
      
      // Refresh current page after deletion
      await fetchData(currentPage, searchTerm);
      return { success: true };
    } catch (err) {
      console.error('Error deleting record:', err);
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false, error: message };
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page, searchTerm);
    }
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    fetchData(1, search); // Reset to page 1 when searching
  };

  useEffect(() => {
    fetchData(1);
  }, [tableName, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    searchTerm,
    refetch: () => fetchData(currentPage, searchTerm),
    create: createRecord,
    update: updateRecord,
    delete: deleteRecord,
    goToPage,
    search: handleSearch,
  };
}
