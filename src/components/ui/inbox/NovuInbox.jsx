import { Inbox } from '@novu/react';
import { useTheme } from 'next-themes';
import { dark } from '@novu/react/themes';

// import { dark } from '@novu/react/themes'; => To enable dark theme support, uncomment this line.

export function NovuInbox() {
 // Using provided subscriber ID - replace with your actual subscriber ID from your auth system
 const temporarySubscriberId = "686ced939915b98edbebd9b5";
 const { resolvedTheme } = useTheme();

  const tabs = [
    // Basic tab with no filtering (shows all notifications)
    {
      label: 'All',
      filter: { tags: [] },
    },
    
    // Filter by tags - shows notifications from workflows tagged "promotions"
    {
      label: 'Promotions',
      filter: { tags: ['promotions'] },
    },
    
    // Filter by multiple tags - shows notifications with either "security" OR "alert" tags
    {
      label: 'Security',
      filter: { tags: ['security', 'alert'] },
    },
    
    // Filter by data attributes - shows notifications with priority="high" in payload
    {
      label: 'High Priority',
      filter: {
        data: { priority: 'high' },
      },
    },
    
    // Combined filtering - shows notifications that:
    // 1. Come from workflows tagged "alert" AND
    // 2. Have priority="high" in their data payload
    {
      label: 'Critical Alerts',
      filter: { 
        tags: ['alert'],
        data: { priority: 'high' }
      },
    },
  ];

  return <Inbox 
    applicationIdentifier={import.meta.env.VITE_NOVU_APP_ID || ''}
    subscriberId={temporarySubscriberId}
    
    tabs={tabs} appearance={{
      baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      variables: {
        // The `variables` object allows you to define global styling properties that can be reused throughout the inbox.
        // Learn more: https://docs.novu.co/platform/inbox/react/styling#variables
      },
      elements: {
        // The `elements` object allows you to define styles for these components.
        // Learn more: https://docs.novu.co/platform/inbox/react/styling#elements
      },
      icons: {
        // The `icons` object allows you to define custom icons for the inbox.
      },
    }} 
  />;
}