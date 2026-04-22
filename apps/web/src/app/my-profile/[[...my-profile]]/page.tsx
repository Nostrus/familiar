import { UserProfile } from '@clerk/nextjs';

export default function MyProfilePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-6 py-12 md:px-10">
      <UserProfile />
    </main>
  );
}
