"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Video, Eye } from "lucide-react"
import { ModalOverlay } from "@/components/modal/ModalOverlay"
import InputField from "@/components/form/InputField"
import SelectFieldWithLabel from "@/components/form/SelectFieldWithLabel"
import TextareaField from "@/components/form/TextareaField"
import type { Application } from "@/types"
import { useScheduleInterview } from "@/hooks"
import { toast } from "react-hot-toast"

interface InterviewSchedulingModalProps {
  application: Application
  trigger: React.ReactNode
  onSchedule?: (interviewData: any) => void
}

const DURATION_OPTIONS = [
  { label: "30 minutes", value: "30" },
  { label: "45 minutes", value: "45" },
  { label: "1 hour", value: "60" },
  { label: "1.5 hours", value: "90" },
  { label: "2 hours", value: "120" }
]

const PLATFORM_OPTIONS = [
  { label: "Zoom", value: "ZOOM" },
  { label: "Google Meet", value: "GOOGLE_MEET" },
  { label: "Microsoft Teams", value: "TEAMS" },
  { label: "Skype", value: "SKYPE" },
  { label: "Other", value: "OTHER" }
]

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

  const resetForm = () => {
    setDate("")
    setTime("")
    setDuration("60")
    setMeetingPlatform("ZOOM")
    setMeetingLink("")
    setLocation("")
    setNotes("")
  }

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
        resetForm()
        try {
          if (onSchedule) onSchedule(interviewData)
        } catch (err) {
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to schedule interview")
      },
    })
  }

  const isFormValid = () => {
    if (!date || !time) return false
    if (interviewType === "ONLINE" && (!meetingPlatform || !meetingLink)) return false
    if (interviewType === "PHYSICAL" && !location) return false
    return true
  }

  return (
    <ModalOverlay
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Schedule Interview"
      icon={<Eye className="h-5 w-5 text-emerald-500" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label className="text-sm font-medium">Interview Type</Label>
            <RadioGroup 
              value={interviewType} 
              onValueChange={(value: "ONLINE" | "PHYSICAL") => setInterviewType(value)} 
              className="flex gap-6 mt-2"
            >
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

          <div>
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
              <InputField
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
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
              <InputField
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <SelectFieldWithLabel
            id="duration"
            label="Duration (minutes)"
            options={DURATION_OPTIONS}
            value={duration}
            onChange={setDuration}
          />

          {interviewType === "ONLINE" && (
            <>
              <SelectFieldWithLabel
                id="platform"
                label="Meeting Platform"
                options={PLATFORM_OPTIONS}
                value={meetingPlatform}
                onChange={(value: any) => setMeetingPlatform(value)}
              />
              <InputField
                id="meetingLink"
                type="url"
                label="Meeting Link"
                placeholder="https://..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </>
          )}

          {interviewType === "PHYSICAL" && (
            <TextareaField
              id="location"
              label="Location"
              placeholder="Enter full address including building, street, city, state, zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="sm:col-span-2"
              rows={3}
            />
          )}

          <TextareaField
            id="notes"
            label="Notes (Optional)"
            placeholder="Any additional notes for the interview..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="sm:col-span-2"
            rows={2}
          />
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSchedule}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={!isFormValid() || scheduleInterviewMutation.isPending}
          >
            {scheduleInterviewMutation.isPending ? "Scheduling..." : "Schedule Interview"}
          </Button>
        </div>
      </div>
    </ModalOverlay>
  )
}