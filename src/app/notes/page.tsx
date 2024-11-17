
import React from 'react'
import MainNotes from './components/MainNotes'
import { getNotes } from '../actions/getNotes'

const NotesPage = async () => {
  const notes = await getNotes()
  if ('error' in notes) {
    return <div>Error: {notes.error}</div>;
}
  return (
    <div>
      <MainNotes notes={notes.Notes}/>
    </div>
  )
}

export default NotesPage