import { FC, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Profile, 
  Platform, 
  Category, 
  User,
  InsertMessage
} from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Heart, Send, User as UserIcon, Users, Calendar, BarChart3 } from "lucide-react";
import SocialPlatformIcon from "@/components/ui/social-platform-icon";
import ProfileGrid from "@/components/profiles/profile-grid";

const messageSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(10, "Message must be at least 10 characters")
});

type MessageFormValues = z.infer<typeof messageSchema>;

const ProfileDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const profileId = parseInt(id);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  
  // Fetch profile data
  const { data: profile, isLoading: isProfileLoading } = useQuery<Profile>({
    queryKey: [`/api/profiles/${profileId}`],
    enabled: !isNaN(profileId),
  });
  
  // Fetch platform data
  const { data: platform, isLoading: isPlatformLoading } = useQuery<Platform>({
    queryKey: ["/api/platforms", profile?.platformId],
    enabled: !!profile?.platformId,
  });
  
  // Fetch category data
  const { data: category, isLoading: isCategoryLoading } = useQuery<Category>({
    queryKey: ["/api/categories", profile?.categoryId],
    enabled: !!profile?.categoryId,
  });
  
  // Fetch seller data
  const { data: seller, isLoading: isSellerLoading } = useQuery<User>({
    queryKey: ["/api/users", profile?.userId],
    enabled: !!profile?.userId,
  });
  
  // Fetch similar profiles
  const { data: allProfiles, isLoading: isAllProfilesLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
    enabled: !!profile,
  });
  
  const similarProfiles = allProfiles
    ?.filter(p => p.id !== profileId && (p.platformId === profile?.platformId || p.categoryId === profile?.categoryId))
    .slice(0, 3) || [];
  
  // Contact seller mutation
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      subject: "",
      content: ""
    }
  });
  
  const contactSellerMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      if (!profile || !user) return;
      
      const message: Omit<InsertMessage, "fromUserId"> = {
        subject: data.subject,
        content: data.content,
        toUserId: profile.userId,
        profileId: profile.id
      };
      
      await apiRequest("POST", "/api/messages", message);
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the seller",
      });
      setIsMessageDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Could not send message",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: MessageFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to contact the seller",
        variant: "destructive",
      });
      return;
    }
    
    contactSellerMutation.mutate(data);
  };
  
  // Format price
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Format followers count
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  if (isProfileLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              The profile you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/">
              <Button className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/">
        <Button variant="outline" className="mb-6 bg-[#1E1E22] border-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1E1E22] rounded-xl overflow-hidden border border-gray-800">
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-900"></div>
              {platform && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 rounded-full px-3 py-1.5 flex items-center">
                  <SocialPlatformIcon platform={platform.name} size="md" className="mr-2" />
                  <span className="font-medium">{platform.name}</span>
                </div>
              )}
              {profile.isFeatured && (
                <div className="absolute top-4 left-4 bg-primary rounded-full px-3 py-1.5">
                  <span className="font-medium">Featured</span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{profile.title}</h1>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="flex items-center gap-1 mr-4">
                      <UserIcon className="h-4 w-4" /> {formatFollowers(profile.followers)} followers
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {profile.engagement.toFixed(1)}% engagement
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-500">{formatPrice(profile.price)}</div>
              </div>
              
              <Tabs defaultValue="description" className="w-full">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="py-4">
                  <p className="text-gray-300 whitespace-pre-line mb-6">{profile.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#121214] rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Category</p>
                      <p className="font-medium">{category?.name || "Unknown"}</p>
                    </div>
                    <div className="bg-[#121214] rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Platform</p>
                      <p className="font-medium">{platform?.name || "Unknown"}</p>
                    </div>
                    <div className="bg-[#121214] rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Account Age</p>
                      <p className="font-medium">{profile.age}</p>
                    </div>
                    <div className="bg-[#121214] rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Weekly Posts</p>
                      <p className="font-medium">{profile.weeklyPosts}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="stats" className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#121214] rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Audience Growth</h3>
                      </div>
                      <div className="h-48 flex items-end gap-1">
                        {[35, 40, 60, 45, 55, 70, 65, 90, 85, 100].map((height, i) => (
                          <div key={i} className="flex-1 bg-primary-800 hover:bg-primary rounded-t-sm transition-colors" style={{ height: `${height}%` }}></div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Nov</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#121214] rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Engagement Metrics</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Likes</span>
                            <span className="text-sm text-gray-400">7.2%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Comments</span>
                            <span className="text-sm text-gray-400">3.8%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-pink-500 h-2 rounded-full" style={{ width: "38%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Shares</span>
                            <span className="text-sm text-gray-400">2.1%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "21%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Saves</span>
                            <span className="text-sm text-gray-400">1.5%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Similar Profiles */}
          <div className="bg-[#1E1E22] rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-6">Similar Profiles</h2>
            <ProfileGrid 
              profiles={similarProfiles}
              isLoading={isAllProfilesLoading}
              compact
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-[#1E1E22] border-gray-800">
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {seller?.fullName?.charAt(0) || seller?.username?.charAt(0) || "S"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{seller?.fullName || seller?.username || "Seller"}</p>
                  <p className="text-sm text-gray-400">Member since 2022</p>
                </div>
              </div>
              
              <div className="py-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Response Rate</span>
                  <span className="text-sm">98%</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Average Response Time</span>
                  <span className="text-sm">3 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Successful Sales</span>
                  <span className="text-sm">24</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-3">
              <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Contact Seller
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1E1E22] border-gray-800">
                  <DialogHeader>
                    <DialogTitle>Contact Seller</DialogTitle>
                    <DialogDescription>
                      Send a message to the seller about this profile
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="Enter message subject"
                          className="bg-[#121214] border-gray-700"
                          {...form.register("subject")}
                        />
                        {form.formState.errors.subject && (
                          <p className="text-sm text-red-500">{form.formState.errors.subject.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Write your message here" 
                          rows={5}
                          className="bg-[#121214] border-gray-700"
                          {...form.register("content")}
                        />
                        {form.formState.errors.content && (
                          <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={contactSellerMutation.isPending}
                      >
                        {contactSellerMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full bg-[#121214] border-gray-700">
                <Heart className="mr-2 h-4 w-4" /> Add to Watchlist
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-[#1E1E22] border-gray-800">
            <CardHeader>
              <CardTitle>Security & Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 bg-opacity-10 rounded p-2 text-green-500">
                  <i className="ri-shield-check-line text-xl"></i>
                </div>
                <div>
                  <p className="font-medium mb-1">Secure Escrow</p>
                  <p className="text-sm text-gray-400">Your payment is held securely until the transfer is complete.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 bg-opacity-10 rounded p-2 text-blue-500">
                  <i className="ri-file-check-line text-xl"></i>
                </div>
                <div>
                  <p className="font-medium mb-1">Verified Profile</p>
                  <p className="text-sm text-gray-400">This profile has been verified for authenticity and metrics.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-yellow-500 bg-opacity-10 rounded p-2 text-yellow-500">
                  <i className="ri-exchange-line text-xl"></i>
                </div>
                <div>
                  <p className="font-medium mb-1">Seamless Transfer</p>
                  <p className="text-sm text-gray-400">We guide you through the transfer process step by step.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
