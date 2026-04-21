import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hallowed Ground — The Fallen | Library of War',
  description:
    'An interactive global memorial map of American KIA, MIA, WIA, and POW soldiers across every major conflict. Every marker is a life.',
  openGraph: {
    title: 'Hallowed Ground — The Fallen',
    description: 'Every marker is a life.',
    type: 'website',
  },
};

export default function FallenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Platform layout — HallowedGroundMap owns the full viewport shell
  return <>{children}</>;
}
