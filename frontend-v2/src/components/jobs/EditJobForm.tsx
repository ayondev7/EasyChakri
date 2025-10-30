"use client"

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Loader2 } from 'lucide-react'
import { useUpdateJob } from '@/hooks/jobHooks'
import type { Job } from '@/types'

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  type: z.string().min(1),
  experience: z.string().min(1),
  location: z.string().min(1),
  salary: z.string().min(1),
  category: z.string().min(1),
  isRemote: z.boolean().optional(),
  deadline: z.string().optional(),
  requirements: z.array(z.string().min(1)).min(1),
  responsibilities: z.array(z.string().min(1)).min(1),
  benefits: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof jobSchema>

export default function EditJobForm({ job }: { job: Job }) {
  const router = useRouter()
  const updateJobMutation = useUpdateJob()
  const [skills, setSkills] = useState<string[]>(job.skills || [])
  const [newSkill, setNewSkill] = useState('')

  const form = useForm<FormValues>({
    defaultValues: {
      title: job.title || '',
      description: job.description || '',
      type: job.type || '',
      experience: job.experience || '',
      location: job.location || '',
      salary: job.salary || '',
      category: job.category || '',
      isRemote: job.isRemote || false,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      benefits: job.benefits || [],
      skills: job.skills || [],
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form

  const responsibilities = watch('responsibilities') || []
  const requirements = watch('requirements') || []
  const benefits = watch('benefits') || []

  const [responsibilitiesText, setResponsibilitiesText] = useState<string>('')
  const [requirementsText, setRequirementsText] = useState<string>('')
  const [benefitsText, setBenefitsText] = useState<string>('')

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((s) => [...s, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((s) => s.filter((skill) => skill !== skillToRemove))
  }

  const onSubmit = (values: FormValues) => {
    const payload: any = {
      id: job.id,
      ...values,
      skills,
    }

    updateJobMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Job updated successfully')
        router.push('/recruiter/dashboard')
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Failed to update job. Please try again.'
        toast.error(errorMessage)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" {...register('title')} placeholder="e.g., Senior Frontend Developer" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full-time</SelectItem>
                      <SelectItem value="PART_TIME">Part-time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                      <SelectItem value="INTERNSHIP">Internship</SelectItem>
                      <SelectItem value="REMOTE">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-xs text-destructive">Type is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level *</Label>
              <Controller
                control={control}
                name="experience"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="2-4">2-4 years</SelectItem>
                      <SelectItem value="4-6">4-6 years</SelectItem>
                      <SelectItem value="6+">6+ years</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.experience && <p className="text-xs text-destructive">Experience is required</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" {...register('location')} placeholder="e.g., Dhaka, Bangladesh" />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range *</Label>
              <Input id="salary" {...register('salary')} placeholder="e.g., 50,000 - 80,000 BDT" />
              {errors.salary && <p className="text-xs text-destructive">{errors.salary.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input id="category" {...register('category')} placeholder="e.g., Software Development" />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input id="deadline" type="date" {...register('deadline')} />
              {errors.deadline && <p className="text-xs text-destructive">{errors.deadline.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register('description')} placeholder="Provide a detailed description of the role..." rows={6} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Key Responsibilities *</Label>
            <div className="flex gap-2">
              <Textarea
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                placeholder="Type responsibilities. Press Enter to add (Shift+Enter for newline)"
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    const items = responsibilitiesText
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean)
                    if (!items.length) return
                    const existing = responsibilities
                    const next = [...existing, ...items]
                    setValue('responsibilities', next)
                    setResponsibilitiesText('')
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {responsibilities.filter(r => r.trim() !== '').map((r: string, i: number) => (
                <div key={i} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-2">
                  <span className="text-sm">{r}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const original = responsibilities
                      const index = original.indexOf(r)
                      if (index !== -1) {
                        const arr = original.slice()
                        arr.splice(index, 1)
                        setValue('responsibilities', arr.filter(r => r.trim() !== ''))
                      }
                    }}
                    className="opacity-80 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Requirements *</Label>
            <div className="flex gap-2">
              <Textarea
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder="Type requirements. Press Enter to add (Shift+Enter for newline)"
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    const items = requirementsText
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean)
                    if (!items.length) return
                    const existing = requirements
                    const next = [...existing, ...items]
                    setValue('requirements', next)
                    setRequirementsText('')
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.filter(r => r.trim() !== '').map((r: string, i: number) => (
                <div key={i} className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 flex items-center gap-2">
                  <span className="text-sm">{r}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const original = requirements
                      const index = original.indexOf(r)
                      if (index !== -1) {
                        const arr = original.slice()
                        arr.splice(index, 1)
                        setValue('requirements', arr.filter(r => r.trim() !== ''))
                      }
                    }}
                    className="opacity-80 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Benefits</Label>
            <div className="flex gap-2">
              <Textarea
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                placeholder="Type benefits. Press Enter to add (Shift+Enter for newline)"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    const items = benefitsText
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean)
                    if (!items.length) return
                    const existing = benefits
                    const next = [...existing, ...items]
                    setValue('benefits', next)
                    setBenefitsText('')
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {benefits.filter(b => b.trim() !== '').map((b: string, i: number) => (
                <div key={i} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 flex items-center gap-2">
                  <span className="text-sm">{b}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const original = benefits
                      const index = original.indexOf(b)
                      if (index !== -1) {
                        const arr = original.slice()
                        arr.splice(index, 1)
                        setValue('benefits', arr.filter(r => r.trim() !== ''))
                      }
                    }}
                    className="opacity-80 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a required skill. Press Enter to add"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill()
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                {skill}
                <button onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-emerald-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1" disabled={updateJobMutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" disabled={updateJobMutation.isPending || isSubmitting}>
          {updateJobMutation.isPending || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Job...
            </>
          ) : (
            'Update Job'
          )}
        </Button>
      </div>
    </form>
  )
}
