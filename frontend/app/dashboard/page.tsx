"use client"

import ProtectedRoute from "../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
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
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Name: John Doe</p>
                <p className="text-gray-600 mb-2">Email: john@example.com</p>
                <Button className="mt-4">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
