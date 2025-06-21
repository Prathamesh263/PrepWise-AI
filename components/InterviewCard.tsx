import dayjs from "dayjs";
import Image from "next/image";
import {getRandomInterviewCover} from "@/lib/utils";
import Link from "next/link";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import {getFeedbackByInterviewId} from "@/lib/actions/general.action";


const InterviewCard = async ({id,userId,role,type,techstack,createdAt}:InterviewCardProps) => {
    const feedback=userId && id
        ? await getFeedbackByInterviewId({interviewId:id,userId}):null;
    const normalizedType = /mix/gi.test(type) ? "mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt||createdAt||Date.now()).format("MMM DD, YYYY");

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
                <div>
                    {/* Type Badge */}
                    <div
                        className={
                            "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg"

                        }
                    >
                        <p className="badge-text ">{normalizedType}</p>
                    </div>

                    {/* Cover Image */}
                    <Image
                        src={getRandomInterviewCover()}
                        alt="cover-image"
                        width={90}
                        height={90}
                        className="rounded-full object-fit size-[90px]"
                    />

                    {/* Interview Role */}
                    <h3 className="mt-5 capitalize">{role} Interview</h3>

                    {/* Date & Score */}
                    <div className="flex flex-row gap-5 mt-3">
                        <div className="flex flex-row gap-2">
                            <Image
                                src="/calendar.svg"
                                width={22}
                                height={22}
                                alt="calendar"
                            />
                            <p>{formattedDate}</p>
                        </div>

                        <div className="flex flex-row gap-2 items-center">
                            <Image src="/star.svg" width={22} height={22} alt="star" />
                            <p>{feedback?.totalScore || "---"}/100</p>
                        </div>
                    </div>

                    {/* Feedback or Placeholder Text */}
                    <p className="line-clamp-2 mt-5">
                        {feedback?.finalAssessment ||
                            "You haven't taken this interview yet. Take it now to improve your skills."}
                    </p>
                </div>

                <div className="flex flex-row justify-between">
                    <DisplayTechIcons techStack={techstack}/>

                    <Link
                        href={
                            feedback
                                ? `/interview/${id}/feedback`
                                : `/interview/${id}`
                        }
                        className="btn-primary inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    >
                        {feedback ? "Check Feedback" : "View Interview"}
                    </Link>


                </div>
            </div>
        </div>
    );

};
export default InterviewCard;