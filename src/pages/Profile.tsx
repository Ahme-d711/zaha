import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, MapPin, Camera, Save, LogOut, ShoppingBag, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Ahmed Elgedawy",
      email: "ahmed@example.com",
      phone: "+20 1018939831",
      address: "Cairo, Egypt",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Profile update:", data);
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-[calc(100vh-80px)] section-padding py-12 bg-background/50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <motion.div variants={itemVariants} className="w-full md:w-1/3">
            <Card className="glass-card border-accent/10 sticky top-24">
              <CardContent className="pt-8 pb-8 flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-accent/20 shadow-xl overflow-hidden">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-accent text-white text-4xl font-bold">
                      AM
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-white shadow-lg hover:bg-accent/90 transition-all scale-0 group-hover:scale-100 origin-bottom-right">
                    <Camera size={18} />
                  </button>
                </div>
                <h2 className="text-2xl font-bold font-playfair mt-4 text-foreground">Ahmed Mohamed</h2>
                <p className="text-muted-foreground">Premium Member</p>
                
                <div className="w-full h-px bg-border/30 my-6" />
                
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 text-sm text-foreground/70">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-accent" />
                    </div>
                    <span>12 Orders</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/70">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Star className="w-4 h-4 text-accent" />
                    </div>
                    <span>4 Reviews Written</span>
                  </div>
                </div>

                <div className="w-full pt-8">
                   <Button variant="outline" className="w-full flex items-center gap-2 border-destructive/20 text-destructive hover:bg-destructive/10">
                    <LogOut size={18} />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Profile Form */}
          <motion.div variants={itemVariants} className="w-full md:w-2/3">
            <Card className="glass-card-hover border-accent/10 overflow-hidden">
              <CardHeader className="bg-accent/5 pb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-3xl font-bold font-playfair tracking-tight">
                      <span className="gradient-text">Profile Information</span>
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Manage your personal details and preferences
                    </CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "ghost" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "text-muted-foreground" : "border-accent/20 text-accent hover:bg-accent/5"}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-foreground/80">
                              <User size={16} className="text-accent" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                                className="h-11 bg-background/50 border-border/50 focus-visible:ring-accent disabled:opacity-80"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-foreground/80">
                              <Mail size={16} className="text-accent" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                                className="h-11 bg-background/50 border-border/50 focus-visible:ring-accent disabled:opacity-80"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-foreground/80">
                              <Phone size={16} className="text-accent" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                                className="h-11 bg-background/50 border-border/50 focus-visible:ring-accent disabled:opacity-80"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-foreground/80">
                              <MapPin size={16} className="text-accent" />
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                                className="h-11 bg-background/50 border-border/50 focus-visible:ring-accent disabled:opacity-80"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <AnimatePresence>
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 flex justify-end"
                        >
                          <Button 
                            type="submit" 
                            className="bg-accent hover:bg-accent/90 text-white min-w-[150px] h-11 shadow-lg shadow-accent/20 flex items-center gap-2"
                          >
                            <Save size={18} />
                            Save Changes
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </Form>

                <div className="mt-12 pt-8 border-t border-border/30">
                  <h3 className="text-xl font-bold font-playfair mb-4">Account Security</h3>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 2 months ago</p>
                      </div>
                    </div>
                    <Button variant="outline" className="h-9">Change Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
