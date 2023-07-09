import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from "react-router-dom";

function AdminViewSchoolProfile() {
  let { userId } = useParams()

  return (
    <div>AdminViewSchoolProfile: {userId}</div>
  )
}

AdminViewSchoolProfile.propTypes = {}

export default AdminViewSchoolProfile
