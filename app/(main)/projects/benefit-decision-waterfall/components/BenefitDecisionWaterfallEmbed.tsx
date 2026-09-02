'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { SnapDecisionInput, DEFAULT_SNAP_INPUT, BenefitDecisionInput } from '../lib'
import Results from './Results'
import Wizard from './Wizard'
import MonthDropdown from './MonthDropdown'

const MIN_COMBINED_HOURS_FOR_MULTI_JOB_RULE = 35
const CHARACTERISTIC_LABELS: { key: keyof SnapDecisionInput; label: string; desc: string }[] = [
  {
    key: 'prog_6',
    label: 'Child Under 5 in Household',
    desc: 'Household contains at least one dependent infant or toddler',
  },
  {
    key: 'prog_7',
    label: 'Disability-Related Need',
    desc: 'Household member meets qualifying medical or disability criteria',
  },
]

// SIPP Flashcard "I — Reasons for Part-Time Work" (2023 booklet).
// https://www.census.gov/programs-surveys/sipp/information/sipp-survparticp-materials/flashcard-booklets-2023.html
const PART_TIME_REASONS: { code: number; label: string }[] = [
  { code: 1, label: 'Could not find full-time job' },
  { code: 2, label: 'Wanted to work part-time' },
  { code: 3, label: 'Temporarily unable to work full-time because of injury' },
  { code: 4, label: 'Temporarily unable to work full-time because of illness' },
  { code: 5, label: 'Unable to work full-time because of chronic health condition or disability' },
  { code: 6, label: 'Taking care of children or other persons' },
  { code: 7, label: 'Full-time workweek is less than 35 hours' },
  { code: 8, label: 'Slack work or business conditions' },
  { code: 9, label: 'Participated in a job-sharing arrangement' },
  { code: 10, label: 'On vacation' },
  { code: 11, label: 'In school' },
  { code: 12, label: 'Other' },
]
const PART_TIME_THRESHOLD_HOURS = 35
// Per the official SIPP interviewer instructions: respondents who work
// part-time because they hold multiple part-time jobs are coded as
// "Wanted to work part-time" (code 2), rather than being asked to pick a
// reason for each job individually. We mirror that convention here.
const MULTIPLE_JOBS_PART_TIME_CODE = 2

const MAX_SLIDER_HOURLY = 100
const MAX_SLIDER_MONTHLY = 10000
const MAX_HOURS_PER_WEEK = 60
const MAX_WEEKS_WORKED = 52
const FEDERAL_MIN_WAGE = 7.25 // unchanged since 2009; tipped/youth/student
// categories can legally fall below this, so it's a marker, not a hard floor.
const WEEKS_PER_MONTH = 4.33

let idCounter = 0
const nextId = () => `id-${++idCounter}`

type PayType = 'hourly' | 'monthly' | ''
type WorkerType = 'employee' | 'self_employed' | ''

interface JobEntry {
  id: string
  workerType: WorkerType
  payType: PayType
  weeksWorked: number // 0-52
  hoursPerWeek: number // 0-60
  hourlyRate: number // used when payType === 'hourly'
  monthlyAmount: number // used when payType === 'monthly'
  partTimeReason: number | '' // code from PART_TIME_REASONS, only relevant if hoursPerWeek < 35
}

interface PersonEntry {
  id: string
  label: string
  jobs: JobEntry[]
}

const STEPS = [
  { label: 'Hosehold Size' },
  { label: 'Income' },
  { label: 'Characteristics' },
  { label: 'Results' },
]

const makeJob = (): JobEntry => ({
  id: nextId(),
  workerType: '',
  payType: '',
  weeksWorked: 52,
  hoursPerWeek: 40,
  hourlyRate: 30,
  monthlyAmount: 5500,
  partTimeReason: '',
})
const makePerson = (index: number): PersonEntry => ({
  id: nextId(),
  label: `Person ${index}`,
  jobs: [],
})

