// // "use client"

// // import { useEffect, useState } from "react"
// // import ProtectedRoute from "../components/ProtectedRoute"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// // import { Calendar, Mail, Phone } from "lucide-react"
// // import { useRouter } from "next/navigation"

// // // Define UserProfile type
// // type UserProfile = {
// //   name: string
// //   family_name?: string
// //   middle_name?: string
// //   email: string
// //   phone_number?: string
// //   birthdate?: string
// // }

// // export default function Dashboard() {
// //   const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
// //   const router = useRouter()

// //   useEffect(() => {
// //     // Fetch user profile from backend
// //     const fetchUserProfile = async () => {
// //       try {
// //         const response = await fetch("http://localhost:8000/api/user-profile", {
// //           method: "GET",
// //           credentials: "include",
// //         })

// //         if (!response.ok) {
// //           throw new Error("Failed to fetch profile")
// //         }

// //         const data: UserProfile = await response.json()
// //         setUserProfile(data)
// //       } catch (error) {
// //         console.error("Error fetching profile:", error)
// //         router.push("/login")
// //       }
// //     }

// //     fetchUserProfile()
// //   }, [router])

// //   return (
// //     <div className="max-w-4xl mx-auto p-6">
// //       <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
// //       <ProtectedRoute>
// //         <Tabs defaultValue="tickets">
// //           <TabsList className="mb-8">
// //             <TabsTrigger value="tickets">My Tickets</TabsTrigger>
// //             <TabsTrigger value="account">Account Settings</TabsTrigger>
// //           </TabsList>
// //           <TabsContent value="tickets">
// //             <div className="grid gap-6">
// //               <Card>
// //                 <CardHeader>
// //                   <CardTitle>Event Title</CardTitle>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <p className="text-gray-600 mb-2">Date: June 15, 2023</p>
// //                   <p className="text-gray-600 mb-4">Location: New York, NY</p>
// //                   <Button variant="outline">View Ticket</Button>
// //                 </CardContent>
// //               </Card>
// //             </div>
// //           </TabsContent>
// //           <TabsContent value="account">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-2xl">Account Information</CardTitle>
// //               </CardHeader>
// //               <CardContent className="pt-4">
// //                 <div className="flex items-start justify-between mb-8">
// //                   <div className="flex gap-6">
// //                     <Avatar className="w-24 h-24 border-4 border-muted">
// //                       <AvatarImage src="/placeholder.svg" />
// //                       <AvatarFallback>
// //                         {userProfile?.name ? userProfile.name[0] : "?"}
// //                         {userProfile?.family_name ? userProfile.family_name[0] : "?"}
// //                       </AvatarFallback>
// //                     </Avatar>
// //                     <div className="space-y-4">
// //                       <h2 className="text-xl font-semibold">
// //                         {userProfile?.name} {userProfile?.middle_name || ""} {userProfile?.family_name}
// //                       </h2>
// //                       <div className="space-y-3 text-muted-foreground">
// //                         <div className="flex items-center gap-3">
// //                           <Mail className="w-5 h-5 text-gray-500" />
// //                           <span>{userProfile?.email}</span>
// //                         </div>
// //                         <div className="flex items-center gap-3">
// //                           <Phone className="w-5 h-5 text-gray-500" />
// //                           <span>{userProfile?.phone_number || "Not provided"}</span>
// //                         </div>
// //                         <div className="flex items-center gap-3">
// //                           <Calendar className="w-5 h-5 text-gray-500" />
// //                           <span>
// //                             {userProfile?.birthdate
// //                               ? new Date(userProfile.birthdate).toLocaleDateString()
// //                               : "Not provided"}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <Button variant="outline">Edit Profile</Button>
// //                 </div>
// //                 <div className="space-y-6 border-t pt-6">
// //                   <div>
// //                     <h3 className="text-lg font-medium mb-3">Security Settings</h3>
// //                     <Button variant="outline">Change Password</Button>
// //                   </div>
// //                   <div>
// //                     <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
// //                     <Button variant="outline">Manage Notifications</Button>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </TabsContent>
// //         </Tabs>
// //       </ProtectedRoute>
// //     </div>
// //   )
// // }


// "use client"

// import { useEffect, useState } from "react"
// import ProtectedRoute from "../components/ProtectedRoute"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Calendar, Mail, Phone } from "lucide-react"
// import { useRouter } from "next/navigation"

