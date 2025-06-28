import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
                                 id,
                                 userId,
                                 role,
                                 type,
                                 techstack,
                                 createdAt,
                             }: InterviewCardProps) => {
    const feedback =
        userId && id
            ? await getFeedbackByInterviewId({ interviewId: id, userId })
            : null;

    const normalizedType = /mix/gi.test(type) ? "mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format(
        "MMM DD, YYYY"
    );

    return (
        <div className="group h-[400px] w-[350px] [perspective:1000px] max-sm:w-full">
            <div className="relative h-full rounded-[30px] bg-gradient-to-br from-zinc-900 to-black shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotate3d(1,1,0,20deg)] group-hover:[box-shadow:rgba(0,0,0,0.3)_30px_50px_25px_-40px,rgba(0,0,0,0.1)_0px_25px_30px_0px] overflow-hidden">

                {/* Glass Layer */}
                <div className="absolute inset-2 rounded-[35px] border border-white/20 bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-sm [transform:translate3d(0,0,25px)]" />

                {/* Content Layer */}
                <div className="relative z-10 px-6 pt-[90px] pb-6 [transform:translate3d(0,0,26px)]">
                    <div className="absolute top-4 right-4 px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium capitalize">
                        {normalizedType}
                    </div>

                    {/* Interview Image */}
                    <Image
                        src={getRandomInterviewCover()}
                        alt="cover-image"
                        width={80}
                        height={80}
                        className="rounded-full object-cover absolute top-5 left-5 border-2 border-white/30 z-20"
                    />

                    <h3 className="mt-3 text-xl font-bold text-white capitalize">{role} Interview</h3>

                    <div className="flex flex-wrap gap-4 text-sm text-zinc-200 mt-3">
                        <div className="flex items-center gap-2">
                            <Image src="/calendar.svg" width={18} height={18} alt="calendar" />
                            <p>{formattedDate}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Image src="/star.svg" width={18} height={18} alt="star" />
                            <p>{feedback?.totalScore || "---"}/100</p>
                        </div>
                    </div>

                    <p className="mt-4 text-zinc-300 text-sm line-clamp-3">
                        {feedback?.finalAssessment ||
                            "You haven't taken this interview yet. Take it now to improve your skills."}
                    </p>

                    <div className="flex items-center justify-between mt-6">
                        <DisplayTechIcons techStack={techstack} />
                        <Link
                            href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
                            className="btn-primary px-4 py-2 text-sm font-medium rounded-md"
                        >
                            {feedback ? "Check Feedback" : "View Interview"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
