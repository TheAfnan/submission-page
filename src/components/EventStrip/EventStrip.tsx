import React from 'react'

export interface EventStripProps {
  deadlineIso?: string
  eventDate?: string
  roundTitle?: string
  eventTitle?: string
  mode?: 'demo' | 'production'
}

export const EventStrip: React.FC<EventStripProps> = () => {
  return null
}
