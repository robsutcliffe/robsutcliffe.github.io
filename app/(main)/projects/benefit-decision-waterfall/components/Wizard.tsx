type WizardStep = {
  label: string
  description?: string
}

type WizardProps = {
  current: number
  steps: WizardStep[]
  setStep: (index: number) => void
  allowClickNav?: boolean
}

export default function Wizard({ current, steps, setStep, allowClickNav = true }: WizardProps) {
  return (
    <div className="not-prose border-b border-blue-800 bg-yellow-100 py-4">
      {/* Stepper row: equal-width grid tracks, one per step */}
      <div
        className="-mx-8 grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, index) => {
          const isDone = index < current
          const isActive = index === current
          const isFirst = index === 0
          // The connector immediately before this circle is "filled" once we've
          // reached or passed this step.
          const isLineFilled = index <= current

          return (
            <div key={index} className="relative flex flex-col items-center">
              {/* Connecting line: runs from the center of the previous circle to
                  the center of this circle, so it visually reaches into both. */}
              {!isFirst && (
                <div
                  className={`absolute top-4 -left-1/2 h-0 w-full border-t sm:top-6 ${
                    isLineFilled
                      ? 'border-solid border-blue-800'
                      : 'border-dashed border-blue-700/50'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Circle */}
              <button
                type="button"
                disabled={!allowClickNav}
                onClick={() => setStep(index)}
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors sm:h-12 sm:w-12 ${
                  isActive
                    ? 'border-blue-800 bg-blue-800 text-yellow-50'
                    : isDone
                      ? 'border-blue-700 bg-blue-800 text-yellow-50 sm:bg-yellow-50 sm:text-blue-800'
                      : 'border-dashed border-blue-700/50 bg-yellow-50 text-blue-800/40'
                } ${allowClickNav ? 'cursor-pointer hover:border-yellow-400' : 'cursor-default'}`}
              >
                {index + 1}
              </button>

              {/* Label below circle, centered within this step's grid track */}
              <div className="mt-2 max-w-28 text-center sm:max-w-36">
                <p
                  className={`text-xs font-extrabold sm:text-sm ${
                    isActive ? 'text-blue-800' : isDone ? 'text-blue-800/80' : 'text-blue-800/40'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-sm leading-4 text-blue-800/60 sm:text-xs">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
