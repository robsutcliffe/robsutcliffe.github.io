import Button from './Button'

interface CtaButtonProps {
  text: string
}

const CtaButton = ({ text }: CtaButtonProps) => {
  return (
    <div className="not-prose my-6">
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
