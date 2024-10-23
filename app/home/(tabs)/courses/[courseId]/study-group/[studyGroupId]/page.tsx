import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getStudyGroupById } from '@/actions/study-groups'
import { currentUser } from '@/lib/auth'
import { StudyGroupContent } from './_components/study-group-content'
import { ExitStudyGroupButton } from './_components/exit-study-group-button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GoBackButton } from './_components/go-back-button'
import { BackButton } from '@/components/back-button'

export default async function StudyGroupPage({ params }: { params: { courseId: string, studyGroupId: string } }) {
  const user = await currentUser()
  if (!user) return notFound()

  const studyGroup = await getStudyGroupById(params.studyGroupId)
  if (!studyGroup) return notFound()

  const userMember = studyGroup.members.find(member => member.userId === user.id)
  const isAdmin = userMember?.isAdmin || false
  const isAccepted = userMember?.joinRequestAccepted || false

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex items-center space-x-4">
          <BackButton />
          <h1 className="text-2xl font-bold">{studyGroup.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {isAdmin && (
            <Link href={`/home/courses/${params.courseId}/study-group/${studyGroup.id}/settings`}>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <ExitStudyGroupButton studyGroupId={studyGroup.id} />
        </div>
      </div>
      <div className='flex items-center justify-center mt-20'>
        {isAccepted ? (
          <Suspense fallback={<div>Loading study group content...</div>}>
            <StudyGroupContent studyGroupId={studyGroup.id} />
          </Suspense>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
              <CardDescription className="max-w-sm">Your request to join this study group is pending approval from an admin.</CardDescription>
            </CardHeader>
            <CardFooter>
              <GoBackButton />
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}