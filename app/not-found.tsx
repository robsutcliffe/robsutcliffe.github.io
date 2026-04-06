import Link from '@/components/Link'
import DotBackground from '@/components/DotBackground'
import Button from '@/components/Button'

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center border-b border-blue-100/50 bg-blue-800 text-center">
      <div className="z-20 pt-24">
        <div className="pb-8">
          <h1 className="text-6xl leading-9 tracking-tighter text-yellow-200 md:px-6 md:text-8xl md:leading-14">
            404
          </h1>
        </div>
        <div className="max-w-md">
          <p className="mb-0 text-xl leading-normal font-extrabold text-white md:text-2xl">
            Sorry we couldn't find this page.
          </p>
          <p className="mb-8 text-white/80">
            Maybe you can find something else that interests you from the home page or the menu at
            the top right.
          </p>
          <div className="mx-auto w-fit">
            <Button
              href="/"
              text="Back to homepage"
              extraClasses="!text-blue-800 !bg-white"
              noPadding={true}
              outline={true}
              lineOpacity={0.2}
              noHeight={true}
            />
          </div>
        </div>
      </div>
      <DotBackground fill="#ffffff" opacity="0.1" />
    </div>
  )
}
