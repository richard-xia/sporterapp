import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import SportList from '../SportList'

/*******************************************************************************
 * FilterList Component
 * List component for filtering information on the map using the sports list
 *******************************************************************************/

function FilterList({ filterSports, filter }) {
  const [filterList, setFilterList] = useState([])

  // Update the filter list with the sports selected
  function updateSports(newFilterList) {
    setFilterList(newFilterList)
    filterSports(newFilterList, filter)
  }

  return (
    <Card style={{ position: 'absolute', marginTop: '-300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>Filter by sports</p>
        {filter ? (
          <Button
            style={{ float: 'right' }}
            onClick={() => filterSports(filterList, false)}
          >
            - Hide
          </Button>
        ) : (
          <Button
            style={{ float: 'right' }}
            variant={'secondary'}
            onClick={() => filterSports(filterList, true)}
          >
            + Show
          </Button>
        )}
      </div>
      {filter ? (
        <SportList updateSports={updateSports} sports={filterList} />
      ) : null}
    </Card>
  )
}

export default FilterList
