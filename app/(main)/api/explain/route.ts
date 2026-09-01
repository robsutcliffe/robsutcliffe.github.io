import { NextRequest, NextResponse } from 'next/server'
import {
  explainBenefitDecision,
  BenefitDecisionInput,
  JobPayload,
  PersonPayload,
  WorkerType,
  PayType,
  BenefitKey,
} from '../../projects/benefit-decision-waterfall/lib'

// SECURITY: spaceId/endpoint must NOT come from the client request body.
const SPACE_ID = process.env.GRADIO_SPACE_ID ?? 'firefields/benefit-decision-shap-waterfall'
const ALLOWED_ENDPOINTS = new Set(['/explain_all_benefits_1'])
const DEFAULT_ENDPOINT = '/explain_all_benefits_1'

const EXPECTED_BENEFITS: BenefitKey[] = ['snap', 'wic', 'ssi', 'ui', 'housing', 'medicaid']
const WORKER_TYPES: WorkerType[] = ['employee', 'self_employed']
const PAY_TYPES: PayType[] = ['hourly', 'monthly']

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 10
const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS
}

function validateJob(job: any, path: string): string[] {
  const errors: string[] = []

  if (!WORKER_TYPES.includes(job?.worker_type)) {
    errors.push(`${path}.worker_type must be one of ${WORKER_TYPES.join(', ')}`)
  }
  if (!PAY_TYPES.includes(job?.pay_type)) {
    errors.push(`${path}.pay_type must be one of ${PAY_TYPES.join(', ')}`)
  }

  const weeksWorked = Number(job?.weeks_worked)
  if (!Number.isFinite(weeksWorked) || weeksWorked < 0 || weeksWorked > 52) {
    errors.push(`${path}.weeks_worked must be a number between 0 and 52`)
  }

  const hoursPerWeek = Number(job?.hours_per_week)
  if (!Number.isFinite(hoursPerWeek) || hoursPerWeek < 0 || hoursPerWeek > 60) {
    errors.push(`${path}.hours_per_week must be a number between 0 and 60`)
  }

  if (job?.pay_type === 'hourly') {
    const hourlyRate = Number(job?.hourly_rate)
    if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
      errors.push(`${path}.hourly_rate must be a non-negative number when pay_type is "hourly"`)
    }
  }

  if (job?.pay_type === 'monthly') {
    const monthlyAmount = Number(job?.monthly_amount)
    if (!Number.isFinite(monthlyAmount) || monthlyAmount < 0) {
      errors.push(`${path}.monthly_amount must be a non-negative number when pay_type is "monthly"`)
    }
  }

  if (job?.part_time_reason !== null && job?.part_time_reason !== undefined) {
    const reason = Number(job.part_time_reason)
    if (!Number.isFinite(reason) || reason < 1 || reason > 12) {
      errors.push(`${path}.part_time_reason must be null or a number between 1 and 12`)
    }
  }

  return errors
}

function sanitizeJob(job: any): JobPayload {
  const payType: PayType = job.pay_type === 'monthly' ? 'monthly' : 'hourly'
  return {
    worker_type: job.worker_type === 'self_employed' ? 'self_employed' : 'employee',
    pay_type: payType,
    weeks_worked: Number(job.weeks_worked) || 0,
    hours_per_week: Number(job.hours_per_week) || 0,
    hourly_rate: payType === 'hourly' ? Number(job.hourly_rate) || 0 : null,
    monthly_amount: payType === 'monthly' ? Number(job.monthly_amount) || 0 : null,
    part_time_reason:
      job.part_time_reason === null || job.part_time_reason === undefined
        ? null
        : Number(job.part_time_reason),
  }
}

export async function POST(req: NextRequest) {
  const hfToken = process.env.HF_TOKEN
  if (!hfToken) {
    console.error('HF_TOKEN is not set in the server environment.')
    return NextResponse.json(
      { error: 'Server misconfiguration: missing HF token.' },
      { status: 500 }
    )
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()

    const requestedEndpoint = typeof body.endpoint === 'string' ? body.endpoint : DEFAULT_ENDPOINT
    const endpoint = ALLOWED_ENDPOINTS.has(requestedEndpoint) ? requestedEndpoint : DEFAULT_ENDPOINT

    const hhSize = Number(body.hh_size)
    const rawPeople = Array.isArray(body.people) ? body.people : []

    const errors: string[] = []

    if (!Number.isFinite(hhSize) || hhSize < 1 || hhSize > 15) {
      errors.push('hh_size must be a number between 1 and 15')
    }
    // month_ref removed — no longer part of the input schema.
    if (rawPeople.length === 0) {
      errors.push('people must be a non-empty array (one entry per household member)')
    }
    if (rawPeople.length > 15) {
      errors.push('people cannot contain more than 15 entries')
    }

    rawPeople.forEach((person: any, i: number) => {
      const jobs = Array.isArray(person?.jobs) ? person.jobs : []
      if (jobs.length > 7) {
        errors.push(`people[${i}].jobs cannot contain more than 7 entries`)
      }
      jobs.forEach((job: any, j: number) => {
        errors.push(...validateJob(job, `people[${i}].jobs[${j}]`))
      })
    })

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('; ') }, { status: 400 })
    }

    const people: PersonPayload[] = rawPeople.map((person: any, i: number) => ({
      person_index: Number(person?.person_index) || i + 1,
      jobs: (Array.isArray(person?.jobs) ? person.jobs : []).map(sanitizeJob),
    }))

    const inputData: BenefitDecisionInput = {
      hh_size: hhSize,
      people,
      prog_6: Boolean(body.prog_6),
      prog_7: Boolean(body.prog_7),
    }

    const response = await explainBenefitDecision(inputData, {
      spaceId: SPACE_ID,
      endpoint,
      hfToken,
    })

    if (!response.success) {
      return NextResponse.json(
        {
          error: response.error,
          rawData: response.rawData ?? null,
          input: inputData,
        },
        { status: 502 }
      )
    }

    const missingBenefits = EXPECTED_BENEFITS.filter((b) => !response.benefits?.[b])
    if (missingBenefits.length > 0) {
      console.warn(`Benefit explainer response missing: ${missingBenefits.join(', ')}`)
    }

    return NextResponse.json({
      success: true,
      benefits: response.benefits,
      input: inputData,
    })
  } catch (err: any) {
    console.error('Benefit explainer route failed:', err)
    return NextResponse.json(
      {
        error: err?.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}
