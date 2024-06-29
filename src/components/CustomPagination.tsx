import { Pagination } from 'react-bootstrap';

interface CustomPaginationPropType {
  page: number,
  totalPages: any,
  setPage: Function,
  setItemsPerPage: Function
}

function CustomPagination(props: CustomPaginationPropType) {

  const arrayRange = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step + 1 },
      (value, index) => start + index * step);

  const arr = arrayRange(1, props.totalPages, 1)

  return (
    <div className='pagination-row' >
      <div className='left-side float-start'>
        <Pagination>
          <div>Items per page:</div>
          <select className="" onChange={(e: any) => {
            props.setItemsPerPage(e.target.value)
          }}>
            {[10, 20, 50, 100].map((item, index) => {
              return <option key={index} value={item}>{item}</option>
            })}
          </select>
        </Pagination>
      </div>
      <div className='right-side float-end'>
        <Pagination>
          <Pagination.Item active>{props.page} of {props.totalPages} pages</Pagination.Item>
          <select className="" onChange={(e: any) => {
            props.setPage(e.target.value)
          }}>
            {arr.map((item, index) => {
              return <option key={index} value={item}>{item}</option>
            })}
          </select>
          <Pagination.Prev disabled={props.page === 1 ? true : false} onClick={() => props.setPage(props.page - 1)} />
          <Pagination.Next disabled={props.page === props.totalPages ? true : false} onClick={() => props.setPage(props.page + 1)} />
        </Pagination>
      </div>
    </div>
  )
}
export default CustomPagination
