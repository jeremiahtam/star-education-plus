export default function AdminMetricBox(props: any) {
  return (
    <div className='metric-box'>
      <div className='left-side' style={{ backgroundColor: props.bgColor }}>
        {props.icon}
      </div>
      <div className='right-side'>
        <div className='metric-title'>{props.title}</div>
        <div className='metric-value'>{props.value}</div>
      </div>
    </div>
  )
}
