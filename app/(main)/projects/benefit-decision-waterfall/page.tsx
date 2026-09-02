'use client'

import BenefitDecisionWaterfallEmbed from './components/BenefitDecisionWaterfallEmbed'
import { BenefitDecisionInput } from './lib'
import React, { useState } from 'react'

export default function () {
  const [preset, setPreset] = useState<BenefitDecisionInput | undefined>()
  const [selected, setSelected] = useState(-1)

  const setNewPreset = (type) => {
    setSelected(type)
    const presets: BenefitDecisionInput[] = [
      {
        hh_size: 3,
        prog_6: true,
        prog_7: false,
        people: [
          {
            person_index: 1,
            jobs: [
              {
                worker_type: 'employee',
                pay_type: 'hourly',
                weeks_worked: 20,
                hours_per_week: 30,
                hourly_rate: 8.5,
                monthly_amount: null,
                part_time_reason: 1,
              },
            ],
          },
          {
            person_index: 2,
            jobs: [],
          },
          {
            person_index: 3,
            jobs: [],
          },
        ],
      },
      {
        hh_size: 1,
        prog_6: false,
        prog_7: true,
        people: [
          {
            person_index: 1,
            jobs: [],
          },
        ],
      },
      {
        hh_size: 4,
        prog_6: false,
        prog_7: false,
        people: [
          {
            person_index: 1,
            jobs: [
              {
                worker_type: 'employee',
                pay_type: 'monthly',
                weeks_worked: 50,
                hours_per_week: 40,
                hourly_rate: null,
                monthly_amount: 3500,
                part_time_reason: null,
              },
            ],
          },
          {
            person_index: 2,
            jobs: [
              {
                worker_type: 'self_employed',
                pay_type: 'hourly',
                weeks_worked: 40,
                hours_per_week: 20,
                hourly_rate: 18.0,
                monthly_amount: null,
                part_time_reason: null,
              },
            ],
          },
          {
            person_index: 3,
            jobs: [],
          },
          {
            person_index: 4,
            jobs: [],
          },
        ],
      },
      {
        hh_size: 2,
        prog_6: false,
        prog_7: false,
        people: [
          {
            person_index: 1,
            jobs: [],
          },
          {
            person_index: 2,
            jobs: [],
          },
        ],
      },
    ]

    setPreset(presets?.[type])
  }

  return (
    <div className="flex flex-col border border-blue-800 text-blue-800">
      <div className="bg-blue-800 text-white">
        <div className="flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-8 pt-38 pb-4 lg:pl-24">
          <div>
            <h1 className="mb-4 max-w-2xl px-0 text-3xl leading-10 font-extrabold tracking-tight text-white sm:text-4xl sm:leading-[3rem] md:text-5xl md:leading-[4rem]">
              Benefit Decision Explainer
            </h1>
            <p className="mb-4 max-w-3xl text-sm leading-5 text-blue-100 sm:text-base sm:leading-6 md:leading-8 lg:text-lg">
              <b>For example purposes only, not to be used to make benefit predictions.</b> This is
              a very simple neural network trained on{' '}
              <a
                href="https://www.census.gov/programs-surveys/sipp/data/datasets.html"
                className="font-bold underline"
              >
                Survey of Income and Program Participation Datasets (2018-2025)
              </a>{' '}
              to predict if you may be eligble for benefits.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-8 max-w-4xl pt-8 pr-10 lg:ml-24">
        As this is a demo you can save a bit of time by clicking a preset bellow:
      </div>
      <div className="mx-8 grid max-w-4xl grid-cols-1 flex-wrap items-center justify-start gap-4 pt-3 md:grid-cols-4 lg:ml-24">
        <button
          onClick={() => setNewPreset(0)}
          disabled={selected !== -1}
          className={`${selected === 0 ? 'disabled:opacity-90' : 'disabled:opacity-40'} flex h-full cursor-pointer items-start rounded border border-blue-700 bg-white px-6 py-2 text-sm shadow disabled:opacity-50`}
        >
          <p>
            <b>Low-Income Single Parent</b> with Toddler
          </p>
        </button>
        <button
          onClick={() => setNewPreset(1)}
          disabled={selected !== -1}
          className={`${selected === 1 ? 'disabled:opacity-90' : 'disabled:opacity-40'} flex h-full cursor-pointer items-start rounded border border-blue-700 bg-white px-6 py-2 text-sm shadow disabled:opacity-50`}
        >
          <p>
            <b>Elderly Person Living Alone</b> with Disability
          </p>
        </button>
        <button
          onClick={() => setNewPreset(2)}
          disabled={selected !== -1}
          className={`${selected === 2 ? 'disabled:opacity-90' : 'disabled:opacity-40'} flex h-full cursor-pointer items-start rounded border border-blue-700 bg-white px-6 py-2 text-sm shadow disabled:opacity-50`}
        >
          <p>
            <b>Working Household</b> with Moderate Income
          </p>
        </button>
        <button
          onClick={() => setNewPreset(3)}
          disabled={selected !== -1}
          className={`${selected === 3 ? 'disabled:opacity-90' : 'disabled:opacity-40'} flex h-full cursor-pointer items-start rounded border border-blue-700 bg-white px-6 py-2 text-sm shadow disabled:opacity-50`}
        >
          <p>
            <b>Unemployed</b> Jobseeker
          </p>
        </button>
      </div>
      <BenefitDecisionWaterfallEmbed preset={preset} />
    </div>
  )
}
