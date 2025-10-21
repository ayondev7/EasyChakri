"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PersonalInfoCardProps {
  user: {
    name: string
    email: string
    phone?: string
    location?: string
    bio?: string
  }
  isEditing: boolean
  formData: {
    name: string
    phone: string
    location: string
    bio: string
  }
  onFormChange: (field: string, value: string) => void
}

export default function PersonalInfoCard({ user, isEditing, formData, onFormChange }: PersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={isEditing ? formData.name : user.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={isEditing ? formData.phone : (user.phone || "")}
              onChange={(e) => onFormChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={isEditing ? formData.location : (user.location || "")}
              onChange={(e) => onFormChange("location", e.target.value)}
              placeholder="City, State"
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={isEditing ? formData.bio : (user.bio || "")}
            onChange={(e) => onFormChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  )
}
