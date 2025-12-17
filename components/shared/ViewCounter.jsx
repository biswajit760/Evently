'use client'; 
import { incrementEventView } from '@/lib/actions/event.actions';
// 1. This line forces this code to run in the Browser (Chrome/Edge), 
// not the Server. This gives us access to 'window' and 'sessionStorage'.

import { useEffect } from 'react';

export default function ViewCounter({ eventId }) {
  useEffect(() => {
    // 2. useEffect runs automatically as soon as the component "mounts" (loads).
    
    // 3. We create a specific ID tag for this event. 
    // If eventId is "abc", the key is "viewed_event_abc".
    const key = `viewed_event_${eventId}`;

    // 4. CHECK THE STAMP: We look in the browser's temporary memory.
    // "Has this user been marked present for this event?"
    const hasViewed = sessionStorage.getItem(key);

    // 5. THE DECISION: 
    // If 'hasViewed' is null (false), it means this is a new visit.
    if (!hasViewed) {
      
      // 6. ACTION: Tell the backend to add +1 to the database.
      incrementEventView(eventId);

      // 7. STAMP THE HAND: Immediately save "true" in storage.
      // Next time the user refreshes, Step 4 will find this "true",
      // and Step 5 will be skipped.
      sessionStorage.setItem(key, 'true');
    }
  }, [eventId]); 
  // The [eventId] array means "re-run this check only if the Event ID changes".

  // 8. This component is invisible. It renders nothing on the screen.
  return null; 
}