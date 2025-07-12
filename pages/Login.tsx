import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Server returned an invalid response. Please check your credentials and try again.",
          variant: "destructive",
        });
        return;
      }
      setIsLoading(false);
      if (!res.ok) {
        toast({
          title: "Error",
          description: data?.message || "Login failed.",
          variant: "destructive",
        });
        return;
      }
      localStorage.setItem('token', data.token);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset link would be sent to your email.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Welcome Back
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Sign in to your account to continue skill swapping
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-primary hover:underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}