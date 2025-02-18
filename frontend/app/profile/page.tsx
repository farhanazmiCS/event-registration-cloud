// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar, Mail, Phone } from "lucide-react";

// // Define UserProfile type
// type UserProfile = {
//   name: string;
//   family_name?: string;
//   middle_name?: string;
//   email: string;
//   phone_number?: string;
//   birthdate?: string;
// };

// export default function ProfilePage() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");

//     if (!token) {
//       router.push("/login");
//       return;
//     } else {
//       setIsLoggedIn(true);
//     }

//     // Fetch user profile from backend
//     const fetchUserProfile = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/user-profile", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch profile");
//         }

//         const data: UserProfile = await response.json(); // TypeScript now knows the type
//         setUserProfile(data);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         router.push("/login");
//       }
//     };

//     fetchUserProfile();
//   }, [router]);

//   if (!isLoggedIn || !userProfile) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <Card className="mb-8">
//         <CardHeader className="relative pb-8 border-b">
//           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-primary/60"></div>
//           <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 pt-20">
//             <Avatar className="w-24 h-24 border-4 border-background">
//               <AvatarImage src="/placeholder.svg" />
//               <AvatarFallback>
//                 {userProfile?.name ? userProfile.name[0] : "?"}
//                 {userProfile?.family_name ? userProfile.family_name[0] : "?"}
//               </AvatarFallback>
//             </Avatar>
//             <div className="space-y-1">
//               <h1 className="text-2xl font-bold">
//                 {userProfile?.name} {userProfile?.middle_name || ""} {userProfile?.family_name}
//               </h1>
//               <div className="flex flex-wrap gap-4 text-muted-foreground">
//                 <div className="flex items-center gap-1">
//                   <Mail className="w-4 h-4" />
//                   {userProfile?.email}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Phone className="w-4 h-4" />
//                   {userProfile?.phone_number}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   {userProfile?.birthdate ? new Date(userProfile.birthdate).toLocaleDateString() : "N/A"}
//                 </div>
//               </div>
//             </div>
//             <Button className="md:ml-auto" variant="outline">
//               Edit Profile
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <Tabs defaultValue="events" className="w-full">
//             <TabsList className="w-full justify-start">
//               <TabsTrigger value="events">My Events</TabsTrigger>
//             </TabsList>
//             <TabsContent value="events" className="mt-6">
//               <p>Events section will be updated later.</p>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, Phone } from "lucide-react";

// Define UserProfile type
type UserProfile = {
  name: string;
  family_name?: string;
  middle_name?: string;
  email: string;
  phone_number?: string;
  birthdate?: string;
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user profile from backend (Using cookies)
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user-profile", {
          method: "GET",
          credentials: "include", // ✅ Automatically sends HTTP-only cookies
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data: UserProfile = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/login");
      }
    };

    fetchUserProfile();
  }, [router]);

  if (!userProfile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="relative pb-8 border-b">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-primary/60"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 pt-20">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {userProfile?.name ? userProfile.name[0] : "?"}
                {userProfile?.family_name ? userProfile.family_name[0] : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">
                {userProfile?.name} {userProfile?.middle_name || ""} {userProfile?.family_name}
              </h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {userProfile?.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {userProfile?.phone_number}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {userProfile?.birthdate ? new Date(userProfile.birthdate).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
            <Button className="md:ml-auto" variant="outline">
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="events">My Events</TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="mt-6">
              <p>Events section will be updated later.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
