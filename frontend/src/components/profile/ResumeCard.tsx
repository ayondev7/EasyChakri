"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText } from "lucide-react"

interface ResumeCardProps {
  user: {
    resume?: string
  }
  isEditing: boolean
  formData: {
    resume: string
  }
  onFormChange: (field: string, value: string) => void
}

export default function ResumeCard({ user, isEditing, formData, onFormChange }: ResumeCardProps) {
  const currentResume = isEditing ? formData.resume : (user.resume || "")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume">Resume Link (Google Drive)</Label>
              <Input
                id="resume"
                type="url"
                value={formData.resume}
                onChange={(e) => onFormChange("resume", e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="text-xs text-muted-foreground">
                Upload your resume (PDF format) to Google Drive and paste the public link here. 
                Make sure to set the file to &quot;Anyone with the link can view&quot;.
              </p>
            </div>
            {currentResume && (
              <div className="flex items-center gap-2 p-4 rounded-lg border border-border/40 bg-muted/30">
                <FileText className="h-5 w-5 text-cyan-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Current Resume</p>
                  <p className="text-xs text-muted-foreground truncate">{currentResume}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a href={currentResume} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            {currentResume ? (
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/40">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-cyan-500" />
                  <div>
                    <p className="font-medium">Resume</p>
                    <p className="text-sm text-muted-foreground">View your uploaded resume</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={currentResume} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </a>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">No resume uploaded</p>
                <p className="text-xs text-muted-foreground">Click &quot;Edit Profile&quot; to add your resume</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
