import { SpiritSubmissionPortal } from './components/SpiritSubmissionPortal'
import './App.css'

export function App() {
  return (
    <SpiritSubmissionPortal
      onSuccess={(result) => {
        console.log('Submission successfully received:', result.submissionId)
      }}
      onError={(err) => {
        console.error('Submission encountered an error:', err.message)
      }}
    />
  )
}

export default App