// // Define UserProfile type
// type UserProfile = {
//   name: string
//   family_name?: string
//   middle_name?: string
//   email: string
//   phone_number?: string
//   birthdate?: string
// }

// export default function Dashboard() {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     // Fetch user profile from backend
//     const fetchUserProfile = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/user-profile", {
//           method: "GET",
//           credentials: "include",
//         })

//         if (!response.ok) {
//           throw new Error("Failed to fetch profile")
//         }

//         const data: UserProfile = await response.json()
//         setUserProfile(data)
//       } catch (error) {
//         console.error("Error fetching profile:", error)
//         router.push("/login")
//       }
//     }

//     fetchUserProfile()
//   }, [router])

//   const handleEditProfile = () => {
//     router.push("/edit-profile")
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
//       <ProtectedRoute>
//         <Tabs defaultValue="tickets">
//           <TabsList className="mb-8">
//             <TabsTrigger value="tickets">My Tickets</TabsTrigger>
//             <TabsTrigger value="account">Account Settings</TabsTrigger>
//           </TabsList>
//           <TabsContent value="tickets">
//             <div className="grid gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Event Title</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-600 mb-2">Date: June 15, 2023</p>
//                   <p className="text-gray-600 mb-4">Location: New York, NY</p>
//                   <Button variant="outline">View Ticket</Button>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//           <TabsContent value="account">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-2xl">Account Information</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-4">
//                 <div className="flex items-start justify-between mb-8">
//                   <div className="flex gap-6">
//                     <Avatar className="w-24 h-24 border-4 border-muted">
//                       <AvatarImage src="/placeholder.svg" />
//                       <AvatarFallback>
//                         {userProfile?.name ? userProfile.name[0] : "?"}
//                         {userProfile?.family_name ? userProfile.family_name[0] : "?"}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="space-y-4">
//                       <h2 className="text-xl font-semibold">
//                         {userProfile?.name} {userProfile?.middle_name || ""} {userProfile?.family_name}
//                       </h2>
//                       <div className="space-y-3 text-muted-foreground">
//                         <div className="flex items-center gap-3">
//                           <Mail className="w-5 h-5 text-gray-500" />
//                           <span>{userProfile?.email}</span>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <Phone className="w-5 h-5 text-gray-500" />
//                           <span>{userProfile?.phone_number || "Not provided"}</span>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <Calendar className="w-5 h-5 text-gray-500" />
//                           <span>
//                             {userProfile?.birthdate
//                               ? new Date(userProfile.birthdate).toLocaleDateString()
//                               : "Not provided"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <Button variant="outline" onClick={handleEditProfile}>
//                     Edit Profile
//                   </Button>
//                 </div>
//                 <div className="space-y-6 border-t pt-6">
//                   <div>
//                     <h3 className="text-lg font-medium mb-3">Security Settings</h3>
//                     <Button variant="outline">Change Password</Button>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
//                     <Button variant="outline">Manage Notifications</Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </ProtectedRoute>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

// Define UserProfile type
type UserProfile = {
  name: string
  family_name?: string
  middle_name?: string
  email: string
  phone_number?: string
  birthdate?: string
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch user profile from backend
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user-profile", {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data: UserProfile = await response.json()
        setUserProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        router.push("/login")
      }
    }

    fetchUserProfile()
  }, [router])

  const handleEditProfile = () => {
    router.push("/edit-profile")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <ProtectedRoute>
        <Tabs defaultValue="tickets">
          <TabsList className="mb-8">
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tickets">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">Date: June 15, 2023</p>
                  <p className="text-gray-600 mb-4">Location: New York, NY</p>
                  <Button variant="outline">View Ticket</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <Avatar className="w-24 h-24 border-4 border-muted">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {userProfile?.name ? userProfile.name[0] : "?"}
                        {userProfile?.family_name ? userProfile.family_name[0] : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">
                        {userProfile?.name} {userProfile?.middle_name || ""} {userProfile?.family_name}
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-500" />
                          <span>{userProfile?.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <span>{userProfile?.phone_number || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          <span>
                            {userProfile?.birthdate
                              ? new Date(userProfile.birthdate).toLocaleDateString()
                              : "Not provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleEditProfile}>
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ProtectedRoute>
    </div>
  )
}





