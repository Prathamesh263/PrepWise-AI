import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";
import InterviewCard from "@/components/InterviewCard";
import { SignOutButton } from "@/components/SignOutButton";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
    getInterviewByUserId,
    getLatestInterviews,
} from "@/lib/actions/general.action";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
    const user = await getCurrentUser();

    const [userInterviews, allInterview] = await Promise.all([
        getInterviewByUserId(user?.id!),
        getLatestInterviews({ userId: user?.id! }),
    ]);

    const hasPastInterviews = userInterviews?.length > 0;
    const hasUpcomingInterviews = allInterview?.length > 0;

    return (
        
        <main className="w-full">
            {/* Hero 3D Section */}
            <div className="flex justify-end p-4">
        {user && <SignOutButton />}
      </div>
            <section className="w-full px-4 sm:px-6 lg:px-8">
                <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden rounded-xl">
                    <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

                    <div className="flex flex-col md:flex-row h-full">
                        {/* Left content */}
                        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                            <div className="flex flex-col gap-6 max-w-lg">
                                <h2>PrepWiSe</h2>
                                                     <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                                                     <p className="text-lg">
                                                         Practice real interview questions & get instant feedback
                                                     </p>

                                                     <Button asChild className="btn-primary max-sm:w-full">
                                                         <Link href="/interview">Start an Interview</Link>
                                                     </Button>
                                                 </div>
                        </div>

                        {/* Right content */}
                        <div className="flex-1 relative min-h-[300px]">
                            <SplineScene
                                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </Card>
            </section>

            {/* User Interviews Section */}
            <section className="flex flex-col gap-6 mt-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold">Your Interviews</h2>
                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews?.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                userId={user?.id}
                                id={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </section>

            {/* Latest Interview Section */}
            <section className="flex flex-col gap-6 mt-12 px-4 sm:px-6 lg:px-8 mb-12">
                <h2 className="text-2xl font-semibold">Take Interviews</h2>
                <div className="interviews-section">
                    {hasUpcomingInterviews ? (
                        allInterview?.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                userId={user?.id}
                                id={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>There are no interviews available</p>
                    )}
                </div>
            </section>
        </main>
    );
}
