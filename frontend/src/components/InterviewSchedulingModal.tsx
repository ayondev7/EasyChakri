"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, MapPin, Video, Eye } from "lucide-react"
import { stripParenthesizedCompany } from "@/utils/utils"
import type { Application } from "@/types"
import { useScheduleInterview } from "@/hooks"
import { toast } from "react-hot-toast"

interface InterviewSchedulingModalProps {
  application: Application
  trigger: React.ReactNode
  onSchedule?: (interviewData: any) => void
}

export function InterviewSchedulingModal({ application, trigger, onSchedule }: InterviewSchedulingModalProps) {
  const [open, setOpen] = useState(false)
  const [interviewType, setInterviewType] = useState<"ONLINE" | "PHYSICAL">("ONLINE")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("60")
  const [meetingPlatform, setMeetingPlatform] = useState<"ZOOM" | "GOOGLE_MEET" | "TEAMS" | "SKYPE" | "OTHER">("ZOOM")
  const [meetingLink, setMeetingLink] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")

  const scheduleInterviewMutation = useScheduleInterview()

  const handleSchedule = () => {
    const interviewData = {
      applicationId: application.id,
      type: interviewType,
      scheduledAt: new Date(`${date}T${time}`),
      duration: parseInt(duration),
      platform: interviewType === "ONLINE" ? meetingPlatform : undefined,
      meetingLink: interviewType === "ONLINE" ? meetingLink : undefined,
      location: interviewType === "PHYSICAL" ? location : undefined,
      notes: notes || undefined,
    }

    scheduleInterviewMutation.mutate(interviewData, {
      onSuccess: () => {
        toast.success("Interview scheduled successfully")
        setOpen(false)
        setDate("")
        setTime("")
        setDuration("60")
        setMeetingPlatform("ZOOM")
        setMeetingLink("")
        setLocation("")
        setNotes("")
        // Call optional callback so parent can react to scheduling
        try {
          if (onSchedule) onSchedule(interviewData)
        } catch (err) {
          // ignore callback errors
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to schedule interview")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-emerald-500" />
            Schedule Interview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Candidate Details</h3>
            <p className="text-sm text-gray-600">{stripParenthesizedCompany(application.job.title)}</p>
            <p className="text-sm text-gray-600">Applied: {new Date(application.appliedAt).toLocaleDateString()}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Interview Type</Label>
              <RadioGroup value={interviewType} onValueChange={(value: "ONLINE" | "PHYSICAL") => setInterviewType(value)} className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ONLINE" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                    <Video className="h-4 w-4" />
                    Online
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PHYSICAL" id="physical" />
                  <Label htmlFor="physical" className="flex items-center gap-2 cursor-pointer">
                    <MapPin className="h-4 w-4" />
                    Physical
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interviewType === "ONLINE" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform" className="text-sm font-medium">Meeting Platform</Label>
                  <Select value={meetingPlatform} onValueChange={(value: any) => setMeetingPlatform(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZOOM">Zoom</SelectItem>
                      <SelectItem value="GOOGLE_MEET">Google Meet</SelectItem>
                      <SelectItem value="TEAMS">Microsoft Teams</SelectItem>
                      <SelectItem value="SKYPE">Skype</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="meetingLink" className="text-sm font-medium">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    type="url"
                    placeholder="https://..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {interviewType === "PHYSICAL" && (
              <div>
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Textarea
                  id="location"
                  placeholder="Enter full address including building, street, city, state, zip code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes for the interview..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={!date || !time || (interviewType === "ONLINE" && (!meetingPlatform || !meetingLink)) || (interviewType === "PHYSICAL" && !location) || scheduleInterviewMutation.isPending}
            >
              {scheduleInterviewMutation.isPending ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}