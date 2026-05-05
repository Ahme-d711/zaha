import { Bell, Globe, Shield, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsFormState } from "./settings.types";

interface SettingsTabsProps {
  form: SettingsFormState;
  setForm: React.Dispatch<React.SetStateAction<SettingsFormState>>;
}

export const SettingsTabs = ({ form, setForm }: SettingsTabsProps) => (
  <Tabs defaultValue="general" className="w-full">
    <TabsList className="bg-muted/50 p-1 rounded-xl w-full justify-start overflow-x-auto">
      <TabsTrigger value="general" className="rounded-lg gap-2"><Globe className="w-4 h-4" /> General</TabsTrigger>
      <TabsTrigger value="notifications" className="rounded-lg gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
      <TabsTrigger value="security" className="rounded-lg gap-2"><Shield className="w-4 h-4" /> Security</TabsTrigger>
      <TabsTrigger value="payments" className="rounded-lg gap-2"><Wallet className="w-4 h-4" /> Payments</TabsTrigger>
    </TabsList>
    <div className="mt-6 space-y-6">
      <TabsContent value="general" className="space-y-6">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Store Information</CardTitle>
            <CardDescription>Basic details about your online store.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-email">Contact Email</Label>
                <Input id="store-email" value={form.contactEmail} onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))} className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-phone">Contact Phone</Label>
                <Input id="store-phone" value={form.contactPhone} onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))} className="bg-muted/30" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Localization</CardTitle>
            <CardDescription>Default language and currency settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input id="tax-rate" type="number" value={form.taxRate} onChange={(e) => setForm((prev) => ({ ...prev, taxRate: Number(e.target.value) }))} className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping-cost">Shipping Cost</Label>
                <Input id="shipping-cost" type="number" value={form.shippingCost} onChange={(e) => setForm((prev) => ({ ...prev, shippingCost: Number(e.target.value) }))} className="bg-muted/30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card className="glass-card border-border/50">
          <CardHeader><CardTitle className="text-lg">Email Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>New Order Alert</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  </Tabs>
);
