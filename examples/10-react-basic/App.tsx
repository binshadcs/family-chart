import React from 'react'
import FamilyChart from '@/react/FamilyChart'
import data from '../1-basic-tree/data.json'

const App: React.FC = () => {
  return <FamilyChart data={data} />
}

export default App
