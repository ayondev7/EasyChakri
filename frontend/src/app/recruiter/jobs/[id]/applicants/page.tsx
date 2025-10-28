"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useJob } from "@/hooks/jobHooks"
import { useJobApplications } from "@/hooks/applicationHooks"
import type { Application, Job, User } from "@/types"
import { ArrowLeft } from "lucide-react"
import TabsField from "@/components/form/TabsField"
import ApplicantCard from "@/components/applicants/ApplicantCard"
import ApplicantDetails from "@/components/applicants/ApplicantDetails"
import EmptyState from "@/components/EmptyState"
import { Briefcase } from "lucide-react"
import { APPLICANT_TABS } from "@/constants/tabConstants"
import Loader from "@/components/Loader"

export default function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);

  const { data: jobData, isLoading: jobLoading } = useJob(id);
  const { data: applicationsData, isLoading: applicationsLoading, refetch } = useJobApplications(id);

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

  if (authLoading || jobLoading || applicationsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "RECRUITER") {
    return null;
  }

  const job = jobData?.data;
  const applications = applicationsData?.data || [];

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const handleStatusChange = (
    applicationId: string,
    newStatus: Application["status"]
  ) => {
    refetch();
    if (selectedApplicant?.id === applicationId) {
      setSelectedApplicant((prev) =>
        prev ? { ...prev, status: newStatus } : null
      )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "REVIEWED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "SHORTLISTED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "ACCEPTED":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((app) => app.status === "PENDING").length,
    reviewed: applications.filter((app) => app.status === "REVIEWED").length,
    shortlisted: applications.filter((app) => app.status === "SHORTLISTED").length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
    accepted: applications.filter((app) => app.status === "ACCEPTED").length,
  }

  const tabOptions = APPLICANT_TABS.map((tab) => ({
    ...tab,
    count: statusCounts[tab.value as keyof typeof statusCounts] || 0,
  }))

  if (selectedApplicant) {
    return (
      <ApplicantDetails
        application={selectedApplicant}
        applicantUser={selectedApplicant.seeker}
        onBack={() => setSelectedApplicant(null)}
        onStatusChange={handleStatusChange}
        getStatusColor={getStatusColor}
      />
    )
  }

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{job?.title || "Job Details"}</h1>
        <p className="text-muted-foreground">
          {applications.length} {applications.length === 1 ? "applicant" : "applicants"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Applicants</CardTitle>
            <TabsField options={tabOptions} value={filterStatus} onChange={setFilterStatus} fullWidth={false} />
          </div>
        </CardHeader>
        <CardContent>
          {filteredApplications.length > 0 ? (
            <div className="space-y-3">
              {filteredApplications.map((application) => (
                <ApplicantCard
                  key={application.id}
                  application={application}
                  applicantUser={application.seeker}
                  onStatusChange={handleStatusChange}
                  onViewDetails={setSelectedApplicant}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title={filterStatus === "all" ? "No applicants yet for this position" : `No ${filterStatus} applicants`}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
