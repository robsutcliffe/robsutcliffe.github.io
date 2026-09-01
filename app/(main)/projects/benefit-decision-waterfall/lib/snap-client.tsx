import { Client } from '@gradio/client'

// --- Rich, person/job-level input schema ---
export type WorkerType = 'employee' | 'self_employed'
export type PayType = 'hourly' | 'monthly'

export interface JobPayload {
  worker_type: WorkerType
  pay_type: PayType
  weeks_worked: number // 0-52
  hours_per_week: number // 0-60
  hourly_rate: number | null // set when pay_type === 'hourly', else null
  monthly_amount: number | null // set when pay_type === 'monthly', else null
  part_time_reason: number | null // 1-12 (SIPP Flashcard I code), only when hours_per_week < 35
}

export interface PersonPayload {
  person_index: number // 1-based, matches "Person 1", "Person 2", ...
  jobs: JobPayload[]
}

// NOTE: month_ref removed — it was confounded with SIPP's survey
// administrative timing / seasonal employment patterns rather than being
// causally meaningful for a new applicant, so it was dropped from the
// retrained model entirely (not sent, not validated, not a feature).
export interface BenefitDecisionInput {
  hh_size: number // 1-15
  people: PersonPayload[]
  prog_6: boolean // child under 5 in household
  prog_7: boolean // disability-related need
}

// Kept for anything still referencing the old flat shape (e.g. preset
// definitions for prog_6/prog_7 toggles) — no longer sent to the API
// directly, but harmless to keep around during the transition.
export interface SnapDecisionInput {
  hh_size: number
  n_jobs: number
  job1_wks_cat: number
  job1_rate_cat: number
  job2_rate_cat: number
  inc_raw: number
  em_wks: number
  prog_6: boolean
  prog_7: boolean
}

export interface SnapFeatureAttribution {
  feature: string
  label: string
  value: number | string | boolean
  value_str: string
  attribution: number
  cumulative: number
}

export type BenefitKey = 'snap' | 'wic' | 'ssi' | 'ui' | 'housing' | 'medicaid'

export const BENEFIT_LABELS: Record<BenefitKey, string> = {
  snap: 'SNAP (Food Assistance)',
  wic: 'WIC (Nutrition Aid)',
  ssi: 'SSI (Supplemental Security Income)',
  ui: 'Unemployment Insurance (UI)',
  housing: 'Housing Assistance',
  medicaid: 'Medicaid',
}

const BENEFIT_KEYS: BenefitKey[] = ['snap', 'wic', 'ssi', 'ui', 'housing', 'medicaid']

export interface BenefitPrediction {
  benefit_name: BenefitKey
  predicted_score: number
  population_baseline: number
  shap_values: SnapFeatureAttribution[]
}

export interface SnapDecisionResponse {
  success: boolean
  benefits?: Partial<Record<BenefitKey, BenefitPrediction>>
  rawData?: any
  error?: string
}

export const DEFAULT_SPACE_ID =
  process.env.NEXT_PUBLIC_GRADIO_SPACE_ID || 'firefields/benefit-decision-shap-waterfall'

export const DEFAULT_ENDPOINT = '/explain_all_benefits_1'

export const DEFAULT_SNAP_INPUT: SnapDecisionInput = {
  hh_size: 3,
  n_jobs: 1,
  job1_wks_cat: 20,
  job1_rate_cat: 2,
  job2_rate_cat: 0,
  inc_raw: 12500,
  em_wks: 40,
  prog_6: true,
  prog_7: false,
}

function tryParseBenefitDict(
  candidate: any
): Partial<Record<BenefitKey, BenefitPrediction>> | null {
  let obj = candidate

  if (typeof obj === 'string') {
    try {
      obj = JSON.parse(obj)
    } catch {
      return null
    }
  }

  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null
  if (!BENEFIT_KEYS.some((k) => k in obj)) return null

  const out: Partial<Record<BenefitKey, BenefitPrediction>> = {}
  for (const key of BENEFIT_KEYS) {
    const entry = obj[key]
    if (entry) {
      out[key] = {
        benefit_name: (entry.benefit_name as BenefitKey) ?? key,
        predicted_score: Number(entry.predicted_score ?? 0),
        population_baseline: Number(entry.population_baseline ?? 0),
        shap_values: Array.isArray(entry.shap_values) ? entry.shap_values : [],
      }
    }
  }
  return out
}

function parseBenefitsPayload(data: any): Partial<Record<BenefitKey, BenefitPrediction>> | null {
  if (!data) return null
  const items = Array.isArray(data) ? data : [data]

  for (const item of items) {
    const parsed = tryParseBenefitDict(item)
    if (parsed && Object.keys(parsed).length > 0) return parsed
  }
  return null
}

/**
 * Connect to the Hugging Face Gradio Space and request SHAP explanations
 * for every benefit. The deployed function takes a single parameter,
 * `payload_json`, which is the entire household payload serialized to a
 * JSON string. month_ref is no longer part of that payload.
 */
export async function explainBenefitDecision(
  input: BenefitDecisionInput,
  options?: {
    spaceId?: string
    hfToken?: string
    endpoint?: string
  }
): Promise<SnapDecisionResponse> {
  const spaceId = options?.spaceId || DEFAULT_SPACE_ID
  const endpoint = options?.endpoint || DEFAULT_ENDPOINT
  const hfToken = options?.hfToken || process.env.HF_TOKEN

  try {
    const client = await Client.connect(spaceId, {
      ...(hfToken ? { hf_token: hfToken as `hf_${string}` } : {}),
    })

    const payloadJson = JSON.stringify(input)

    let result: any

    try {
      result = await client.predict(endpoint, { payload_json: payloadJson } as any)
    } catch (namedErr: any) {
      try {
        result = await client.predict(endpoint, [payloadJson] as any)
      } catch (posErr: any) {
        throw new Error(
          `Failed to call Gradio space "${spaceId}" at endpoint "${endpoint}": ${namedErr.message || posErr.message}`
        )
      }
    }

    const data = result?.data
    const benefits = parseBenefitsPayload(data)

    if (!benefits || Object.keys(benefits).length === 0) {
      return {
        success: false,
        error:
          'Gradio Space returned data in an unrecognized shape (expected one output element to contain an object or JSON string keyed by benefit name).',
        rawData: data,
      }
    }

    return {
      success: true,
      benefits,
      rawData: data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error occurred while calling Gradio Space',
    }
  }
}
