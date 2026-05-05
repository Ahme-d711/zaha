import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsTabs } from "../components/SettingsTabs";
import { SettingsFormState, defaultSettingsFormState } from "../components/settings.types";

export const SettingsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-settings"],
    queryFn: () => dashboardManagementService.getSettings(),
  });
  const [form, setForm] = useState<SettingsFormState>(defaultSettingsFormState);

  useEffect(() => {
    if (!data?.data) return;
    setForm({
      contactEmail: data.data.contactEmail ?? "",
      contactPhone: data.data.contactPhone ?? "",
      shippingCost: data.data.shippingCost ?? 0,
      taxRate: data.data.taxRate ?? 0,
      freeShippingThreshold: data.data.freeShippingThreshold ?? 0,
      currency: data.data.currency ?? "EGP",
    });
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () => dashboardManagementService.updateSettings(form),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SettingsHeader onSave={() => updateMutation.mutate()} isSaving={updateMutation.isPending} />
        {isLoading && <div className="py-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>}
        {isError && <p className="text-sm text-destructive">Failed to load settings.</p>}
        <SettingsTabs form={form} setForm={setForm} />
      </div>
    </DashboardLayout>
  );
};
