"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Header/Footer provided by root layout
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockJobs,
  mockApplications,
  mockUsers,
  mockInterviews,
} from "@/utils/MockData";
import {
  ArrowLeft,
  Phone,
  MapPin,
  FileText,
  Download,
  Eye,
  Briefcase,
  AtSign,
} from "lucide-react";
import { formatDate, getInitials } from "@/utils/utils";
import type { Application } from "@/types";
import { InterviewSchedulingModal } from "@/components/InterviewSchedulingModal";

export default function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);

  useEffect(() => {
    // Don't redirect while session is still loading
    if (isLoading) return;

    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || !user) {
      router.push("/auth/signin");
      return;
    }

    if (user.role !== "recruiter") {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, user, router, isLoading]);

  useEffect(() => {
    const jobApplications = mockApplications.filter((app) => app.jobId === id);
    setApplications(jobApplications);
  }, [id]);

  // Show loading state while session is being checked
  if (isLoading) {
    return null;
  }

  // Don't render page until authenticated
  if (!isAuthenticated || !user || user.role !== "recruiter") {
    return null;
  }

  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return null;
  }

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const handleStatusChange = (
    applicationId: string,
    newStatus: Application["status"]
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
    if (selectedApplicant?.id === applicationId) {
      setSelectedApplicant((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
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
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "ACCEPTED":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getApplicantDetails = (seekerId: string) => {
    return mockUsers.find((u) => u.id === seekerId);
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((app) => app.status === "PENDING").length,
    reviewed: applications.filter((app) => app.status === "REVIEWED").length,
    shortlisted: applications.filter((app) => app.status === "SHORTLISTED")
      .length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
    accepted: applications.filter((app) => app.status === "ACCEPTED").length,
  };

  if (selectedApplicant) {
    const applicantUser = getApplicantDetails(selectedApplicant.seekerId);

    return (
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedApplicant(null)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applicants
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={applicantUser?.avatar || "/placeholder.svg"}
                          alt={applicantUser?.name}
                        />
                        <AvatarFallback className="bg-cyan-500/10 text-cyan-500 text-xl">
                          {getInitials(applicantUser?.name || "Unknown")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold mb-1">
                          {applicantUser?.name}
                        </h1>
                        <p className="text-muted-foreground">
                          {applicantUser?.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-sm">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                      <span>{applicantUser?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{applicantUser?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{applicantUser?.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{applicantUser?.experience} experience</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {applicantUser?.skills?.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{applicantUser?.education}</p>
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
                    <label className="text-sm font-medium mb-2 block">
                      Change Status
                    </label>
                    <Select
                      value={selectedApplicant.status}
                      onValueChange={(value) =>
                        handleStatusChange(
                          selectedApplicant.id,
                          value as Application["status"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REVIEWED">Reviewed</SelectItem>
                        <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Applied</span>
                      <span className="font-medium">
                        {formatDate(selectedApplicant.appliedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Current Status
                      </span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(selectedApplicant.status)}
                      >
                        {selectedApplicant.status.charAt(0).toUpperCase() +
                          selectedApplicant.status
                            .slice(1)
                            .toLowerCase()
                            .replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                  <InterviewSchedulingModal
                    application={selectedApplicant}
                    trigger={
                      <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                        <Eye className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                    }
                    onSchedule={(interviewData) => {
                      // TODO: Handle interview scheduling
                      console.log("Interview scheduled:", interviewData);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
          <p className="text-muted-foreground">
            {applications.length}{" "}
            {applications.length === 1 ? "applicant" : "applicants"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Applicants</CardTitle>
              <Tabs
                value={filterStatus}
                onValueChange={setFilterStatus}
                className="w-full md:w-auto"
              >
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
                  <TabsTrigger value="all">
                    All ({statusCounts.all})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({statusCounts.pending})
                  </TabsTrigger>
                  <TabsTrigger value="reviewed">
                    Reviewed ({statusCounts.reviewed})
                  </TabsTrigger>
                  <TabsTrigger value="shortlisted">
                    Shortlisted ({statusCounts.shortlisted})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({statusCounts.rejected})
                  </TabsTrigger>
                  <TabsTrigger value="accepted">
                    Accepted ({statusCounts.accepted})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {filteredApplications.length > 0 ? (
              <div className="space-y-3">
                {filteredApplications.map((application) => {
                  const applicantUser = getApplicantDetails(
                    application.seekerId
                  );
                  return (
                    <div
                      key={application.id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-border/40 hover:border-cyan-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedApplicant(application)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={applicantUser?.avatar || "/placeholder.svg"}
                          alt={applicantUser?.name}
                        />
                        <AvatarFallback className="bg-cyan-500/10 text-cyan-500">
                          {getInitials(applicantUser?.name || "Unknown")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">
                          {applicantUser?.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <AtSign className="h-3 w-3" />
                            {applicantUser?.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {applicantUser?.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {applicantUser?.experience}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Applied {formatDate(application.appliedAt)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 md:items-end">
                        <div className="flex items-center gap-2">
                          <Select
                            value={application.status}
                            onValueChange={(value) => {
                              handleStatusChange(
                                application.id,
                                value as Application["status"]
                              );
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="REVIEWED">Reviewed</SelectItem>
                              <SelectItem value="SHORTLISTED">
                                Shortlisted
                              </SelectItem>
                              <SelectItem value="INTERVIEW_SCHEDULED">
                                Interview Scheduled
                              </SelectItem>
                              <SelectItem value="INTERVIEW_COMPLETED">
                                Interview Completed
                              </SelectItem>
                              <SelectItem value="REJECTED">Rejected</SelectItem>
                              <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplicant(application);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {filterStatus === "all"
                    ? "No applicants yet for this position"
                    : `No ${filterStatus} applicants`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
