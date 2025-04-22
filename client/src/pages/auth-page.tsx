import { FC, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#121214] px-4 py-8">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Auth Forms */}
        <div>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login">
              <Card className="bg-[#1E1E22] border-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle>Login to your Account</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input 
                        id="login-username"
                        type="text"
                        placeholder="Enter your username" 
                        className="bg-[#121214] border-gray-700"
                        {...loginForm.register("username")}
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password"
                        type="password" 
                        placeholder="Enter your password"
                        className="bg-[#121214] border-gray-700"
                        {...loginForm.register("password")}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Log In"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            {/* Register Form */}
            <TabsContent value="register">
              <Card className="bg-[#1E1E22] border-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>Sign up to start buying and selling profiles</CardDescription>
                </CardHeader>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input 
                        id="register-username"
                        type="text" 
                        placeholder="Choose a username"
                        className="bg-[#121214] border-gray-700"
                        {...registerForm.register("username")}
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email"
                        type="email" 
                        placeholder="Enter your email"
                        className="bg-[#121214] border-gray-700"
                        {...registerForm.register("email")}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-fullname">Full Name (Optional)</Label>
                      <Input 
                        id="register-fullname"
                        type="text" 
                        placeholder="Enter your full name"
                        className="bg-[#121214] border-gray-700"
                        {...registerForm.register("fullName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password"
                        type="password" 
                        placeholder="Create a password"
                        className="bg-[#121214] border-gray-700"
                        {...registerForm.register("password")}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Hero Section */}
        <div className="hidden md:block">
          <div className="bg-gradient-to-br from-primary to-primary-700 p-8 rounded-xl text-white">
            <h1 className="text-3xl font-bold mb-6">The #1 Marketplace for Social Media Profiles</h1>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                  <i className="ri-shield-check-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                  <p className="text-white text-opacity-90">Our escrow service ensures safe transfers between buyers and sellers.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                  <i className="ri-check-double-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verified Profiles</h3>
                  <p className="text-white text-opacity-90">All profiles are verified for authenticity before being listed.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                  <i className="ri-group-line text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">10,000+ Profiles</h3>
                  <p className="text-white text-opacity-90">Join our community of buyers and sellers from around the world.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