const isPartTimeJob = (job: JobEntry) =>
  job.hoursPerWeek > 0 && job.hoursPerWeek < PART_TIME_THRESHOLD_HOURS

const estimateJobIncome = (job: JobEntry): number => {
  if (job.payType === 'hourly') {
    return job.hourlyRate * job.hoursPerWeek * job.weeksWorked
  }
  if (job.payType === 'monthly') {
    return job.monthlyAmount * (job.weeksWorked / WEEKS_PER_MONTH)
  }
  return 0
}

// If a person now has 2+ part-time jobs, force every one of those jobs'
// partTimeReason to "Wanted to work part-time" (SIPP convention) instead
// of leaving it to the dropdown. If they drop back to 0-1 part-time jobs,
// leave whatever reason is set as-is so the dropdown becomes editable
// again without surprising the user by wiping their answer.
const applyMultipleJobsPartTimeRule = (person: PersonEntry): PersonEntry => {
  const partTimeJobs = person.jobs.filter(isPartTimeJob)
  if (partTimeJobs.length <= 1) return person

  const combinedHours = partTimeJobs.reduce((sum, j) => sum + j.hoursPerWeek, 0)
  if (combinedHours < MIN_COMBINED_HOURS_FOR_MULTI_JOB_RULE) return person

  return {
    ...person,
    jobs: person.jobs.map((j) =>
      isPartTimeJob(j) ? { ...j, partTimeReason: MULTIPLE_JOBS_PART_TIME_CODE } : j
    ),
  }
}

