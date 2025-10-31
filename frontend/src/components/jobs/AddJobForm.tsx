"use client"

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Loader2 } from 'lucide-react'
import { useCreateJob } from '@/hooks/jobHooks'
import { InputField, TextareaField, SelectField } from '@/components/form'

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

export default function AddJobForm({ companyId }: { companyId: string | null }) {
  const router = useRouter()
  const createJobMutation = useCreateJob()
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      type: '',
      experience: '',
      location: '',
      salary: '',
      category: '',
      isRemote: false,
      deadline: '',
      requirements: [],
      responsibilities: [],
      benefits: [],
      skills: [],
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
      ...values,
      skills,
    }

    if (companyId) payload.companyId = companyId

    createJobMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Job posted successfully')
        router.push('/recruiter/dashboard')
      },
      onError: (error) => {
        toast.error((error as any)?.response?.data?.message || 'Failed to create job')
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
          <InputField 
            id="title" 
            label="Job Title *"
            placeholder="e.g., Senior Frontend Developer"
            {...register('title')}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <SelectField
                    options={[
                      { value: "FULL_TIME", label: "Full Time" },
                      { value: "PART_TIME", label: "Part Time" },
                      { value: "CONTRACT", label: "Contract" },
                      { value: "INTERNSHIP", label: "Internship" },
                      { value: "REMOTE", label: "Remote" },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select job type"
                  />
                )}
              />
              {errors.type && <p className="text-xs text-destructive">Type is required</p>}
            </div>

            <div className="space-y-2">
              <Controller
                control={control}
                name="experience"
                render={({ field }) => (
                  <SelectField
                    options={[
                      { value: "0-2", label: "0-2 years" },
                      { value: "2-4", label: "2-4 years" },
                      { value: "4-6", label: "4-6 years" },
                      { value: "6+", label: "6+ years" },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select experience"
                  />
                )}
              />
              {errors.experience && <p className="text-xs text-destructive">Experience is required</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="location"
              label="Location *"
              placeholder="e.g., Dhaka, Bangladesh"
              {...register('location')}
            />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}

            <InputField
              id="salary"
              label="Salary Range *"
              placeholder="e.g., 50,000 - 80,000 BDT"
              {...register('salary')}
            />
            {errors.salary && <p className="text-xs text-destructive">{errors.salary.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="category"
              label="Category *"
              placeholder="e.g., Software Development"
              {...register('category')}
            />
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}

            <InputField
              id="deadline"
              label="Application Deadline"
              type="date"
              {...register('deadline')}
            />
            {errors.deadline && <p className="text-xs text-destructive">{errors.deadline.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextareaField
            id="description"
            label="Description *"
            placeholder="Provide a detailed description of the role..."
            rows={6}
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}

          <div className="space-y-2">
            <TextareaField
              id="responsibilities"
              label="Key Responsibilities *"
              value={responsibilitiesText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResponsibilitiesText(e.target.value)}
              placeholder="Type responsibilities. Press Enter to add (Shift+Enter for newline)"
              rows={4}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
            <TextareaField
              id="requirements"
              label="Requirements *"
              value={requirementsText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequirementsText(e.target.value)}
              placeholder="Type requirements. Press Enter to add (Shift+Enter for newline)"
              rows={4}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
            <TextareaField
              id="benefits"
              label="Benefits"
              value={benefitsText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBenefitsText(e.target.value)}
              placeholder="Type benefits. Press Enter to add (Shift+Enter for newline)"
              rows={3}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
          <InputField
            id="skill-input"
            value={newSkill}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
            placeholder="Add a required skill. Press Enter to add"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddSkill()
              }
            }}
          />
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
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1" disabled={createJobMutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" disabled={createJobMutation.isPending || isSubmitting}>
          {createJobMutation.isPending || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting Job...
            </>
          ) : (
            'Post Job'
          )}
        </Button>
      </div>
    </form>
  )
}