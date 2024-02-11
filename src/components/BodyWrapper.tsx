import { ReactNode } from 'react'

interface BodyWrapperPropType {
  title?: string,
  subTitle?: string,
  children: ReactNode,
  rightHandSide?: ReactNode,
}
const BodyWrapper = (props: BodyWrapperPropType) => {
  return (
    <div className='body-wrapper'>
      <div className='body-wrapper-heading mb-3'>
        <div className='body-wrapper-heading-left'>
          <div className="title">{props.title}</div>
          <div className="sub-title">{props.subTitle}</div>
        </div>
        <div className='body-wrapper-heading-right'>{props.rightHandSide} </div>
      </div>
      <div className='body-wrapper-content mt-3'>
        {props.children}
      </div>
    </div>
  )
}

export default BodyWrapper
