"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApplication } from "@/hooks/applicationHooks"
import { useUpdateApplicationStatus } from "@/hooks/applicationHooks"
import type { Application } from "@/types"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Download,
  Calendar,
  Eye,
  User as UserIcon,
} from "lucide-react"
import { formatDate, getInitials } from "@/utils/utils"
import { InterviewSchedulingModal } from "@/components/InterviewSchedulingModal"
import Loader from "@/components/Loader"

export default function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: applicationData, isLoading: appLoading, refetch } = useApplication(id);
  const updateStatusMutation = useUpdateApplicationStatus();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.push("/auth/signin");
      return;
    }

    if (user.role !== "RECRUITER") {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, user, router, authLoading]);

  if (authLoading || appLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "RECRUITER") {
    return null;
  }

  const application = applicationData?.data;
  if (!application) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Application not found</p>
      </div>
    );
  }

  const applicant = application.seeker;
  const job = application.job;

  const handleStatusChange = async (newStatus: Application["status"]) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: application.id,
        status: newStatus,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "REVIEWED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "SHORTLISTED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "INTERVIEW_SCHEDULED":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "INTERVIEW_COMPLETED":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "ACCEPTED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleDownloadResume = () => {
    if (applicant?.resume) {
      window.open(applicant.resume, "_blank");
    }
  };

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Applicants
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 flex-shrink-0">
                  <AvatarImage
                    src={applicant?.image || "/placeholder.svg"}
                    alt={applicant?.name}
                  />
                  <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-2xl">
                    {getInitials(applicant?.name || "Unknown")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold mb-2">{applicant?.name}</h1>
                  <p className="text-muted-foreground text-lg mb-4">{applicant?.bio}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(application.status)}>
                      {formatStatus(application.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-emerald-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Mail className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium break-words">{applicant?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Phone className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{applicant?.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <MapPin className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium">{applicant?.location || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Calendar className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                    <p className="font-medium">
                      {applicant?.dateOfBirth
                        ? formatDate(applicant.dateOfBirth)
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-500" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Experience</h3>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-base">{applicant?.experience || "Not provided"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {applicant?.skills && applicant.skills.length > 0 ? (
                    applicant.skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills listed</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-500" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-base whitespace-pre-wrap">
                  {applicant?.education || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applied For</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-muted/20">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={job?.company?.logo || "/placeholder.svg?height=48&width=48"}
                    alt={job?.company?.name || "Company"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{job?.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {job?.company?.name} • {job?.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Applied on {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Change Status</label>
                <Select
                  value={application.status}
                  onValueChange={(value) =>
                    handleStatusChange(value as Application["status"])
                  }
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                    <SelectItem value="INTERVIEW_SCHEDULED">Interview Scheduled</SelectItem>
                    <SelectItem value="INTERVIEW_COMPLETED">Interview Completed</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Applied On</span>
                  <span className="font-medium">{formatDate(application.appliedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{formatDate(application.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={handleDownloadResume}
                disabled={!applicant?.resume}
              >
                <Download className="h-4 w-4 mr-2" />
                {applicant?.resume ? "Download Resume" : "No Resume Available"}
              </Button>
              <InterviewSchedulingModal
                application={application}
                trigger={
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                }
                onSchedule={(interviewData) => {
                  console.log("Interview scheduled:", interviewData);
                  refetch();
                }}
              />
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push(`/jobs/${job?.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Job Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
