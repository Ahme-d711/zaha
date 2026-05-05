import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import { UserDetailsDialog } from "../components/UserDetailsDialog";
import { UserFormDialog } from "../components/UserFormDialog";
import { UsersHeader } from "../components/UsersHeader";
import { UsersTable } from "../components/UsersTable";
import { UserFormState, defaultUserFormState } from "../components/users.types";

const toPayload = (form: UserFormState) => {
  const payload = new FormData();
  payload.append("name", form.name);
  payload.append("email", form.email);
  payload.append("phone", form.phone);
  payload.append("role", form.role);
  payload.append("isActive", String(form.isActive));
  return payload;
};

export const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<UserFormState>(defaultUserFormState);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-users", search],
    queryFn: () => dashboardManagementService.getUsers({ search, limit: 50 }),
  });
  const users = data?.data?.users ?? [];

  const selectedUserQuery = useQuery({
    queryKey: ["dashboard-user", selectedUserId],
    queryFn: () => dashboardManagementService.getUserById(selectedUserId as string),
    enabled: !!selectedUserId,
  });

  const createUserMutation = useMutation({
    mutationFn: (payload: FormData) => dashboardManagementService.createUser(payload),
    onSuccess: () => {
      setAddOpen(false);
      setForm(defaultUserFormState);
      queryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
    },
  });
  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      dashboardManagementService.updateUser(id, payload),
    onSuccess: () => {
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
    },
  });

  const openEditDialog = (id: string) => {
    const current = users.find((user) => user._id === id);
    if (!current) return;
    setSelectedUserId(id);
    setForm({
      name: current.name,
      email: current.email,
      phone: current.phone ?? "",
      role: current.role,
      isActive: current.isActive,
    });
    setEditOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UsersHeader onAdd={() => setAddOpen(true)} />
        <UsersTable
          users={users}
          search={search}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onView={(id) => {
            setSelectedUserId(id);
            setViewOpen(true);
          }}
          onEdit={openEditDialog}
        />
      </div>

      <UserDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        isLoading={selectedUserQuery.isLoading}
        user={selectedUserQuery.data?.data.user}
      />

      <UserFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add User"
        description="Create a new dashboard user."
        form={form}
        setForm={setForm}
        isSubmitting={createUserMutation.isPending}
        submitLabel="Create User"
        onSubmit={() => createUserMutation.mutate(toPayload(form))}
      />

      <UserFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit User"
        description="Update user details."
        form={form}
        setForm={setForm}
        isSubmitting={updateUserMutation.isPending}
        submitLabel="Save Changes"
        onSubmit={() =>
          selectedUserId &&
          updateUserMutation.mutate({ id: selectedUserId, payload: toPayload(form) })
        }
      />
    </DashboardLayout>
  );
};
