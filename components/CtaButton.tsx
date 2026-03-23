import Button from './Button'

interface CtaButtonProps {
  text: string
}

const CtaButton = ({ text }: CtaButtonProps) => {
  return (
    <div className="not-prose -mx-4 my-2 lg:mx-0">
      <Button
        href="/contact"
        text={text}
        extraClasses="bg-red-500 justify-start px-0"
        lineOpacity="0.2"
        noHeight={true}
      />
    </div>
  )
}

export default CtaButton
