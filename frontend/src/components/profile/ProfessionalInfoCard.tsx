"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface ProfessionalInfoCardProps {
  user: {
    experience?: string
    education?: string
    skills?: string[]
  }
  isEditing: boolean
  formData: {
    experience: string
    education: string
    skills: string[]
  }
  onFormChange: (field: string, value: string | string[]) => void
}

export default function ProfessionalInfoCard({ user, isEditing, formData, onFormChange }: ProfessionalInfoCardProps) {
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      onFormChange("skills", [...formData.skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    onFormChange("skills", formData.skills.filter((skill) => skill !== skillToRemove))
  }

  const displaySkills = isEditing ? formData.skills : (user.skills || [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience (Optional)</Label>
          <Input
            id="experience"
            value={isEditing ? formData.experience : (user.experience || "")}
            onChange={(e) => onFormChange("experience", e.target.value)}
            placeholder="e.g., 5 years"
            disabled={!isEditing}
            maxLength={2000}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="education">Education (Optional)</Label>
          <Input
            id="education"
            value={isEditing ? formData.education : (user.education || "")}
            onChange={(e) => onFormChange("education", e.target.value)}
            placeholder="e.g., BS in Computer Science"
            disabled={!isEditing}
            maxLength={2000}
          />
        </div>
        <div className="space-y-2">
          <Label>Skills (Optional)</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {displaySkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                {skill}
                {isEditing && (
                  <button onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-emerald-600">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {displaySkills.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddSkill()
                  }
                }}
              />
              <Button type="button" onClick={handleAddSkill} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
