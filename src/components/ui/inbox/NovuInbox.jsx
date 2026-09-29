import { Inbox } from '@novu/react';
import { useUser } from '@clerk/clerk-react';
import { useTheme } from 'next-themes';
import { dark } from '@novu/react/themes';

/**
 * The notification bell in the admin header.
 *
 * Three things were left as they came out of Novu's installer, and together
 * they meant this bell could never show anyone their own notifications.
 *
 * The subscriber id was a string typed into the file. Every admin who opened
 * the panel was shown one particular person's notifications rather than their
 * own, and as soon as there is a second admin that is someone else's inbox on
 * their screen. Novu knows a person by the id the API registered them under,
 * which is their Clerk id: it is what createOrUpdateNovuSubscriber writes and
 * what the admins topic subscribes, so that is what belongs here.
 *
 * The identifier was read from VITE_NOVU_APP_ID while the deploy wrote
 * NOVU_APP_ID, and Vite only hands the browser variables that start with
 * VITE_. The value arrived empty every time, and an empty identifier renders a
 * bell that never fills, which reads as "nothing new" rather than "not
 * configured". The deploy now writes the name this file reads.
 *
 * The tabs were Novu's documentation examples: Promotions, Security, High
 * Priority, Critical Alerts. This platform sends none of those. An admin
 * receives one kind of notification, so one list is the honest shape.
 */
export function NovuInbox() {
  const { user, isLoaded } = useUser();
  const { resolvedTheme } = useTheme();

  const applicationIdentifier = import.meta.env.VITE_NOVU_APP_ID;

  // Better no bell than a bell that is permanently, silently empty.
  if (!isLoaded || !user?.id || !applicationIdentifier) {
    return null;
  }

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={user.id}
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
    />
  );
}
