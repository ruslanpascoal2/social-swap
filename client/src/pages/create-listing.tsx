import { FC, useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Loader2 } from "lucide-react";
import { InsertProfile, Platform, Category } from "@shared/schema";
import SocialPlatformIcon from "@/components/ui/social-platform-icon";

// Create a schema for profile listing
const profileSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  platformId: z.coerce.number().min(1, "Please select a platform"),
  categoryId: z.coerce.number().min(1, "Please select a category"),
  followers: z.coerce.number().min(100, "Profile must have at least 100 followers"),
  engagement: z.coerce.number().min(0.1, "Engagement rate must be at least 0.1%").max(100, "Engagement rate cannot exceed 100%"),
  price: z.coerce.number().min(500, "Minimum price is $5.00").transform(value => value * 100), // Convert dollars to cents
  age: z.string().min(1, "Please specify the account age"),
  weeklyPosts: z.string().min(1, "Please specify the posting frequency"),
  isFeatured: z.boolean().default(false),
  isHot: z.boolean().default(false),
  coverImageUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CreateListing: FC = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Fetch platforms
  const { data: platforms, isLoading: isPlatformsLoading } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Form definition
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: "",
      description: "",
      platformId: 0,
      categoryId: 0,
      followers: 0,
      engagement: 0,
      price: 0,
      age: "",
      weeklyPosts: "",
      isFeatured: false,
      isHot: false,
      coverImageUrl: "",
    },
  });

  // Create profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await apiRequest("POST", "/api/profiles", data);
      return await response.json();
    },
    onSuccess: () => {
      setSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      toast({
        title: "Profile listed successfully",
        description: "Your profile has been added to the marketplace",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      setSubmitting(false);
      toast({
        title: "Error creating listing",
        description: error.message || "Could not create profile listing",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    setSubmitting(true);
    createProfileMutation.mutate(data);
  };

  if (isPlatformsLoading || isCategoriesLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6 bg-[#1E1E22] border-gray-700" onClick={() => navigate("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card className="bg-[#1E1E22] border-gray-800 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Create Profile Listing</CardTitle>
            <CardDescription>
              Fill out the form below to list your social media profile for sale
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Fashion & Lifestyle Instagram Account with 10K Followers" 
                            className="bg-[#121214] border-gray-700"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Create a compelling title that describes your profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="platformId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#121214] border-gray-700">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1E1E22] border-gray-700">
                              <SelectGroup>
                                <SelectLabel>Social Platforms</SelectLabel>
                                {platforms?.map((platform) => (
                                  <SelectItem key={platform.id} value={platform.id.toString()}>
                                    <div className="flex items-center gap-2">
                                      <SocialPlatformIcon platform={platform.name} />
                                      <span>{platform.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#121214] border-gray-700">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1E1E22] border-gray-700">
                              <SelectGroup>
                                <SelectLabel>Content Categories</SelectLabel>
                                {categories?.map((category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your profile, content focus, audience demographics, monetization history, and any other important details..." 
                            className="bg-[#121214] border-gray-700 min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description to attract potential buyers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Profile Metrics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="followers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Followers Count</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 10000" 
                              className="bg-[#121214] border-gray-700"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Total number of followers/subscribers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="engagement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Engagement Rate (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="e.g., 3.5" 
                              className="bg-[#121214] border-gray-700"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Average engagement rate as a percentage
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Age</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 2 years" 
                              className="bg-[#121214] border-gray-700"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How long the account has been active
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weeklyPosts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly Posts</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 3-5" 
                              className="bg-[#121214] border-gray-700"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Average number of posts per week
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing & Settings</h3>
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="e.g., 1999.99" 
                              className="bg-[#121214] border-gray-700 pl-7"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Set a competitive price for your profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border border-gray-700">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Listing</FormLabel>
                            <FormDescription>
                              Highlight your profile in the featured section
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isHot"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border border-gray-700">
                          <div className="space-y-0.5">
                            <FormLabel>Mark as Hot</FormLabel>
                            <FormDescription>
                              Tag your listing as a hot deal
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Listing...
                    </>
                  ) : (
                    "Create Listing"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateListing;
