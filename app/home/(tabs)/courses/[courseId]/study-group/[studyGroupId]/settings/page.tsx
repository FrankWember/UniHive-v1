import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getStudyGroupById } from '@/actions/study-groups'
import { currentUser } from '@/lib/auth'
import { AddMemberForm } from './_components/add-member-form'
import { MembersList } from './_components/members-list'
import { JoinRequestsList } from './_components/join-requests-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BackButton } from '@/components/back-button'

export default async function StudyGroupSettingsPage({ params }: { params: { studyGroupId: string } }) {
  const user = await currentUser()
  if (!user) return notFound()

  const studyGroup = await getStudyGroupById(params.studyGroupId)
  if (!studyGroup) return notFound()

  const userMember = studyGroup.members.find(member => member.userId === user.id)
  if (!userMember?.isAdmin) return notFound()

  const initialJoinRequests = studyGroup.members.filter(member=>member.joinRequestAccepted===false)

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Study Group Settings</h1>
      </div>
      <div className="flex flex-col w-full h-full items-center justify-center space-y-8 my-40">
        <Card className="max-w-md w-full mx-3">
          <CardHeader>
            <CardTitle>Add Members</CardTitle>
            <CardDescription>Add new members to the group using their emails</CardDescription>
          </CardHeader>
          <CardContent>
            <AddMemberForm studyGroupId={studyGroup.id} />
          </CardContent>
        </Card>
        <Card className="max-w-md w-full mx-3">
          <CardHeader>
            <CardTitle>Members List</CardTitle>
            <CardDescription>Here is the list of members of this study group</CardDescription>
          </CardHeader>
          <CardContent>
            <MembersList members={studyGroup.members} studyGroupId={studyGroup.id} />
          </CardContent>
        </Card>
        <Card className="max-w-md w-full mx-3">
          <CardHeader>
            <CardTitle>Join Requests</CardTitle>
            <CardDescription>The users below requested to join this study group</CardDescription>
          </CardHeader>
          <CardContent>
            <JoinRequestsList studyGroupId={studyGroup.id} initialJoinRequests={initialJoinRequests} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}