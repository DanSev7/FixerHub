
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset 
} from '@/components/ui/sidebar';
import { 
  Users, 
  FileText, 
  FolderTree, 
  Layers, 
  Briefcase, 
  DollarSign, 
  MessageSquare, 
  Star, 
  Mail,
  LogOut,
  Menu
} from 'lucide-react';
import UsersTable from './tables/UsersTable';
import ProfessionalDocumentsTable from './tables/ProfessionalDocumentsTable';
import CategoriesTable from './tables/CategoriesTable';
import SubCategoriesTable from './tables/SubCategoriesTable';
import ProfessionalJobsTable from './tables/ProfessionalJobsTable';
import JobSubCategoryPricingTable from './tables/JobSubCategoryPricingTable';
import MessagesTable from './tables/MessagesTable';
import ReviewsTable from './tables/ReviewsTable';
import EmailVerificationsTable from './tables/EmailVerificationsTable';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTable, setActiveTable] = useState('users');

  const tables = [
    { id: 'users', name: 'Users', icon: Users, component: UsersTable },
    { id: 'professional_documents', name: 'Professional Documents', icon: FileText, component: ProfessionalDocumentsTable },
    { id: 'categories', name: 'Categories', icon: FolderTree, component: CategoriesTable },
    { id: 'sub_categories', name: 'Sub Categories', icon: Layers, component: SubCategoriesTable },
    { id: 'professional_jobs', name: 'Professional Jobs', icon: Briefcase, component: ProfessionalJobsTable },
    { id: 'job_sub_category_pricing', name: 'Job Sub Category Pricing', icon: DollarSign, component: JobSubCategoryPricingTable },
    { id: 'messages', name: 'Messages', icon: MessageSquare, component: MessagesTable },
    { id: 'reviews', name: 'Reviews', icon: Star, component: ReviewsTable },
    { id: 'email_verifications', name: 'Email Verifications', icon: Mail, component: EmailVerificationsTable },
  ];

  const ActiveComponent = tables.find(table => table.id === activeTable)?.component;
  const activeTableName = tables.find(table => table.id === activeTable)?.name;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="hidden md:block">
          <SidebarHeader className="p-4 border-b">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="p-2">
              {tables.map((table) => (
                <SidebarMenuItem key={table.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTable(table.id)}
                    isActive={activeTable === table.id}
                    className="w-full justify-start gap-3 p-3"
                  >
                    <table.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{table.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem className="mt-4 pt-4 border-t">
                <SidebarMenuButton
                  onClick={onLogout}
                  className="w-full justify-start gap-3 p-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold truncate">{activeTableName}</h1>
            </div>
          </header>
          
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
