export const jobTypes = [
  { value: "", label: "All Types" },
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
]

export const experienceLevels = [
  { value: "", label: "All Levels" },
  { value: "fresher", label: "Fresher (0-2 years)" },
  { value: "mid", label: "Mid-Level (2-5 years)" },
  { value: "senior", label: "Senior (5+ years)" },
]

export const categories = [
  { value: "", label: "All Categories" },
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Product", label: "Product" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "Data Science", label: "Data Science" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "Operations", label: "Operations" },
]

export const salaryRanges = [
  { value: "", label: "All Ranges" },
  { value: "0-50000", label: "$0 - $50k" },
  { value: "50000-100000", label: "$50k - $100k" },
  { value: "100000-150000", label: "$100k - $150k" },
  { value: "150000-999999", label: "$150k+" },
]

export const salaryMarks = [
  { value: 0, label: "$0" },
  { value: 1, label: "$50k" },
  { value: 2, label: "$100k" },
  { value: 3, label: "$150k+" },
]

const ranges = ["", "0-50000", "50000-100000", "100000-150000", "150000-999999"]

export const getSalaryRangeFromIndex = (index: number): string => {
  return ranges[index] || ""
}

export const getIndexFromSalaryRange = (range: string): number => {
  return ranges.indexOf(range)
}
