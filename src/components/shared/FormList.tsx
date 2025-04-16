import React, { useState, useEffect } from "react";
import { PlusCircle, Copy, Trash2, Edit, Eye, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { cn } from "../../lib/utils";
import { Pagination } from "../ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface Form {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export function FormList() {
  const [forms, setForms] = useState<Form[]>([
    // {
    //   id: "1",
    //   title: "Customer Feedback",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
    // {
    //   id: "2",
    //   title: "Job Application",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
  ]);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const itemsPerPage = 10;

  // Calculate paginated forms
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedForms = forms.slice(startIndex, endIndex);

  // Reset to first page when forms length changes
  useEffect(() => {
    if (currentPage > 1 && startIndex >= forms.length) {
      setCurrentPage(Math.max(1, Math.ceil(forms.length / itemsPerPage)));
    }
  }, [forms.length, currentPage, startIndex, itemsPerPage]);

  const createForm = () => {
    if (!newFormTitle.trim()) {
      toast({
        title: "Error",
        description: "Form title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newForm: Form = {
      id: Date.now().toString(),
      title: newFormTitle,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setForms([...forms, newForm]);
    setNewFormTitle("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Form created successfully",
    });
  };

  const duplicateForm = (form: Form) => {
    const duplicatedForm: Form = {
      id: Date.now().toString(),
      title: `${form.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setForms([...forms, duplicatedForm]);
    
    toast({
      title: "Success",
      description: "Form duplicated successfully",
    });
  };

  const confirmDelete = (form: Form) => {
    setFormToDelete(form);
    setIsDeleteDialogOpen(true);
  };

  const deleteForm = () => {
    if (!formToDelete) return;
    
    setForms(forms.filter(form => form.id !== formToDelete.id));
    setIsDeleteDialogOpen(false);
    setFormToDelete(null);
    
    toast({
      title: "Success",
      description: "Form deleted successfully",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Forms</h1>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-[#4338ca] text-white hover:bg-[#4338ca]/90">
              <PlusCircle className="h-5 w-5" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Create New Form</DialogTitle>
              <DialogDescription>
                Give your form a clear and descriptive title.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Form Title</label>
                <Input 
                  id="title" 
                  value={newFormTitle} 
                  onChange={(e) => setNewFormTitle(e.target.value)} 
                  placeholder="Enter form title"
                  className="w-full"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="flex items-center gap-2 bg-[#4338ca] text-white hover:bg-[#4338ca]/90" onClick={createForm}>
                Create Form
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10 min-h-[45em]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No forms available</h3>
          <p className="mt-2 text-center text-muted-foreground">
            You haven't created any forms yet. Click the "Create Form" button to get started.
          </p>
          <Button 
            className="flex items-center gap-2 bg-[#4338ca] text-white hover:bg-[#4338ca]/90 mt-6"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create your first form
          </Button>
        </div>
      ) : (
        <div className="space-y-6 min-h-[45em]">
          <div className="rounded-md border shadow-sm overflow-hidden min-h-[45em]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Updated</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedForms.map((form) => (
                    <tr key={form.id} className="bg-card hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-4">
                        <a href={`/forms/edit/${form.id}`} className="font-medium text-primary hover:underline">
                          {form.title}
                        </a>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(form.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(form.updatedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => duplicateForm(form)} className="flex items-center gap-1 h-8">
                            <Copy className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Duplicate</span>
                          </Button>
                          <Button variant="ghost" size="sm" asChild className="flex items-center gap-1 h-8">
                            <a href={`/forms/edit/${form.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"></span>
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" asChild className="flex items-center gap-1 h-8">
                            <a href={`/forms/view/${form.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"></span>
                            </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => confirmDelete(form)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"></span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {forms.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <Pagination
                totalItems={forms.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the form "{formToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteForm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