export default function BenefitDecisionWaterfallEmbed({
  preset,
}: {
  preset?: BenefitDecisionInput
}) {
  const [formData, setFormData] = useState<SnapDecisionInput>(DEFAULT_SNAP_INPUT)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [showResults, setShowResults] = useState<boolean>(false)

  const [householdSize, setHouseholdSize] = useState<number>(1)
  const [householdSizeInput, setHouseholdSizeInput] = useState<string>('1')
  const [jobInputDrafts, setJobInputDrafts] = useState<Record<string, string>>({})
  const [people, setPeople] = useState<PersonEntry[]>([makePerson(1)])
  const [step, setStep] = useState<number>(0)

  const handleInputChange = (
    field: keyof SnapDecisionInput,
    value: number | boolean | null | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || value === 0 ? Number(value) : null,
    }))
  }

  const handleHouseholdSizeChange = (rawValue: string) => {
    const size = Math.max(1, Math.min(15, Number(rawValue) || 1))
    setHouseholdSize(size)
    setHouseholdSizeInput(String(size))
    setPeople((prev) => {
      if (size > prev.length) {
        const additions = Array.from({ length: size - prev.length }, (_, i) =>
          makePerson(prev.length + i + 1)
        )
        return [...prev, ...additions]
      }
      return prev.slice(0, size)
    })
  }

  useEffect(() => {
    if (preset) {
      const size = preset.hh_size
      setHouseholdSize(size)
      setHouseholdSizeInput(String(size))

      setFormData((prev) => ({
        ...prev,
        prog_6: preset.prog_6,
        prog_7: preset.prog_7,
      }))

      setPeople(
        preset.people.map((p) => ({
          id: nextId(),
          label: `Person ${p.person_index}`,
          jobs: p.jobs.map((j) => ({
            id: nextId(),
            workerType: (j.worker_type as WorkerType) || '',
            payType: (j.pay_type as PayType) || '',
            weeksWorked: j.weeks_worked,
            hoursPerWeek: j.hours_per_week,
            hourlyRate: j.hourly_rate ?? 30,
            monthlyAmount: j.monthly_amount ?? 5500,
            partTimeReason: j.part_time_reason ?? '',
          })),
        }))
      )

      runPrediction(preset)
      setStep(3)
    }
  }, [preset])

  const handleJobNumberBlur = (
    personId: string,
    jobId: string,
    field: 'weeksWorked' | 'hoursPerWeek',
    rawValue: string
  ) => {
    const draftKey = `${jobId}-${field}`
    const min = field === 'weeksWorked' ? 1 : 1
    const max = field === 'weeksWorked' ? MAX_WEEKS_WORKED : MAX_HOURS_PER_WEEK
    const clamped = Math.max(min, Math.min(max, Number(rawValue) || min))
    updateJob(personId, jobId, field, clamped)
    setJobInputDrafts((prev) => {
      const next = { ...prev }
      delete next[draftKey]
      return next
    })
  }

  const addJob = (personId: string) =>
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, jobs: [...p.jobs, makeJob()] } : p))
    )

  const removeJob = (personId: string, jobId: string) =>
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id !== personId) return p
        const updated = { ...p, jobs: p.jobs.filter((j) => j.id !== jobId) }
        return applyMultipleJobsPartTimeRule(updated)
      })
    )

  const updateJob = (
    personId: string,
    jobId: string,
    field: keyof JobEntry,
    value: number | string
  ) =>
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id !== personId) return p
        const updated = {
          ...p,
          jobs: p.jobs.map((j) => (j.id === jobId ? { ...j, [field]: value } : j)),
        }
        // Re-check the multi-part-time-job rule any time hours change,
        // since that's what determines part-time status.
        return field === 'hoursPerWeek' ? applyMultipleJobsPartTimeRule(updated) : updated
      })
    )

  const allJobs = useMemo(() => people.flatMap((p) => p.jobs), [people])
  const totalIncome = useMemo(
    () => allJobs.reduce((sum, j) => sum + estimateJobIncome(j), 0),
    [allJobs]
  )

  // Builds the full request payload: household size, the two household
  // characteristic flags, and a people[] array where every person carries
  // their own jobs[] — nothing is flattened or collapsed into "job1"/
  // "job2" here (that collapsing, if any, now happens model-side).
  const buildApiPayload = (): BenefitDecisionInput => ({
    hh_size: householdSize,
    prog_6: Boolean(formData.prog_6),
    prog_7: Boolean(formData.prog_7),
    people: people.map((p, idx) => ({
      person_index: idx + 1,
      jobs: p.jobs.map((j) => ({
        worker_type: j.workerType || 'employee',
        pay_type: j.payType || 'hourly',
        weeks_worked: j.weeksWorked,
        hours_per_week: j.hoursPerWeek,
        hourly_rate: j.payType === 'hourly' ? j.hourlyRate : null,
        monthly_amount: j.payType === 'monthly' ? j.monthlyAmount : null,
        part_time_reason: j.partTimeReason === '' ? null : Number(j.partTimeReason),
      })),
    })),
  })

  const runPrediction = async (payloadOverride?: BenefitDecisionInput) => {
    setIsLoading(true)
    setError(null)

    const payload = payloadOverride ?? buildApiPayload()
    setShowResults(true)

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await response.json()

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to execute prediction on Gradio Space')
      }

      setResult(json.benefits)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const minWageMarkerPct = (FEDERAL_MIN_WAGE / MAX_SLIDER_HOURLY) * 100

  return (
    <div className="mx-8 my-8 max-w-4xl border border-blue-800 lg:ml-24">
      <div className="bg-yellow-50/50">
        <Wizard current={step} steps={STEPS} setStep={setStep} />

        <>
          {/* Section 1: Household Size */}
          {step === 0 && (
            <div className="bg-white">
              <h4 className="px-8 py-4 text-xl font-black text-blue-800">1. Household Size</h4>
              <div className="border-t border-yellow-100 bg-white p-6">
                <fieldset className="group flex flex-col gap-0">
                  <label className="z-10 -mb-4 ml-4 flex h-8 w-fit flex-row items-center gap-2 bg-white px-2 text-sm tracking-wide text-blue-700 group-focus-within:text-blue-500">
                    Number of People in Household
                  </label>
                  <input
                    className="h-16 w-full border border-blue-700 bg-transparent p-4 px-6 text-xl text-blue-700 transition-opacity focus:border-blue-500 focus:ring-0 disabled:opacity-50"
                    type="number"
                    min="1"
                    max="15"
                    value={householdSizeInput}
                    onChange={(e) => setHouseholdSizeInput(e.target.value)}
                    onBlur={(e) => handleHouseholdSizeChange(e.target.value)}
                  />
                </fieldset>
              </div>
            </div>
          )}

          {step === 1 && (
            <>
              {/* Section 2: Jobs per person */}
              <div className="bg-white">
                <div className="flex items-center justify-between px-8 py-4">
                  <h4 className="text-xl font-black text-blue-800">2. Jobs Per Person</h4>
                </div>

                <div className="border-t border-yellow-400">
                  {people.map((person, pIdx) => {
                    const partTimeJobs = person.jobs.filter(isPartTimeJob)
                    const combinedPartTimeHours = partTimeJobs.reduce(
                      (sum, j) => sum + j.hoursPerWeek,
                      0
                    )
                    const partTimeJobCount = partTimeJobs.length
                    const meetsMultiJobThreshold =
                      partTimeJobCount > 1 &&
                      combinedPartTimeHours >= MIN_COMBINED_HOURS_FOR_MULTI_JOB_RULE

                    return (
                      <div key={person.id} className="m-6 border border-yellow-400 bg-yellow-50">
                        <span className="block p-6 font-serif text-xl font-light text-blue-900">
                          {person.label}
                        </span>

                        {person.jobs.length === 0 && (
                          <p className="pb-2 pl-6 text-sm text-blue-800/70 italic">
                            No jobs added for this person.
                          </p>
                        )}

                        <div className="mb-6 ml-4 space-y-2">
                          {person.jobs.map((job, jIdx) => {
                            const isPartTime = isPartTimeJob(job)
                            const autoAssigned = isPartTime && meetsMultiJobThreshold

                            return (
                              <div key={job.id} className="p-4">
                                <div className="mb-3 flex items-center justify-between">
                                  <span className="text-lg font-semibold text-blue-800">
                                    Job {jIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeJob(person.id, job.id)}
                                    className="cursor-pointer rounded border border-yellow-400 px-4 py-2 text-sm transition-all hover:border-red-500 hover:bg-red-500/5 hover:text-red-500"
                                  >
                                    Remove Job {jIdx + 1}
                                    <b className="ml-2 font-black">X</b>
                                  </button>
                                </div>

                                {/* Step A: classify the job before asking numbers */}
                                <div className="border-l border-blue-700/30 pb-4 pl-4">
                                  <div className="mb-4 grid grid-cols-2 gap-6">
                                    <div>
                                      <MonthDropdown
                                        label="Employment Type"
                                        value={job.workerType}
                                        onChange={(e) =>
                                          updateJob(person.id, job.id, 'workerType', e.target.value)
                                        }
                                        placeholder="Select..."
                                        options={[
                                          { value: 'employee', label: 'Employee' },
                                          { value: 'self_employed', label: 'Self-Employed' },
                                        ]}
                                      />
                                    </div>

                                    <div>
                                      <MonthDropdown
                                        label="Pay Structure"
                                        value={job.payType}
                                        onChange={(e) =>
                                          updateJob(person.id, job.id, 'payType', e.target.value)
                                        }
                                        placeholder="Select..."
                                        options={[
                                          { value: 'hourly', label: 'Paid Hourly' },
                                          { value: 'monthly', label: 'Paid Monthly' },
                                        ]}
                                      />
                                    </div>
                                  </div>

                                  {/* Step B: only appears once both classifiers are set. */}
                                  {job.workerType && job.payType ? (
                                    <>
                                      <div className="flex flex-wrap items-end gap-6">
                                        <div className="flex flex-1 flex-row gap-4">
                                          <fieldset className="group flex flex-1 flex-col gap-0">
                                            <label className="z-10 mx-2 -mb-4 flex h-8 w-fit flex-row items-center gap-2 bg-yellow-50 px-2 text-xs tracking-wide text-blue-700 group-focus-within:text-blue-500">
                                              Weeks per Year
                                            </label>
                                            <input
                                              className="h-12 w-full rounded-none border border-blue-700 bg-transparent p-2 px-4 text-sm font-bold text-blue-700 transition-opacity focus:ring-0 disabled:opacity-50"
                                              type="number"
                                              min="1"
                                              max={MAX_WEEKS_WORKED}
                                              value={
                                                jobInputDrafts[`${job.id}-weeksWorked`] ??
                                                job.weeksWorked
                                              }
                                              onChange={(e) =>
                                                setJobInputDrafts((prev) => ({
                                                  ...prev,
                                                  [`${job.id}-weeksWorked`]: e.target.value,
                                                }))
                                              }
                                              onBlur={(e) =>
                                                handleJobNumberBlur(
                                                  person.id,
                                                  job.id,
                                                  'weeksWorked',
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </fieldset>

                                          <fieldset className="group flex flex-1 flex-col gap-0">
                                            <label className="z-10 mx-2 -mb-4 flex h-8 w-fit flex-row items-center gap-2 bg-yellow-50 px-2 text-xs tracking-wide text-blue-700 group-focus-within:text-blue-500">
                                              Hours per Week
                                            </label>
                                            <input
                                              className="h-12 w-full rounded-none border border-blue-700 bg-transparent p-2 px-4 text-sm font-bold text-blue-700 transition-opacity focus:border-blue-500 focus:ring-0 disabled:opacity-50"
                                              type="number"
                                              min="1"
                                              max={MAX_HOURS_PER_WEEK}
                                              value={
                                                jobInputDrafts[`${job.id}-hoursPerWeek`] ??
                                                job.hoursPerWeek
                                              }
                                              onChange={(e) =>
                                                setJobInputDrafts((prev) => ({
                                                  ...prev,
                                                  [`${job.id}-hoursPerWeek`]: e.target.value,
                                                }))
                                              }
                                              onBlur={(e) =>
                                                handleJobNumberBlur(
                                                  person.id,
                                                  job.id,
                                                  'hoursPerWeek',
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </fieldset>
                                        </div>

                                        {job.payType === 'hourly' ? (
                                          <div className="min-w-48 flex-1">
                                            <div className="flex justify-between text-xs">
                                              <label className="text-blue-700">Hourly Wage</label>
                                              <span className="font-mono font-bold text-blue-700">
                                                {job.hourlyRate >= MAX_SLIDER_HOURLY
                                                  ? `$${MAX_SLIDER_HOURLY}+/hr`
                                                  : `$${job.hourlyRate.toFixed(2)}/hr`}
                                              </span>
                                            </div>
                                            <div className="relative pt-1">
                                              <input
                                                type="range"
                                                min="0"
                                                max={MAX_SLIDER_HOURLY}
                                                step="0.25"
                                                value={job.hourlyRate}
                                                onChange={(e) =>
                                                  updateJob(
                                                    person.id,
                                                    job.id,
                                                    'hourlyRate',
                                                    Number(e.target.value)
                                                  )
                                                }
                                                className="h-2 w-full cursor-pointer appearance-none border border-blue-700 accent-blue-700"
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="min-w-48 flex-1">
                                            <div className="flex justify-between text-xs">
                                              <label className="text-blue-700">
                                                Monthly Income
                                              </label>
                                              <span className="font-mono font-bold text-blue-700">
                                                {job.monthlyAmount >= MAX_SLIDER_MONTHLY
                                                  ? `$${MAX_SLIDER_MONTHLY.toLocaleString()}+/mo`
                                                  : `$${job.monthlyAmount.toLocaleString()}/mo`}
                                              </span>
                                            </div>
                                            <input
                                              type="range"
                                              min="0"
                                              max={MAX_SLIDER_MONTHLY}
                                              step="50"
                                              value={job.monthlyAmount}
                                              onChange={(e) =>
                                                updateJob(
                                                  person.id,
                                                  job.id,
                                                  'monthlyAmount',
                                                  Number(e.target.value)
                                                )
                                              }
                                              className="mt-1 h-2 w-full cursor-pointer appearance-none border border-blue-700 accent-blue-700"
                                            />
                                          </div>
                                        )}
                                      </div>

                                      {isPartTime && !autoAssigned && (
                                        <div className="mt-3">
                                          <MonthDropdown
                                            label="Reason for Part-Time Work"
                                            value={job.partTimeReason}
                                            onChange={(e) =>
                                              updateJob(
                                                person.id,
                                                job.id,
                                                'partTimeReason',
                                                e.target.value
                                              )
                                            }
                                            placeholder="Select a reason..."
                                            options={PART_TIME_REASONS.map((r) => ({
                                              value: r.code,
                                              label: r.label,
                                            }))}
                                          />
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <p className="pl-2 text-sm text-blue-800/70 italic">
                                      Select employment type and pay structure to continue.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => addJob(person.id)}
                          className="w-full cursor-pointer border-t border-yellow-400 bg-yellow-100 p-4 text-sm font-bold text-blue-800"
                        >
                          + Add Job for {person.label}
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-end gap-8 p-6">
                  <div className="text-right">
                    <div className="text-xs tracking-wide text-blue-700">
                      {allJobs.length === 1 ? 'job' : 'jobs'} total
                    </div>
                    <div className="font-mono text-lg font-bold text-blue-900">
                      {allJobs.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs tracking-wide text-blue-700">
                      Estimated Total Household Income
                    </div>
                    <div className="font-mono text-lg font-bold text-blue-900">
                      ${Math.round(totalIncome).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <div className="bg-white">
              <h4 className="px-8 py-4 text-xl font-black text-blue-800">
                3. Household Characteristics
              </h4>

              <div className="border-t border-yellow-400 py-4 pl-2">
                {CHARACTERISTIC_LABELS.map((prog, idx) => {
                  const isChecked = Boolean(formData[prog.key])
                  return (
                    <label
                      key={String(prog.key)}
                      className="flex cursor-pointer items-start gap-4 p-6 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleInputChange(prog.key, e.target.checked)}
                        className="mt-1.5 h-6 w-6 border-blue-700/40 text-blue-800 focus:ring-blue-800"
                      />
                      <div className="flex-1 text-lg">
                        <div className="flex items-center gap-1.5 font-semibold text-blue-900">
                          {prog.label}
                        </div>
                        <p className="text-base leading-tight text-blue-800/70">{prog.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="bg-white">
              <h4 className="px-8 py-4 text-xl font-black text-blue-800">4. Results</h4>
              <div className="border-t border-yellow-400">
                <Results
                  error={error}
                  result={result}
                  isLoading={isLoading}
                  runPrediction={runPrediction}
                />
              </div>
            </div>
          )}
        </>
      </div>
      {step !== 3 && (
        <div className="flex justify-end gap-4 bg-blue-800 p-6">
          {!!STEPS[step - 1] && (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              disabled={isLoading}
              className="cursor-pointer rounded border border-white px-6 py-4 text-base font-bold text-white transition-colors hover:bg-yellow-100/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Return to {STEPS[step - 1].label}
            </button>
          )}
          {!!STEPS[step + 1] && (
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              disabled={isLoading}
              className="flex cursor-pointer items-center gap-2 rounded border bg-white px-6 py-4 text-base font-bold text-blue-800 transition-colors hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to {STEPS[step + 1].label}
              <svg className="h-4 w-4 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  fill="#241169"
                  d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
